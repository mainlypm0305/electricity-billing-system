import { User, Consumer, Meter, Bill, Payment, Complaint, Notification } from './types';

export const defaultUser: User = {
  id: 1,
  username: 'admin',
  password: 'admin@123',
  fullName: 'System Administrator',
  email: 'admin@ebs2026.com',
  role: 'admin',
  isActive: true,
  lastLogin: '2026-06-15T10:30:00',
};

export const initialConsumers: Consumer[] = [
  { id: 1, consumerNumber: 'EBS-2026-001', name: 'Rajesh Kumar', email: 'rajesh@email.com', mobile: '9876543210', address: '12 MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', connectionType: 'Residential', connectionDate: '2024-01-15', status: 'Active', meterId: 'MTR-001' },
  { id: 2, consumerNumber: 'EBS-2026-002', name: 'Priya Sharma', email: 'priya@email.com', mobile: '9876543211', address: '45 Park Street', city: 'Delhi', state: 'Delhi', pincode: '110001', connectionType: 'Residential', connectionDate: '2024-03-20', status: 'Active', meterId: 'MTR-002' },
  { id: 3, consumerNumber: 'EBS-2026-003', name: 'TechCorp Solutions', email: 'info@techcorp.com', mobile: '9876543212', address: '78 IT Park', city: 'Bangalore', state: 'Karnataka', pincode: '560001', connectionType: 'Commercial', connectionDate: '2023-06-10', status: 'Active', meterId: 'MTR-003' },
  { id: 4, consumerNumber: 'EBS-2026-004', name: 'Amit Patel', email: 'amit@email.com', mobile: '9876543213', address: '23 Lake View', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001', connectionType: 'Residential', connectionDate: '2024-07-01', status: 'Active', meterId: 'MTR-004' },
  { id: 5, consumerNumber: 'EBS-2026-005', name: 'Steel Industries Ltd', email: 'steel@industries.com', mobile: '9876543214', address: '90 Industrial Area', city: 'Jamshedpur', state: 'Jharkhand', pincode: '831001', connectionType: 'Industrial', connectionDate: '2023-01-05', status: 'Active', meterId: 'MTR-005' },
  { id: 6, consumerNumber: 'EBS-2026-006', name: 'Sunita Devi', email: 'sunita@email.com', mobile: '9876543215', address: '56 Green Colony', city: 'Pune', state: 'Maharashtra', pincode: '411001', connectionType: 'Residential', connectionDate: '2025-02-14', status: 'Active', meterId: 'MTR-006' },
  { id: 7, consumerNumber: 'EBS-2026-007', name: 'Metro Mall', email: 'metro@mall.com', mobile: '9876543216', address: '101 Ring Road', city: 'Hyderabad', state: 'Telangana', pincode: '500001', connectionType: 'Commercial', connectionDate: '2024-09-22', status: 'Active', meterId: 'MTR-007' },
  { id: 8, consumerNumber: 'EBS-2026-008', name: 'Vikram Singh', email: 'vikram@email.com', mobile: '9876543217', address: '34 Civil Lines', city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001', connectionType: 'Residential', connectionDate: '2025-05-10', status: 'Inactive', meterId: 'MTR-008' },
];

export const initialMeters: Meter[] = [
  { id: 1, meterNumber: 'MTR-001', consumerId: 1, type: 'Single Phase', lastReading: 1200, currentReading: 1450, status: 'Active' },
  { id: 2, meterNumber: 'MTR-002', consumerId: 2, type: 'Single Phase', lastReading: 890, currentReading: 1020, status: 'Active' },
  { id: 3, meterNumber: 'MTR-003', consumerId: 3, type: 'Three Phase', lastReading: 5400, currentReading: 6200, status: 'Active' },
  { id: 4, meterNumber: 'MTR-004', consumerId: 4, type: 'Single Phase', lastReading: 340, currentReading: 490, status: 'Active' },
  { id: 5, meterNumber: 'MTR-005', consumerId: 5, type: 'Three Phase', lastReading: 12000, currentReading: 14500, status: 'Active' },
  { id: 6, meterNumber: 'MTR-006', consumerId: 6, type: 'Single Phase', lastReading: 200, currentReading: 380, status: 'Active' },
  { id: 7, meterNumber: 'MTR-007', consumerId: 7, type: 'Three Phase', lastReading: 3800, currentReading: 4500, status: 'Active' },
  { id: 8, meterNumber: 'MTR-008', consumerId: 8, type: 'Single Phase', lastReading: 670, currentReading: 670, status: 'Faulty' },
];

export function calculateBill(units: number) {
  let energyCharge = 0;
  if (units <= 100) {
    energyCharge = units * 5;
  } else if (units <= 300) {
    energyCharge = 100 * 5 + (units - 100) * 7;
  } else if (units <= 500) {
    energyCharge = 100 * 5 + 200 * 7 + (units - 300) * 9;
  } else {
    energyCharge = 100 * 5 + 200 * 7 + 200 * 9 + (units - 500) * 12;
  }
  const electricityDuty = energyCharge * 0.05;
  const fixedCharge = 50;
  const subtotal = energyCharge + electricityDuty + fixedCharge;
  const gst = subtotal * 0.18;
  const totalAmount = subtotal + gst;
  return { energyCharge: Math.round(energyCharge * 100) / 100, electricityDuty: Math.round(electricityDuty * 100) / 100, fixedCharge, subtotal: Math.round(subtotal * 100) / 100, gst: Math.round(gst * 100) / 100, totalAmount: Math.round(totalAmount * 100) / 100 };
}

export const initialBills: Bill[] = [
  (() => {
    const units = 250;
    const calc = calculateBill(units);
    return { id: 1, billNumber: 'BILL-2026-001', consumerId: 1, consumerName: 'Rajesh Kumar', consumerNumber: 'EBS-2026-001', meterId: 'MTR-001', billingMonth: '2026-05', previousReading: 1200, currentReading: 1450, unitsConsumed: units, ...calc, dueDate: '2026-06-15', status: 'Paid' as const, generatedDate: '2026-06-01' };
  })(),
  (() => {
    const units = 130;
    const calc = calculateBill(units);
    return { id: 2, billNumber: 'BILL-2026-002', consumerId: 2, consumerName: 'Priya Sharma', consumerNumber: 'EBS-2026-002', meterId: 'MTR-002', billingMonth: '2026-05', previousReading: 890, currentReading: 1020, unitsConsumed: units, ...calc, dueDate: '2026-06-15', status: 'Pending' as const, generatedDate: '2026-06-01' };
  })(),
  (() => {
    const units = 800;
    const calc = calculateBill(units);
    return { id: 3, billNumber: 'BILL-2026-003', consumerId: 3, consumerName: 'TechCorp Solutions', consumerNumber: 'EBS-2026-003', meterId: 'MTR-003', billingMonth: '2026-05', previousReading: 5400, currentReading: 6200, unitsConsumed: units, ...calc, dueDate: '2026-06-15', status: 'Overdue' as const, generatedDate: '2026-06-01' };
  })(),
  (() => {
    const units = 150;
    const calc = calculateBill(units);
    return { id: 4, billNumber: 'BILL-2026-004', consumerId: 4, consumerName: 'Amit Patel', consumerNumber: 'EBS-2026-004', meterId: 'MTR-004', billingMonth: '2026-05', previousReading: 340, currentReading: 490, unitsConsumed: units, ...calc, dueDate: '2026-06-15', status: 'Paid' as const, generatedDate: '2026-06-01' };
  })(),
  (() => {
    const units = 2500;
    const calc = calculateBill(units);
    return { id: 5, billNumber: 'BILL-2026-005', consumerId: 5, consumerName: 'Steel Industries Ltd', consumerNumber: 'EBS-2026-005', meterId: 'MTR-005', billingMonth: '2026-05', previousReading: 12000, currentReading: 14500, unitsConsumed: units, ...calc, dueDate: '2026-06-15', status: 'Pending' as const, generatedDate: '2026-06-01' };
  })(),
  (() => {
    const units = 180;
    const calc = calculateBill(units);
    return { id: 6, billNumber: 'BILL-2026-006', consumerId: 6, consumerName: 'Sunita Devi', consumerNumber: 'EBS-2026-006', meterId: 'MTR-006', billingMonth: '2026-05', previousReading: 200, currentReading: 380, unitsConsumed: units, ...calc, dueDate: '2026-06-15', status: 'Paid' as const, generatedDate: '2026-06-01' };
  })(),
];

export const initialPayments: Payment[] = [
  { id: 1, paymentNumber: 'PAY-2026-001', billId: 1, billNumber: 'BILL-2026-001', consumerId: 1, consumerName: 'Rajesh Kumar', amount: 1979.45, paymentMode: 'Online', paymentDate: '2026-06-10', transactionId: 'TXN-789456123', status: 'Completed' },
  { id: 2, paymentNumber: 'PAY-2026-002', billId: 4, billNumber: 'BILL-2026-004', consumerId: 4, consumerName: 'Amit Patel', amount: 1177.0, paymentMode: 'Card', paymentDate: '2026-06-12', transactionId: 'TXN-456123789', status: 'Completed' },
  { id: 3, paymentNumber: 'PAY-2026-003', billId: 6, billNumber: 'BILL-2026-006', consumerId: 6, consumerName: 'Sunita Devi', amount: 1418.54, paymentMode: 'Cash', paymentDate: '2026-06-13', transactionId: 'TXN-321654987', status: 'Completed' },
];

export const initialComplaints: Complaint[] = [
  { id: 1, complaintNumber: 'CMP-2026-001', consumerId: 2, consumerName: 'Priya Sharma', category: 'Billing Issue', priority: 'Medium', description: 'Incorrect meter reading on last bill. Actual consumption is much lower.', status: 'Open', createdDate: '2026-06-08' },
  { id: 2, complaintNumber: 'CMP-2026-002', consumerId: 3, consumerName: 'TechCorp Solutions', category: 'Power Failure', priority: 'High', description: 'Frequent power outages during business hours affecting operations.', status: 'In Progress', createdDate: '2026-06-05' },
  { id: 3, complaintNumber: 'CMP-2026-003', consumerId: 8, consumerName: 'Vikram Singh', category: 'Meter Issue', priority: 'Critical', description: 'Meter is not recording readings. Display shows error code E-04.', status: 'Open', createdDate: '2026-06-10' },
  { id: 4, complaintNumber: 'CMP-2026-004', consumerId: 1, consumerName: 'Rajesh Kumar', category: 'Connection Issue', priority: 'Low', description: 'Request for connection upgrade from single phase to three phase.', status: 'Resolved', createdDate: '2026-05-20', resolvedDate: '2026-06-01', resolutionNotes: 'Connection upgrade completed. New three phase meter installed.' },
];

export const initialNotifications: Notification[] = [
  { id: 1, title: 'New Complaint Filed', message: 'Priya Sharma filed a billing issue complaint.', type: 'warning', isRead: false, createdDate: '2026-06-08' },
  { id: 2, title: 'Payment Received', message: 'Payment of ₹1,979.45 received from Rajesh Kumar.', type: 'success', isRead: false, createdDate: '2026-06-10' },
  { id: 3, title: 'Overdue Bill Alert', message: 'Bill BILL-2026-003 for TechCorp Solutions is overdue.', type: 'error', isRead: false, createdDate: '2026-06-16' },
  { id: 4, title: 'System Update', message: 'EBS 2026 v2.0 successfully deployed.', type: 'info', isRead: true, createdDate: '2026-06-01' },
];

export const monthlyRevenueData = [
  { month: 'Jan', revenue: 125000, consumers: 180, units: 45000 },
  { month: 'Feb', revenue: 138000, consumers: 185, units: 48000 },
  { month: 'Mar', revenue: 142000, consumers: 192, units: 50000 },
  { month: 'Apr', revenue: 156000, consumers: 198, units: 55000 },
  { month: 'May', revenue: 168000, consumers: 205, units: 58000 },
  { month: 'Jun', revenue: 175000, consumers: 210, units: 62000 },
];

export const categoryDistribution = [
  { name: 'Residential', value: 65, color: '#00d4ff' },
  { name: 'Commercial', value: 25, color: '#7c3aed' },
  { name: 'Industrial', value: 10, color: '#f59e0b' },
];

export const complaintStats = [
  { category: 'Power Failure', count: 12 },
  { category: 'Meter Issue', count: 8 },
  { category: 'Billing Issue', count: 15 },
  { category: 'Connection Issue', count: 5 },
];
