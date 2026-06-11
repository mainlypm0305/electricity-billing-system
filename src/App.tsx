import { useState, useCallback } from 'react';
import { Page, Consumer, Bill, Payment, Complaint } from './types';
import {
  initialConsumers, initialMeters, initialBills,
  initialPayments, initialComplaints, initialNotifications,
  defaultUser,
} from './data';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ConsumersPage from './components/ConsumersPage';
import BillingPage from './components/BillingPage';
import PaymentsPage from './components/PaymentsPage';
import ComplaintsPage from './components/ComplaintsPage';
import ReportsPage from './components/ReportsPage';
import SettingsPage from './components/SettingsPage';
import ConsumerPortal from './components/ConsumerPortal';
import ToastContainer, { ToastData } from './components/Toast';

const pageTitles: Record<Page, string> = {
  dashboard: 'Dashboard',
  consumers: 'Consumer Management',
  billing: 'Billing System',
  payments: 'Payment Processing',
  complaints: 'Complaint Management',
  reports: 'Reports & Analytics',
  settings: 'Settings',
};

type AuthState = 
  | { type: 'logged_out' }
  | { type: 'admin' }
  | { type: 'consumer'; consumer: Consumer };

export default function App() {
  const [authState, setAuthState] = useState<AuthState>({ type: 'logged_out' });
  const [isDark, setIsDark] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data state
  const [consumers, setConsumers] = useState(initialConsumers);
  const [meters, setMeters] = useState(initialMeters);
  const [bills, setBills] = useState(initialBills);
  const [payments, setPayments] = useState(initialPayments);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  let toastIdCounter = Date.now();

  const addToast = useCallback((message: string, type: ToastData['type'] = 'success') => {
    const id = toastIdCounter++;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Auth handlers
  const handleAdminLogin = (username: string, password: string) => {
    if (username === defaultUser.username && password === defaultUser.password) {
      setAuthState({ type: 'admin' });
      return true;
    }
    return false;
  };

  const handleConsumerLogin = (consumerNumber: string, mobile: string) => {
    const consumer = consumers.find(
      c => c.consumerNumber.toUpperCase() === consumerNumber.toUpperCase() && c.mobile === mobile
    );
    if (consumer) {
      setAuthState({ type: 'consumer', consumer });
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setAuthState({ type: 'logged_out' });
    setCurrentPage('dashboard');
  };

  // Consumer CRUD
  const addConsumer = (data: Omit<Consumer, 'id' | 'consumerNumber'>) => {
    const id = Math.max(0, ...consumers.map(c => c.id)) + 1;
    const consumerNumber = `EBS-2026-${String(id).padStart(3, '0')}`;
    const meterId = `MTR-${String(id).padStart(3, '0')}`;
    const newConsumer: Consumer = { id, consumerNumber, ...data, meterId, connectionDate: new Date().toISOString().split('T')[0] };
    setConsumers(prev => [...prev, newConsumer]);
    setMeters(prev => [...prev, {
      id,
      meterNumber: meterId,
      consumerId: id,
      type: data.connectionType === 'Residential' ? 'Single Phase' as const : 'Three Phase' as const,
      lastReading: 0,
      currentReading: 0,
      status: 'Active' as const,
    }]);
    addToast(`Consumer ${newConsumer.name} added successfully`);
  };

  const updateConsumer = (consumer: Consumer) => {
    setConsumers(prev => prev.map(c => c.id === consumer.id ? consumer : c));
    addToast(`Consumer ${consumer.name} updated successfully`);
  };

  const deleteConsumer = (id: number) => {
    const consumer = consumers.find(c => c.id === id);
    setConsumers(prev => prev.filter(c => c.id !== id));
    addToast(`Consumer ${consumer?.name || ''} deleted`, 'warning');
  };

  // Bill Generation
  const generateBill = (data: Omit<Bill, 'id' | 'billNumber'>) => {
    const id = Math.max(0, ...bills.map(b => b.id)) + 1;
    const billNumber = `BILL-2026-${String(id).padStart(3, '0')}`;
    setBills(prev => [...prev, { id, billNumber, ...data }]);
    setMeters(prev => prev.map(m => m.consumerId === data.consumerId ? { ...m, lastReading: m.currentReading, currentReading: data.currentReading } : m));
    addToast(`Bill ${billNumber} generated for ${data.consumerName}`);
  };

  // Payment Processing
  const processPayment = (data: Omit<Payment, 'id' | 'paymentNumber'>) => {
    const id = Math.max(0, ...payments.map(p => p.id)) + 1;
    const paymentNumber = `PAY-2026-${String(id).padStart(3, '0')}`;
    setPayments(prev => [...prev, { id, paymentNumber, ...data }]);
    setBills(prev => prev.map(b => b.id === data.billId ? { ...b, status: 'Paid' as const } : b));
    addToast(`Payment ₹${data.amount.toLocaleString('en-IN')} processed successfully`);
  };

  // Complaint Management
  const addComplaint = (data: Omit<Complaint, 'id' | 'complaintNumber'>) => {
    const id = Math.max(0, ...complaints.map(c => c.id)) + 1;
    const complaintNumber = `CMP-2026-${String(id).padStart(3, '0')}`;
    setComplaints(prev => [...prev, { id, complaintNumber, ...data }]);
    addToast(`Complaint ${complaintNumber} registered`, 'info');
  };

  const resolveComplaint = (id: number, notes: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolved' as const, resolvedDate: new Date().toISOString().split('T')[0], resolutionNotes: notes } : c));
    addToast('Complaint resolved successfully');
  };

  // Notifications
  const markNotificationRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Render based on auth state
  if (authState.type === 'logged_out') {
    return <LoginPage onAdminLogin={handleAdminLogin} onConsumerLogin={handleConsumerLogin} />;
  }

  // Consumer Portal
  if (authState.type === 'consumer') {
    return (
      <>
        <ConsumerPortal
          consumer={authState.consumer}
          bills={bills}
          payments={payments}
          complaints={complaints}
          onPayment={processPayment}
          onComplaint={addComplaint}
          onLogout={handleLogout}
          isDark={isDark}
          toggleTheme={() => setIsDark(!isDark)}
        />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  // Admin Portal
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard consumers={consumers} bills={bills} payments={payments} complaints={complaints} isDark={isDark} />;
      case 'consumers':
        return <ConsumersPage consumers={consumers} onAdd={addConsumer} onUpdate={updateConsumer} onDelete={deleteConsumer} isDark={isDark} />;
      case 'billing':
        return <BillingPage bills={bills} consumers={consumers} meters={meters} onGenerate={generateBill} isDark={isDark} />;
      case 'payments':
        return <PaymentsPage payments={payments} bills={bills} onProcess={processPayment} isDark={isDark} />;
      case 'complaints':
        return <ComplaintsPage complaints={complaints} consumers={consumers} onAdd={addComplaint} onResolve={resolveComplaint} isDark={isDark} />;
      case 'reports':
        return <ReportsPage consumers={consumers} bills={bills} payments={payments} complaints={complaints} isDark={isDark} />;
      case 'settings':
        return <SettingsPage isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />;
      default:
        return null;
    }
  };

  return (
    <div className={`${isDark ? 'dark-bg' : 'light-bg'} min-h-screen relative transition-colors duration-500`}>
      {/* Background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="particle w-64 h-64 top-20 left-20" style={{ animationDelay: '0s' }} />
        <div className="particle w-80 h-80 bottom-40 right-40" style={{ animationDelay: '4s', background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent)' }} />
        <div className="particle w-48 h-48 top-1/2 right-1/3" style={{ animationDelay: '8s' }} />
      </div>

      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        isDark={isDark}
      />

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen flex flex-col relative z-10">
        <div className="p-3 sm:p-4">
          <Navbar
            isDark={isDark}
            toggleTheme={() => setIsDark(!isDark)}
            notifications={notifications}
            onMarkRead={markNotificationRead}
            onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            pageTitle={pageTitles[currentPage]}
          />
        </div>

        <main className="flex-1 p-3 sm:p-4 pt-0 sm:pt-0">
          {renderPage()}
        </main>

        {/* Footer */}
        <footer className={`p-4 text-center text-xs ${isDark ? 'text-white/20' : 'text-[#1e1145]/20'}`}>
          <p>EBS 2026 v2.0.0 • Electricity Billing System • Built with React + TypeScript + Tailwind CSS</p>
        </footer>
      </div>

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
