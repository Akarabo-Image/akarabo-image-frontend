import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { jsPDF } from 'jspdf';
import type { PhotographerTask } from '../types/photographerTask';

interface DailyPhotographerReport {
  photographerName: string;
  workDate: string;
  tasks: PhotographerTask[];
}

function addTask(doc: jsPDF, task: PhotographerTask, startY: number): number {
  const lines = [
    `${task.customerName} | ${task.status.replace('_', ' ')}`,
    `Assigned: ${task.photosToEdit} | Edited: ${task.editedPhotos ?? 0}`,
    ...(task.notes ? doc.splitTextToSize(`Notes: ${task.notes}`, 175) : []),
  ];
  const height = lines.length * 6 + 5;
  if (startY + height > 280) doc.addPage();
  const y = startY + height > 280 ? 20 : startY;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(lines, 15, y);
  doc.setDrawColor(220);
  doc.line(15, y + height - 3, 195, y + height - 3);
  return y + height;
}

export async function generatePhotographerDailyPdf(report: DailyPhotographerReport): Promise<void> {
  const doc = new jsPDF();
  const assigned = report.tasks.reduce((sum, task) => sum + task.photosToEdit, 0);
  const edited = report.tasks.reduce((sum, task) => sum + (task.editedPhotos ?? 0), 0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Akarabo Studio - Daily Work Report', 15, 20);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Photographer: ${report.photographerName}`, 15, 31);
  doc.text(`Work date: ${report.workDate}`, 15, 38);
  doc.text(`Tasks: ${report.tasks.length} | Photos assigned: ${assigned} | Photos edited: ${edited}`, 15, 45);

  let y = 58;
  for (const task of report.tasks) y = addTask(doc, task, y);
  if (report.tasks.length === 0) doc.text('No tasks assigned for this date.', 15, y);

  const filename = `photographer-work-${report.workDate}.pdf`;
  if (!Capacitor.isNativePlatform()) {
    doc.save(filename);
    return;
  }

  const base64 = doc.output('datauristring').split(',')[1];
  if (!base64) throw new Error('Could not create the PDF file.');
  const savedFile = await Filesystem.writeFile({ path: filename, data: base64, directory: Directory.Cache });
  await Share.share({ title: 'Daily work report', text: `${report.photographerName} - ${report.workDate}`, url: savedFile.uri, dialogTitle: 'Share daily work report' });
}
