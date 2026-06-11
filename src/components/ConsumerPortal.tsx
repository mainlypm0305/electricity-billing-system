import { useState } from 'react';
import { Consumer, Bill, Payment, Complaint } from '../types';
import {
  User, FileText, CreditCard, MessageSquareWarning, LogOut,
  Zap, CheckCircle, Clock, AlertTriangle, X, Plus,
  ChevronRight, Home, Receipt, History
} from 'lucide-react';

interface ConsumerPortalProps {
  consumer: Consumer;
  bills: Bill[];
  payments: Payment[];
  complaints: Complaint[];
  onPayment: (payment: Omit<Payment, 'id' | 'paymentNumber'>) => void;
  onComplaint: (complaint: Omit<Complaint, 'id' | 'complaintNumber'>) => void;
  onLogout: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

type Tab = 'home' | 'bills' | 'payments' | 'complaints' | 'profile';

export default function ConsumerPortal({
  consumer, bills, payments, complaints, onPayment, onComplaint, onLogout, isDark, toggleTheme
}: ConsumerPortalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showPayModal, setShowPayModal] = useState<Bill | null>(null);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [paymentMode, setPaymentMode] = useState<Payment['paymentMode']>('Online');
  const [complaintForm, setComplaintForm] = useState({
    category: 'Billing Issue' as Complaint['category'],
    priority: 'Medium' as Complaint['priority'],
    description: '',
  });

  const myBills = bills.filter(b => b.consumerId === consumer.id);
  const myPayments = payments.filter(p => p.consumerId === consumer.id);
  const myComplaints = complaints.filter(c => c.consumerId === consumer.id);
  
  const pendingBills = myBills.filter(b => b.status === 'Pending' || b.status === 'Overdue');
  const totalDue = pendingBills.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalPaid = myPayments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);

  const handlePayment = () => {
    if (!showPayModal) return;
    onPayment({
      billId: showPayModal.id,
      billNumber: showPayModal.billNumber,
      consumerId: consumer.id,
      consumerName: consumer.name,
      amount: showPayModal.totalAmount,
      paymentMode,
      paymentDate: new Date().toISOString().split('T')[0],
      transactionId: `TXN-${Date.now().toString().slice(-9)}`,
      status: 'Completed',
    });
    setShowPayModal(null);
  };

  const handleComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintForm.description.trim()) return;
    onComplaint({
      consumerId: consumer.id,
      consumerName: consumer.name,
      ...complaintForm,
      status: 'Open',
      createdDate: new Date().toISOString().split('T')[0],
    });
    setShowComplaintModal(false);
    setComplaintForm({ category: 'Billing Issue', priority: 'Medium', description: '' });
  };

  const inputClass = isDark ? 'glass-input' : 'glass-input-light';
  const selectClass = isDark ? 'glass-select' : 'glass-select-light';

  const tabs = [
    { id: 'home' as Tab, icon: <Home size={18} />, label: 'Home' },
    { id: 'bills' as Tab, icon: <FileText size={18} />, label: 'Bills' },
    { id: 'payments' as Tab, icon: <History size={18} />, label: 'Payments' },
    { id: 'complaints' as Tab, icon: <MessageSquareWarning size={18} />, label: 'Complaints' },
    { id: 'profile' as Tab, icon: <User size={18} />, label: 'Profile' },
  ];

  return (
    <div className={`${isDark ? 'dark-bg' : 'light-bg'} min-h-screen relative transition-colors duration-500`}>
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="particle w-64 h-64 top-20 left-20" style={{ animationDelay: '0s' }} />
        <div className="particle w-80 h-80 bottom-40 right-40" style={{ animationDelay: '4s', background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent)' }} />
      </div>

      {/* Header */}
      <header className={`${isDark ? 'glass' : 'glass-light'} m-3 sm:m-4 p-4 flex items-center justify-between relative z-10`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center shadow-lg">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">EBS Consumer Portal</h1>
            <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Welcome, {consumer.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className={`p-2 rounded-xl ${isDark ? 'text-yellow-400 hover:bg-white/10' : 'text-[#7c3aed] hover:bg-[#7c3aed]/10'}`}>
            {isDark ? '☀️' : '🌙'}
          </button>
          <button onClick={onLogout} className={`p-2 rounded-xl ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'}`}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-3 sm:p-4 pb-24 relative z-10">
        {activeTab === 'home' && (
          <div className="space-y-4 fade-in">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`${isDark ? 'glass' : 'glass-light'} p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <Receipt size={16} className="text-yellow-400" />
                  <span className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Amount Due</span>
                </div>
                <p className={`text-xl font-bold ${totalDue > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                  ₹{totalDue.toLocaleString('en-IN')}
                </p>
              </div>
              <div className={`${isDark ? 'glass' : 'glass-light'} p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-green-400" />
                  <span className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Total Paid</span>
                </div>
                <p className={`text-xl font-bold text-green-400`}>₹{totalPaid.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Pending Bills Alert */}
            {pendingBills.length > 0 && (
              <div className={`${isDark ? 'glass' : 'glass-light'} p-4 border-l-4 border-yellow-400`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>
                      You have {pendingBills.length} pending bill{pendingBills.length > 1 ? 's' : ''}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-white/50' : 'text-[#1e1145]/50'} mt-1`}>
                      Total due: ₹{totalDue.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <button onClick={() => setActiveTab('bills')} className="text-[#00d4ff] text-xs font-medium">
                    Pay Now →
                  </button>
                </div>
              </div>
            )}

            {/* Recent Bills */}
            <div className={`${isDark ? 'glass' : 'glass-light'} p-4`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Recent Bills</h3>
                <button onClick={() => setActiveTab('bills')} className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>
                  View All <ChevronRight size={12} className="inline" />
                </button>
              </div>
              <div className="space-y-2">
                {myBills.slice(-3).reverse().map(bill => (
                  <div key={bill.id} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-[#7c3aed]/5'}`}>
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white/90' : 'text-[#1e1145]/90'}`}>{bill.billingMonth}</p>
                      <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{bill.unitsConsumed} units</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>₹{bill.totalAmount.toLocaleString('en-IN')}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${bill.status === 'Paid' ? 'bg-green-500/20 text-green-400' : bill.status === 'Overdue' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {bill.status}
                      </span>
                    </div>
                  </div>
                ))}
                {myBills.length === 0 && (
                  <p className={`text-sm text-center py-4 ${isDark ? 'text-white/30' : 'text-[#1e1145]/30'}`}>No bills yet</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setActiveTab('bills')} className={`${isDark ? 'glass' : 'glass-light'} p-4 text-left hover:scale-[1.02] transition-all`}>
                <CreditCard size={24} className="text-[#00d4ff] mb-2" />
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Pay Bill</p>
                <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Quick payment</p>
              </button>
              <button onClick={() => setShowComplaintModal(true)} className={`${isDark ? 'glass' : 'glass-light'} p-4 text-left hover:scale-[1.02] transition-all`}>
                <MessageSquareWarning size={24} className="text-[#f59e0b] mb-2" />
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Report Issue</p>
                <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Submit complaint</p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'bills' && (
          <div className="space-y-3 fade-in">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>My Bills</h2>
            {myBills.length === 0 ? (
              <div className={`${isDark ? 'glass' : 'glass-light'} p-8 text-center`}>
                <FileText size={40} className={`mx-auto mb-3 ${isDark ? 'text-white/20' : 'text-[#1e1145]/20'}`} />
                <p className={`text-sm ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>No bills found</p>
              </div>
            ) : (
              myBills.slice().reverse().map(bill => (
                <div key={bill.id} className={`${isDark ? 'glass' : 'glass-light'} p-4`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{bill.billNumber}</p>
                      <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{bill.billingMonth}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${bill.status === 'Paid' ? 'bg-green-500/20 text-green-400' : bill.status === 'Overdue' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {bill.status}
                    </span>
                  </div>
                  <div className={`grid grid-cols-3 gap-2 text-xs mb-3 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-[#7c3aed]/5'}`}>
                    <div>
                      <p className={isDark ? 'text-white/40' : 'text-[#1e1145]/40'}>Units</p>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{bill.unitsConsumed}</p>
                    </div>
                    <div>
                      <p className={isDark ? 'text-white/40' : 'text-[#1e1145]/40'}>Due Date</p>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{bill.dueDate}</p>
                    </div>
                    <div>
                      <p className={isDark ? 'text-white/40' : 'text-[#1e1145]/40'}>Amount</p>
                      <p className="font-bold gradient-text">₹{bill.totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  {bill.status !== 'Paid' && (
                    <button onClick={() => setShowPayModal(bill)} className="glow-btn w-full py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2">
                      <CreditCard size={16} /> Pay Now
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-3 fade-in">
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Payment History</h2>
            {myPayments.length === 0 ? (
              <div className={`${isDark ? 'glass' : 'glass-light'} p-8 text-center`}>
                <History size={40} className={`mx-auto mb-3 ${isDark ? 'text-white/20' : 'text-[#1e1145]/20'}`} />
                <p className={`text-sm ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>No payments yet</p>
              </div>
            ) : (
              myPayments.slice().reverse().map(pay => (
                <div key={pay.id} className={`${isDark ? 'glass' : 'glass-light'} p-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{pay.paymentNumber}</p>
                      <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{pay.paymentDate} • {pay.paymentMode}</p>
                      <p className={`text-[10px] font-mono mt-1 ${isDark ? 'text-white/30' : 'text-[#1e1145]/30'}`}>{pay.transactionId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-400">₹{pay.amount.toLocaleString('en-IN')}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 inline-flex items-center gap-1">
                        <CheckCircle size={10} /> {pay.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="space-y-3 fade-in">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>My Complaints</h2>
              <button onClick={() => setShowComplaintModal(true)} className="glow-btn px-3 py-1.5 rounded-lg text-white text-xs font-medium flex items-center gap-1">
                <Plus size={14} /> New
              </button>
            </div>
            {myComplaints.length === 0 ? (
              <div className={`${isDark ? 'glass' : 'glass-light'} p-8 text-center`}>
                <MessageSquareWarning size={40} className={`mx-auto mb-3 ${isDark ? 'text-white/20' : 'text-[#1e1145]/20'}`} />
                <p className={`text-sm ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>No complaints filed</p>
              </div>
            ) : (
              myComplaints.slice().reverse().map(c => (
                <div key={c.id} className={`${isDark ? 'glass' : 'glass-light'} p-4`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className={`text-xs font-mono ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{c.complaintNumber}</p>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{c.category}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${c.status === 'Open' ? 'bg-yellow-500/20 text-yellow-400' : c.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                      {c.status === 'Open' ? <AlertTriangle size={10} /> : c.status === 'In Progress' ? <Clock size={10} /> : <CheckCircle size={10} />}
                      {c.status}
                    </span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'}`}>{c.description}</p>
                  <p className={`text-[10px] mt-2 ${isDark ? 'text-white/30' : 'text-[#1e1145]/30'}`}>Filed: {c.createdDate}</p>
                  {c.resolutionNotes && (
                    <div className="mt-2 p-2 rounded-lg bg-green-500/10 text-xs text-green-400">
                      <p className="font-medium">Resolution:</p>
                      <p>{c.resolutionNotes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4 fade-in">
            <div className={`${isDark ? 'glass' : 'glass-light'} p-5`}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {consumer.name.charAt(0)}
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{consumer.name}</h3>
                  <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{consumer.consumerNumber}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full mt-1 inline-block ${consumer.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {consumer.status}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  ['Email', consumer.email],
                  ['Mobile', consumer.mobile],
                  ['Address', `${consumer.address}, ${consumer.city}`],
                  ['State', `${consumer.state} - ${consumer.pincode}`],
                  ['Connection Type', consumer.connectionType],
                  ['Meter ID', consumer.meterId],
                  ['Connection Date', consumer.connectionDate],
                ].map(([label, value]) => (
                  <div key={label} className={`flex justify-between py-2 border-b ${isDark ? 'border-white/5' : 'border-[#7c3aed]/5'}`}>
                    <span className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{label}</span>
                    <span className={`text-sm ${isDark ? 'text-white/80' : 'text-[#1e1145]/80'}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 ${isDark ? 'glass-strong' : 'glass-strong-light'} border-t ${isDark ? 'border-white/10' : 'border-[#7c3aed]/10'} px-2 py-2 z-50`} style={{ borderRadius: '20px 20px 0 0' }}>
        <div className="flex justify-around">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'text-[#00d4ff]'
                  : isDark ? 'text-white/40' : 'text-[#1e1145]/40'
              }`}
            >
              {tab.icon}
              <span className="text-[10px] font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="w-1 h-1 rounded-full bg-[#00d4ff] shadow-lg shadow-[#00d4ff]/50" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowPayModal(null)}>
          <div className={`${isDark ? 'glass-strong' : 'glass-strong-light'} w-full max-w-sm p-5 fade-in`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Pay Bill</h3>
              <button onClick={() => setShowPayModal(null)} className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-[#7c3aed]/10 text-[#1e1145]/50'}`}><X size={20} /></button>
            </div>
            <div className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-white/5' : 'bg-[#7c3aed]/5'}`}>
              <div className="text-center">
                <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{showPayModal.billNumber}</p>
                <p className="text-3xl font-bold gradient-text mt-1">₹{showPayModal.totalAmount.toLocaleString('en-IN')}</p>
                <p className={`text-xs mt-2 ${isDark ? 'text-white/50' : 'text-[#1e1145]/50'}`}>{showPayModal.unitsConsumed} units • {showPayModal.billingMonth}</p>
              </div>
            </div>
            <div className="mb-4">
              <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-2 block`}>Payment Method</label>
              <select value={paymentMode} onChange={e => setPaymentMode(e.target.value as Payment['paymentMode'])} className={`${selectClass} w-full px-4 py-2.5 text-sm`}>
                <option value="Online">Online Banking</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <button onClick={handlePayment} className="glow-btn w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2">
              <CreditCard size={18} /> Pay ₹{showPayModal.totalAmount.toLocaleString('en-IN')}
            </button>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowComplaintModal(false)}>
          <div className={`${isDark ? 'glass-strong' : 'glass-strong-light'} w-full max-w-sm p-5 fade-in`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Report Issue</h3>
              <button onClick={() => setShowComplaintModal(false)} className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-[#7c3aed]/10 text-[#1e1145]/50'}`}><X size={20} /></button>
            </div>
            <form onSubmit={handleComplaint} className="space-y-4">
              <div>
                <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Category</label>
                <select value={complaintForm.category} onChange={e => setComplaintForm({ ...complaintForm, category: e.target.value as Complaint['category'] })} className={`${selectClass} w-full px-4 py-2.5 text-sm`}>
                  <option value="Power Failure">Power Failure</option>
                  <option value="Meter Issue">Meter Issue</option>
                  <option value="Billing Issue">Billing Issue</option>
                  <option value="Connection Issue">Connection Issue</option>
                </select>
              </div>
              <div>
                <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Priority</label>
                <select value={complaintForm.priority} onChange={e => setComplaintForm({ ...complaintForm, priority: e.target.value as Complaint['priority'] })} className={`${selectClass} w-full px-4 py-2.5 text-sm`}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div>
                <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Description</label>
                <textarea value={complaintForm.description} onChange={e => setComplaintForm({ ...complaintForm, description: e.target.value })} rows={3} className={`${inputClass} w-full px-4 py-2.5 text-sm resize-none`} placeholder="Describe your issue..." required />
              </div>
              <button type="submit" className="glow-btn w-full py-3 rounded-xl text-white font-semibold">Submit Complaint</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
