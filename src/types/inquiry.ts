export interface ClientInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  service: string;
  preferredDate?: string | null;
  message?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface CreateInquiryPayload {
  name: string;
  email: string;
  phone: string;
  service: string;
  preferredDate?: string;
  message?: string;
}
