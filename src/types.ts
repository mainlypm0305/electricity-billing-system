export interface User {
  id: number;
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: 'admin' | 'staff';
  isActive: boolean;
  lastLogin: string;
}

export interface Consumer {
  id: number;
  consumerNumber: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  connectionType: 'Residential' | 'Commercial' | 'Industrial';
  connectionDate: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  meterId: string;
}

export interface Meter {
  id: number;
  meterNumber: string;
  consumerId: number;
  type: 'Single Phase' | 'Three Phase';
  lastReading: number;
  currentReading: number;
  status: 'Active' | 'Faulty' | 'Replaced';
}

export interface Bill {
  id: number;
  billNumber: string;
  consumerId: number;
  consumerName: string;
  consumerNumber: string;
  meterId: string;
  billingMonth: string;
  previousReading: number;
  currentReading: number;
  unitsConsumed: number;
  energyCharge: number;
  electricityDuty: number;
  fixedCharge: number;
  subtotal: number;
  gst: number;
  totalAmount: number;
  dueDate: string;
  status: 'Pending' | 'Paid' | 'Overdue';
  generatedDate: string;
}

export interface Payment {
  id: number;
  paymentNumber: string;
  billId: number;
  billNumber: string;
  consumerId: number;
  consumerName: string;
  amount: number;
  paymentMode: 'Cash' | 'Cheque' | 'Online' | 'Card' | 'Bank Transfer';
  paymentDate: string;
  transactionId: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface Complaint {
  id: number;
  complaintNumber: string;
  consumerId: number;
  consumerName: string;
  category: 'Power Failure' | 'Meter Issue' | 'Billing Issue' | 'Connection Issue';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  createdDate: string;
  resolvedDate?: string;
  resolutionNotes?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdDate: string;
}

export type Page = 'dashboard' | 'consumers' | 'billing' | 'payments' | 'complaints' | 'reports' | 'settings';
