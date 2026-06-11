import { useState } from 'react';
import { Bill, Consumer, Meter } from '../types';
import { calculateBill } from '../data';
import { Search, Eye, X, Zap, FileText, Plus } from 'lucide-react';

interface BillingPageProps {
  bills: Bill[];
  consumers: Consumer[];
  meters: Meter[];
  onGenerate: (bill: Omit<Bill, 'id' | 'billNumber'>) => void;
  isDark: boolean;
}

export default function BillingPage({ bills, consumers, meters, onGenerate, isDark }: BillingPageProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewBill, setViewBill] = useState<Bill | null>(null);
  const [showGenerate, setShowGenerate] = useState(false);
  const [selectedConsumer, setSelectedConsumer] = useState('');
  const [currentReading, setCurrentReading] = useState('');

  const filtered = bills.filter(b => {
    const matchSearch = b.consumerName.toLowerCase().includes(search.toLowerCase()) || b.billNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleGenerate = () => {
    const consumerId = parseInt(selectedConsumer);
    const consumer = consumers.find(c => c.id === consumerId);
    const meter = meters.find(m => m.consumerId === consumerId);
    if (!consumer || !meter) return;

    const reading = parseInt(currentReading);
    if (isNaN(reading) || reading <= meter.currentReading) return;

    const units = reading - meter.currentReading;
    const calc = calculateBill(units);
    const now = new Date();
    const due = new Date(now);
    due.setDate(due.getDate() + 15);

    const newBill: Omit<Bill, 'id' | 'billNumber'> = {
      consumerId: consumer.id,
      consumerName: consumer.name,
      consumerNumber: consumer.consumerNumber,
      meterId: consumer.meterId,
      billingMonth: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
      previousReading: meter.currentReading,
      currentReading: reading,
      unitsConsumed: units,
      ...calc,
      dueDate: due.toISOString().split('T')[0],
      status: 'Pending',
      generatedDate: now.toISOString().split('T')[0],
    };

    onGenerate(newBill);
    setShowGenerate(false);
    setSelectedConsumer('');
    setCurrentReading('');
  };

  const inputClass = isDark ? 'glass-input' : 'glass-input-light';
  const selectClass = isDark ? 'glass-select' : 'glass-select-light';
  const selectedConsumerMeter = meters.find(m => m.consumerId === parseInt(selectedConsumer));
  const previewUnits = selectedConsumerMeter && currentReading ? parseInt(currentReading) - selectedConsumerMeter.currentReading : 0;
  const preview = previewUnits > 0 ? calculateBill(previewUnits) : null;

  return (
    <div className="space-y-4 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-[#1e1145]/30'}`} />
            <input type="text" placeholder="Search bills..." value={search} onChange={e => setSearch(e.target.value)} className={`${inputClass} w-full pl-9 pr-4 py-2.5 text-sm`} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={`${selectClass} px-3 py-2.5 text-sm pr-8`}>
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
        <button onClick={() => setShowGenerate(true)} className="glow-btn px-4 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Generate Bill
        </button>
      </div>

      {/* Bills Table */}
      <div className={`${isDark ? 'glass' : 'glass-light'} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className={`w-full ${isDark ? 'glass-table' : 'glass-table-light'}`}>
            <thead>
              <tr>
                <th className="text-left">Bill</th>
                <th className="text-left">Consumer</th>
                <th className="text-left hidden md:table-cell">Month</th>
                <th className="text-right hidden sm:table-cell">Units</th>
                <th className="text-right">Amount</th>
                <th className="text-center">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(bill => (
                <tr key={bill.id} className="transition-colors">
                  <td>
                    <p className="font-semibold text-sm">{bill.billNumber}</p>
                    <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{bill.generatedDate}</p>
                  </td>
                  <td>
                    <p className="text-sm">{bill.consumerName}</p>
                    <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{bill.consumerNumber}</p>
                  </td>
                  <td className="hidden md:table-cell text-sm">{bill.billingMonth}</td>
                  <td className="text-right hidden sm:table-cell">
                    <div className="flex items-center justify-end gap-1">
                      <Zap size={12} className="text-[#00d4ff]" />
                      <span className="text-sm font-medium">{bill.unitsConsumed}</span>
                    </div>
                  </td>
                  <td className="text-right text-sm font-bold">₹{bill.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="text-center">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${bill.status === 'Paid' ? 'bg-green-500/15 text-green-400' : bill.status === 'Overdue' ? 'bg-red-500/15 text-red-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-end">
                      <button onClick={() => setViewBill(bill)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10 text-white/50 hover:text-[#00d4ff]' : 'hover:bg-[#7c3aed]/10 text-[#1e1145]/50 hover:text-[#7c3aed]'} transition-all`}>
                        <Eye size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-sm opacity-40">No bills found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Bill Modal */}
      {showGenerate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowGenerate(false)}>
          <div className={`${isDark ? 'glass-strong' : 'glass-strong-light'} w-full max-w-lg p-6 fade-in`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Generate New Bill</h3>
              <button onClick={() => setShowGenerate(false)} className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-[#7c3aed]/10 text-[#1e1145]/50'}`}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Select Consumer</label>
                <select value={selectedConsumer} onChange={e => { setSelectedConsumer(e.target.value); setCurrentReading(''); }} className={`${selectClass} w-full px-4 py-2.5 text-sm`}>
                  <option value="">Choose consumer...</option>
                  {consumers.filter(c => c.status === 'Active').map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.consumerNumber})</option>
                  ))}
                </select>
              </div>

              {selectedConsumerMeter && (
                <>
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-[#7c3aed]/5'}`}>
                    <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'} mb-1`}>Meter: {selectedConsumerMeter.meterNumber} ({selectedConsumerMeter.type})</p>
                    <p className={`text-sm ${isDark ? 'text-white/80' : 'text-[#1e1145]/80'}`}>Previous Reading: <span className="font-bold">{selectedConsumerMeter.currentReading}</span></p>
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Current Meter Reading</label>
                    <input type="number" value={currentReading} onChange={e => setCurrentReading(e.target.value)} min={selectedConsumerMeter.currentReading + 1} className={`${inputClass} w-full px-4 py-2.5 text-sm`} placeholder={`Must be > ${selectedConsumerMeter.currentReading}`} />
                  </div>
                </>
              )}

              {preview && previewUnits > 0 && (
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gradient-to-br from-[#00d4ff]/10 to-[#7c3aed]/10 border border-white/10' : 'bg-gradient-to-br from-[#00d4ff]/5 to-[#7c3aed]/5 border border-[#7c3aed]/10'}`}>
                  <h4 className={`text-xs font-bold mb-3 ${isDark ? 'text-white/70' : 'text-[#1e1145]/70'} uppercase tracking-wider`}>Bill Preview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className={isDark ? 'text-white/50' : 'text-[#1e1145]/50'}>Units Consumed</span><span className={`font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{previewUnits}</span></div>
                    <div className="flex justify-between"><span className={isDark ? 'text-white/50' : 'text-[#1e1145]/50'}>Energy Charge</span><span className={isDark ? 'text-white/80' : 'text-[#1e1145]/80'}>₹{preview.energyCharge.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span className={isDark ? 'text-white/50' : 'text-[#1e1145]/50'}>Electricity Duty (5%)</span><span className={isDark ? 'text-white/80' : 'text-[#1e1145]/80'}>₹{preview.electricityDuty.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span className={isDark ? 'text-white/50' : 'text-[#1e1145]/50'}>Fixed Charge</span><span className={isDark ? 'text-white/80' : 'text-[#1e1145]/80'}>₹{preview.fixedCharge}</span></div>
                    <div className={`flex justify-between pt-2 border-t ${isDark ? 'border-white/10' : 'border-[#7c3aed]/10'}`}><span className={isDark ? 'text-white/50' : 'text-[#1e1145]/50'}>Subtotal</span><span className={isDark ? 'text-white/80' : 'text-[#1e1145]/80'}>₹{preview.subtotal.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span className={isDark ? 'text-white/50' : 'text-[#1e1145]/50'}>GST (18%)</span><span className={isDark ? 'text-white/80' : 'text-[#1e1145]/80'}>₹{preview.gst.toLocaleString('en-IN')}</span></div>
                    <div className={`flex justify-between pt-2 border-t ${isDark ? 'border-white/10' : 'border-[#7c3aed]/10'} font-bold`}>
                      <span className="gradient-text">Total Amount</span>
                      <span className="gradient-text text-lg">₹{preview.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowGenerate(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border ${isDark ? 'border-white/10 text-white/60 hover:bg-white/5' : 'border-[#7c3aed]/10 text-[#1e1145]/60 hover:bg-[#7c3aed]/5'} transition-all`}>Cancel</button>
                <button onClick={handleGenerate} disabled={!preview || previewUnits <= 0} className="flex-1 glow-btn py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <FileText size={16} /> Generate Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Bill Modal */}
      {viewBill && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setViewBill(null)}>
          <div className={`${isDark ? 'glass-strong' : 'glass-strong-light'} w-full max-w-md p-6 fade-in`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Bill Details</h3>
                <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{viewBill.billNumber}</p>
              </div>
              <button onClick={() => setViewBill(null)} className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-[#7c3aed]/10 text-[#1e1145]/50'}`}><X size={20} /></button>
            </div>
            <div className="space-y-2">
              {[
                ['Consumer', viewBill.consumerName],
                ['Consumer No.', viewBill.consumerNumber],
                ['Billing Month', viewBill.billingMonth],
                ['Meter', viewBill.meterId],
                ['Previous Reading', viewBill.previousReading.toString()],
                ['Current Reading', viewBill.currentReading.toString()],
                ['Units Consumed', viewBill.unitsConsumed.toString()],
              ].map(([l, v]) => (
                <div key={l} className={`flex justify-between py-1.5 border-b ${isDark ? 'border-white/5' : 'border-[#7c3aed]/5'}`}>
                  <span className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{l}</span>
                  <span className={`text-sm font-medium ${isDark ? 'text-white/90' : 'text-[#1e1145]/90'}`}>{v}</span>
                </div>
              ))}
              <div className={`mt-3 p-4 rounded-xl ${isDark ? 'bg-white/5' : 'bg-[#7c3aed]/5'}`}>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className={isDark ? 'text-white/50' : 'text-[#1e1145]/50'}>Energy Charge</span><span className={isDark ? 'text-white/80' : 'text-[#1e1145]/80'}>₹{viewBill.energyCharge.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className={isDark ? 'text-white/50' : 'text-[#1e1145]/50'}>Electricity Duty</span><span className={isDark ? 'text-white/80' : 'text-[#1e1145]/80'}>₹{viewBill.electricityDuty.toLocaleString('en-IN')}</span></div>
                  <div className="flex justify-between"><span className={isDark ? 'text-white/50' : 'text-[#1e1145]/50'}>Fixed Charge</span><span className={isDark ? 'text-white/80' : 'text-[#1e1145]/80'}>₹{viewBill.fixedCharge}</span></div>
                  <div className="flex justify-between"><span className={isDark ? 'text-white/50' : 'text-[#1e1145]/50'}>GST (18%)</span><span className={isDark ? 'text-white/80' : 'text-[#1e1145]/80'}>₹{viewBill.gst.toLocaleString('en-IN')}</span></div>
                  <div className={`flex justify-between pt-2 border-t ${isDark ? 'border-white/10' : 'border-[#7c3aed]/10'} font-bold text-base`}>
                    <span className="gradient-text">Total</span>
                    <span className="gradient-text">₹{viewBill.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
              <div className={`flex justify-between pt-2`}>
                <span className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Due Date</span>
                <span className="text-sm font-medium text-[#f59e0b]">{viewBill.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Status</span>
                <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${viewBill.status === 'Paid' ? 'bg-green-500/15 text-green-400' : viewBill.status === 'Overdue' ? 'bg-red-500/15 text-red-400' : 'bg-yellow-500/15 text-yellow-400'}`}>{viewBill.status}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
