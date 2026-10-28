import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { expenseService } from '../services/expenseService';
import { paymentService } from '../services/paymentService';
import { userService } from '../services/userService';
import type { Expense } from '../types/expense';
import type { Payment } from '../types/payment';
import type { User } from '../types/user';
import { formatMoney } from '../util/formatters';

type Period = 'month' | 'year';
type Transaction =
  | {
      kind: 'received';
      id: string;
      amount: number;
      currency: string;
      at: string;
      recorderId: string;
      description: string;
      status: string;
    }
  | {
      kind: 'spent';
      id: string;
      amount: number;
      currency: string;
      at: string;
      recorderId: string;
      description: string;
      status: string;
    };

function periodBounds(period: Period, year: number, month: number) {
  const from =
    period === 'year' ? new Date(year, 0, 1) : new Date(year, month, 1);
  const to =
    period === 'year' ? new Date(year + 1, 0, 1) : new Date(year, month + 1, 1);
  return {
    dateFrom: from.toISOString(),
    dateTo: new Date(to.getTime() - 1).toISOString(),
  };
}

async function listAll<T>(
  fetchPage: (
    page: number,
  ) => Promise<{ data: T[]; meta: { total: number; limit: number } }>,
): Promise<T[]> {
  const first = await fetchPage(1);
  const pageCount = Math.ceil(first.meta.total / first.meta.limit);
  const remaining = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) =>
      fetchPage(index + 2),
    ),
  );
  return [first.data, ...remaining.map((page) => page.data)].flat();
}

function csvCell(value: string | number): string {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export function FinanceReport() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>('month');
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [recorderId, setRecorderId] = useState('');
  const bounds = useMemo(
    () => periodBounds(period, year, month),
    [period, year, month],
  );
  const key = ['finance-report', period, year, month] as const;

  const report = useQuery({
    queryKey: key,
    queryFn: async () => {
      const [payments, expenses] = await Promise.all([
        listAll((page) =>
          paymentService.list({
            page,
            limit: 100,
            dateFrom: bounds.dateFrom,
            dateTo: bounds.dateTo,
          }),
        ),
        listAll((page) =>
          expenseService.list({
            page,
            limit: 100,
            dateFrom: bounds.dateFrom,
            dateTo: bounds.dateTo,
          }),
        ),
      ]);
      return { payments, expenses };
    },
    enabled: user?.role === 'OWNER',
  });
  const cashiers = useQuery({
    queryKey: ['finance-report-cashiers'],
    queryFn: async () => {
      const roles = ['CASHIER', 'MANAGER', 'OWNER'] as const;
      const usersByRole = await Promise.all(
        roles.map(async (role) => {
          const first = await userService.list({ page: 1, limit: 100, role });
          const pages = await Promise.all(
            Array.from(
              {
                length: Math.max(
                  0,
                  Math.ceil(first.meta.total / first.meta.limit) - 1,
                ),
              },
              (_, index) =>
                userService.list({ page: index + 2, limit: 100, role }),
            ),
          );
          return [first.data, ...pages.map((page) => page.data)].flat();
        }),
      );
      return usersByRole.flat();
    },
    enabled: user?.role === 'OWNER',
  });

  const names = useMemo(
    () =>
      new Map(
        (cashiers.data ?? []).map((cashier: User) => [
          cashier.id,
          cashier.fullName,
        ]),
      ),
    [cashiers.data],
  );
  const transactions = useMemo<Transaction[]>(() => {
    const payments: Transaction[] = (report.data?.payments ?? []).map(
      (payment: Payment) => ({
        kind: 'received',
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        at: payment.createdAt,
        recorderId: payment.recordedByUserId,
        description: `${payment.method.replace(/_/g, ' ')}${
          payment.reference ? ` · ${payment.reference}` : ''
        }`,
        status: payment.status,
      }),
    );
    const expenses: Transaction[] = (report.data?.expenses ?? []).map(
      (expense: Expense) => ({
        kind: 'spent',
        id: expense.id,
        amount: expense.amount,
        currency: expense.currency,
        at: expense.createdAt,
        recorderId: expense.recordedByUserId,
        description: `${expense.category.replace(/_/g, ' ')} · ${
          expense.description
        }`,
        status: expense.status,
      }),
    );
    return [...payments, ...expenses]
      .filter(
        (transaction) => !recorderId || transaction.recorderId === recorderId,
      )
      .sort((left, right) => right.at.localeCompare(left.at));
  }, [report.data, recorderId]);

  const currencyTotals = useMemo(() => {
    const totals = new Map<string, { received: number; spent: number }>();
    for (const transaction of transactions) {
      const totalsForCurrency = totals.get(transaction.currency) ?? {
        received: 0,
        spent: 0,
      };
      if (transaction.kind === 'received' && transaction.status === 'COMPLETED')
        totalsForCurrency.received += transaction.amount;
      if (transaction.kind === 'spent' && transaction.status === 'RECORDED')
        totalsForCurrency.spent += transaction.amount;
      totals.set(transaction.currency, totalsForCurrency);
    }
    return [...totals.entries()].map(([currency, totalsForCurrency]) => ({
      currency,
      ...totalsForCurrency,
      balance: totalsForCurrency.received - totalsForCurrency.spent,
    }));
  }, [transactions]);

  const reportLabel =
    period === 'year'
      ? String(year)
      : `${new Intl.DateTimeFormat(undefined, { month: 'long' }).format(
          new Date(year, month, 1),
        )} ${year}`;

  const downloadReport = () => {
    const rows = [
      [
        'Type',
        'Recorded at',
        'Recorded by',
        'Description',
        'Amount',
        'Currency',
        'Status',
      ],
      ...transactions.map((transaction) => [
        transaction.kind === 'received' ? 'Money received' : 'Expense',
        new Date(transaction.at).toLocaleString(),
        names.get(transaction.recorderId) ?? 'Former or unknown staff',
        transaction.description,
        transaction.amount,
        transaction.currency,
        transaction.status,
      ]),
    ];
    const csv = rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(
      new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = `akarabo-finance-${period}-${
      period === 'year' ? year : `${year}-${String(month + 1).padStart(2, '0')}`
    }.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title="Financial reports"
        subtitle="Review money received and expenses by date or cashier, then export a monthly or yearly report."
        actions={
          <button
            className="ak-button ak-button--primary"
            onClick={downloadReport}
            disabled={report.isLoading || !transactions.length}
          >
            Download report
          </button>
        }
      />

      <section className="ak-card ak-mb-6">
        <div className="ak-card__body ak-form--finance ak-row ak-gap-3 ak-wrap">
          <label className="ak-field">
            <span className="ak-field__label">Report period</span>
            <select
              className="ak-select"
              value={period}
              onChange={(event) => setPeriod(event.target.value as Period)}
            >
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </label>
          <label className="ak-field">
            <span className="ak-field__label">Year</span>
            <select
              className="ak-select"
              value={year}
              onChange={(event) => setYear(Number(event.target.value))}
            >
              {Array.from(
                { length: 26 },
                (_, index) => new Date().getFullYear() - index,
              ).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          {period === 'month' && (
            <label className="ak-field">
              <span className="ak-field__label">Month</span>
              <select
                className="ak-select"
                value={month}
                onChange={(event) => setMonth(Number(event.target.value))}
              >
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index} value={index}>
                    {new Intl.DateTimeFormat(undefined, {
                      month: 'long',
                    }).format(new Date(year, index, 1))}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="ak-field">
            <span className="ak-field__label">Recorded by</span>
            <select
              className="ak-select"
              value={recorderId}
              onChange={(event) => setRecorderId(event.target.value)}
            >
              <option value="">All staff</option>
              {cashiers.data?.map((cashier) => (
                <option key={cashier.id} value={cashier.id}>
                  {cashier.fullName} · {cashier.role.toLowerCase()}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {(report.error || cashiers.error) && (
        <div className="ak-mb-4">
          <ErrorMessage
            error={report.error ?? cashiers.error}
            onRetry={() => {
              void report.refetch();
              void cashiers.refetch();
            }}
          />
        </div>
      )}
      {report.isLoading ? (
        <section className="ak-card ak-card__body">
          Loading {reportLabel} transactions…
        </section>
      ) : (
        <>
          <section className="ak-card ak-mb-6">
            <div className="ak-card__header">
              <h2 className="ak-card__title">Transactions · {reportLabel}</h2>
              <span className="ak-small ak-subtle">
                {transactions.length} records
              </span>
            </div>
            <div className="ak-table-wrap">
              <table className="ak-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Recorded at</th>
                    <th>Recorded by</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={`${transaction.kind}-${transaction.id}`}>
                      <td data-label="Type">
                        {transaction.kind === 'received'
                          ? 'Received'
                          : 'Expense'}
                      </td>
                      <td data-label="Recorded at">
                        {new Date(transaction.at).toLocaleString()}
                      </td>
                      <td data-label="Recorded by">
                        {names.get(transaction.recorderId) ??
                          'Former or unknown staff'}
                      </td>
                      <td data-label="Description">
                        {transaction.description}
                      </td>
                      <td data-label="Status">{transaction.status}</td>
                      <td className="ak-strong" data-label="Amount">
                        {transaction.kind === 'spent' ? '−' : '+'}
                        {formatMoney(transaction.amount, transaction.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactions.length === 0 && (
                <p className="ak-card__body ak-subtle">
                  No transactions found for this period and cashier.
                </p>
              )}
            </div>
          </section>

          <section aria-label="Financial summary">
            <h2 className="ak-section-title ak-mb-3">Summary</h2>
            {currencyTotals.length ? (
              <div className="ak-stat-grid">
                {currencyTotals.map((totals) => (
                  <div
                    className="ak-card ak-card__body ak-stack ak-gap-2"
                    key={totals.currency}
                  >
                    <span className="ak-small ak-subtle">
                      {totals.currency}
                    </span>
                    <strong className="ak-strong">
                      Received: {formatMoney(totals.received, totals.currency)}
                    </strong>
                    <strong className="ak-strong">
                      Spent: {formatMoney(totals.spent, totals.currency)}
                    </strong>
                    <strong className="ak-strong">
                      Current balance:{' '}
                      {formatMoney(totals.balance, totals.currency)}
                    </strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ak-stat-grid">
                <StatCard
                  label="Money received"
                  value={formatMoney(0, 'RWF')}
                  meta="Completed payments"
                />
                <StatCard
                  label="Money spent"
                  value={formatMoney(0, 'RWF')}
                  meta="Recorded expenses"
                />
                <StatCard
                  label="Current balance"
                  value={formatMoney(0, 'RWF')}
                  meta="Received minus spent"
                />
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}

export default FinanceReport;
