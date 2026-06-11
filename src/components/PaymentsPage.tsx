import { useState } from 'react';
import { Payment, Bill } from '../types';
import { Search, CreditCard, X, Plus, CheckCircle, Clock, XCircle } from 'lucide-react';

interface PaymentsPageProps {
  payments: Payment[];
  bills: Bill[];
  onProcess: (payment: Omit<Payment, 'id' | 'paymentNumber'>) => void;
  isDark: boolean;
}

export default function PaymentsPage({ payments, bills, onProcess, isDark }: PaymentsPageProps) {
  const [search, setSearch] = useState('');
  const [showProcess, setShowProcess] = useState(false);
  const [selectedBill, setSelectedBill] = useState('');
  const [paymentMode, setPaymentMode] = useState<Payment['paymentMode']>('Online');

  const pendingBills = bills.filter(b => b.status === 'Pending' || b.status === 'Overdue');

  const filtered = payments.filter(p =>
    p.consumerName.toLowerCase().includes(search.toLowerCase()) ||
    p.paymentNumber.toLowerCase().includes(search.toLowerCase()) ||
    p.transactionId.toLowerCase().includes(search.toLowerCase())
  );

  const handleProcess = () => {
    const billId = parseInt(selectedBill);
    const bill = bills.find(b => b.id === billId);
    if (!bill) return;

    const now = new Date();
    const payment: Omit<Payment, 'id' | 'paymentNumber'> = {
      billId: bill.id,
      billNumber: bill.billNumber,
      consumerId: bill.consumerId,
      consumerName: bill.consumerName,
      amount: bill.totalAmount,
      paymentMode,
      paymentDate: now.toISOString().split('T')[0],
      transactionId: `TXN-${Date.now().toString().slice(-9)}`,
      status: 'Completed',
    };

    onProcess(payment);
    setShowProcess(false);
    setSelectedBill('');
  };

  const inputClass = isDark ? 'glass-input' : 'glass-input-light';
  const selectClass = isDark ? 'glass-select' : 'glass-select-light';

  const statusIcon = (status: string) => {
    if (status === 'Completed') return <CheckCircle size={14} className="text-green-400" />;
    if (status === 'Pending') return <Clock size={14} className="text-yellow-400" />;
    return <XCircle size={14} className="text-red-400" />;
  };

  return (
    <div className="space-y-4 fade-in">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`${isDark ? 'glass' : 'glass-light'} p-4`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center"><CreditCard size={18} className="text-green-400" /></div>
            <div>
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Total Collected</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>₹{payments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
        <div className={`${isDark ? 'glass' : 'glass-light'} p-4`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center"><Clock size={18} className="text-yellow-400" /></div>
            <div>
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Pending Bills</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{pendingBills.length}</p>
            </div>
          </div>
        </div>
        <div className={`${isDark ? 'glass' : 'glass-light'} p-4`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00d4ff]/20 flex items-center justify-center"><CheckCircle size={18} className="text-[#00d4ff]" /></div>
            <div>
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Transactions</p>
              <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{payments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-xs w-full">
          <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-[#1e1145]/30'}`} />
          <input type="text" placeholder="Search payments..." value={search} onChange={e => setSearch(e.target.value)} className={`${inputClass} w-full pl-9 pr-4 py-2.5 text-sm`} />
        </div>
        <button onClick={() => setShowProcess(true)} disabled={pendingBills.length === 0} className="glow-btn px-4 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
          <Plus size={16} /> Process Payment
        </button>
      </div>

      {/* Payments Table */}
      <div className={`${isDark ? 'glass' : 'glass-light'} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className={`w-full ${isDark ? 'glass-table' : 'glass-table-light'}`}>
            <thead>
              <tr>
                <th className="text-left">Payment</th>
                <th className="text-left">Consumer</th>
                <th className="text-left hidden md:table-cell">Mode</th>
                <th className="text-left hidden lg:table-cell">Transaction ID</th>
                <th className="text-right">Amount</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(pay => (
                <tr key={pay.id} className="transition-colors">
                  <td>
                    <p className="font-semibold text-sm">{pay.paymentNumber}</p>
                    <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{pay.paymentDate}</p>
                  </td>
                  <td>
                    <p className="text-sm">{pay.consumerName}</p>
                    <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{pay.billNumber}</p>
                  </td>
                  <td className="hidden md:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${isDark ? 'bg-white/5 text-white/70' : 'bg-[#7c3aed]/5 text-[#7c3aed]'}`}>{pay.paymentMode}</span>
                  </td>
                  <td className={`hidden lg:table-cell text-xs font-mono ${isDark ? 'text-white/50' : 'text-[#1e1145]/50'}`}>{pay.transactionId}</td>
                  <td className="text-right text-sm font-bold text-green-400">₹{pay.amount.toLocaleString('en-IN')}</td>
                  <td className="text-center">
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium ${pay.status === 'Completed' ? 'bg-green-500/15 text-green-400' : pay.status === 'Pending' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-red-500/15 text-red-400'}`}>
                      {statusIcon(pay.status)}
                      {pay.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-sm opacity-40">No payments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Payment Modal */}
      {showProcess && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowProcess(false)}>
          <div className={`${isDark ? 'glass-strong' : 'glass-strong-light'} w-full max-w-md p-6 fade-in`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Process Payment</h3>
              <button onClick={() => setShowProcess(false)} className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-[#7c3aed]/10 text-[#1e1145]/50'}`}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Select Bill</label>
                <select value={selectedBill} onChange={e => setSelectedBill(e.target.value)} className={`${selectClass} w-full px-4 py-2.5 text-sm`}>
                  <option value="">Choose a pending bill...</option>
                  {pendingBills.map(b => (
                    <option key={b.id} value={b.id}>{b.billNumber} - {b.consumerName} (₹{b.totalAmount.toLocaleString('en-IN')})</option>
                  ))}
                </select>
              </div>

              {selectedBill && (() => {
                const bill = bills.find(b => b.id === parseInt(selectedBill));
                if (!bill) return null;
                return (
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-[#7c3aed]/5'}`}>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between"><span className={isDark ? 'text-white/50' : 'text-[#1e1145]/50'}>Consumer</span><span className={isDark ? 'text-white/80' : 'text-[#1e1145]/80'}>{bill.consumerName}</span></div>
                      <div className="flex justify-between"><span className={isDark ? 'text-white/50' : 'text-[#1e1145]/50'}>Bill Number</span><span className={isDark ? 'text-white/80' : 'text-[#1e1145]/80'}>{bill.billNumber}</span></div>
                      <div className="flex justify-between"><span className={isDark ? 'text-white/50' : 'text-[#1e1145]/50'}>Units</span><span className={isDark ? 'text-white/80' : 'text-[#1e1145]/80'}>{bill.unitsConsumed}</span></div>
                      <div className={`flex justify-between pt-2 border-t ${isDark ? 'border-white/10' : 'border-[#7c3aed]/10'} font-bold`}>
                        <span className="gradient-text">Amount Due</span>
                        <span className="gradient-text">₹{bill.totalAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div>
                <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Payment Mode</label>
                <select value={paymentMode} onChange={e => setPaymentMode(e.target.value as Payment['paymentMode'])} className={`${selectClass} w-full px-4 py-2.5 text-sm`}>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Online">Online</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowProcess(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border ${isDark ? 'border-white/10 text-white/60 hover:bg-white/5' : 'border-[#7c3aed]/10 text-[#1e1145]/60 hover:bg-[#7c3aed]/5'} transition-all`}>Cancel</button>
                <button onClick={handleProcess} disabled={!selectedBill} className="flex-1 glow-btn py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <CreditCard size={16} /> Process
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
