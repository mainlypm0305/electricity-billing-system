import { useState } from 'react';
import { Complaint, Consumer } from '../types';
import { Search, Plus, X, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';

interface ComplaintsPageProps {
  complaints: Complaint[];
  consumers: Consumer[];
  onAdd: (complaint: Omit<Complaint, 'id' | 'complaintNumber'>) => void;
  onResolve: (id: number, notes: string) => void;
  isDark: boolean;
}

export default function ComplaintsPage({ complaints, consumers, onAdd, onResolve, isDark }: ComplaintsPageProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [viewComplaint, setViewComplaint] = useState<Complaint | null>(null);
  const [resolveId, setResolveId] = useState<number | null>(null);
  const [resolveNotes, setResolveNotes] = useState('');

  const [form, setForm] = useState({
    consumerId: '',
    category: 'Power Failure' as Complaint['category'],
    priority: 'Medium' as Complaint['priority'],
    description: '',
  });

  const filtered = complaints.filter(c => {
    const matchSearch = c.consumerName.toLowerCase().includes(search.toLowerCase()) || c.complaintNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const consumer = consumers.find(c => c.id === parseInt(form.consumerId));
    if (!consumer || !form.description.trim()) return;

    onAdd({
      consumerId: consumer.id,
      consumerName: consumer.name,
      category: form.category,
      priority: form.priority,
      description: form.description,
      status: 'Open',
      createdDate: new Date().toISOString().split('T')[0],
    });

    setShowForm(false);
    setForm({ consumerId: '', category: 'Power Failure', priority: 'Medium', description: '' });
  };

  const handleResolve = () => {
    if (resolveId && resolveNotes.trim()) {
      onResolve(resolveId, resolveNotes);
      setResolveId(null);
      setResolveNotes('');
    }
  };

  const inputClass = isDark ? 'glass-input' : 'glass-input-light';
  const selectClass = isDark ? 'glass-select' : 'glass-select-light';

  const priorityColor = (p: string) => {
    switch (p) {
      case 'Low': return 'bg-blue-500/15 text-blue-400';
      case 'Medium': return 'bg-yellow-500/15 text-yellow-400';
      case 'High': return 'bg-orange-500/15 text-orange-400';
      case 'Critical': return 'bg-red-500/15 text-red-400';
      default: return '';
    }
  };

  const statusIcon = (s: string) => {
    switch (s) {
      case 'Open': return <AlertTriangle size={12} className="text-yellow-400" />;
      case 'In Progress': return <Clock size={12} className="text-blue-400" />;
      case 'Resolved': return <CheckCircle size={12} className="text-green-400" />;
      case 'Closed': return <CheckCircle size={12} className="text-gray-400" />;
      default: return null;
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'Open': return 'bg-yellow-500/15 text-yellow-400';
      case 'In Progress': return 'bg-blue-500/15 text-blue-400';
      case 'Resolved': return 'bg-green-500/15 text-green-400';
      case 'Closed': return 'bg-gray-500/15 text-gray-400';
      default: return '';
    }
  };

  return (
    <div className="space-y-4 fade-in">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(['Open', 'In Progress', 'Resolved', 'Closed'] as const).map(status => {
          const count = complaints.filter(c => c.status === status).length;
          return (
            <div key={status} className={`${isDark ? 'glass' : 'glass-light'} p-4`}>
              <div className="flex items-center gap-2 mb-1">
                {statusIcon(status)}
                <span className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'} uppercase tracking-wider`}>{status}</span>
              </div>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{count}</p>
            </div>
          );
        })}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-[#1e1145]/30'}`} />
            <input type="text" placeholder="Search complaints..." value={search} onChange={e => setSearch(e.target.value)} className={`${inputClass} w-full pl-9 pr-4 py-2.5 text-sm`} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={`${selectClass} px-3 py-2.5 text-sm pr-8`}>
            <option value="all">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <button onClick={() => setShowForm(true)} className="glow-btn px-4 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> New Complaint
        </button>
      </div>

      {/* Complaints List */}
      <div className="grid gap-3">
        {filtered.map(c => (
          <div key={c.id} className={`${isDark ? 'glass' : 'glass-light'} p-4 hover:scale-[1.005] transition-all duration-200`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-mono ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{c.complaintNumber}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityColor(c.priority)}`}>{c.priority}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${statusColor(c.status)}`}>
                    {statusIcon(c.status)} {c.status}
                  </span>
                </div>
                <p className={`text-sm font-semibold ${isDark ? 'text-white/90' : 'text-[#1e1145]/90'}`}>{c.consumerName}</p>
                <p className={`text-xs mt-1 ${isDark ? 'text-white/50' : 'text-[#1e1145]/50'}`}>{c.category} • {c.createdDate}</p>
                <p className={`text-xs mt-2 ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} line-clamp-2`}>{c.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setViewComplaint(c)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10 text-white/50 hover:text-[#00d4ff]' : 'hover:bg-[#7c3aed]/10 text-[#1e1145]/50 hover:text-[#7c3aed]'} transition-all`}>
                  <Eye size={16} />
                </button>
                {(c.status === 'Open' || c.status === 'In Progress') && (
                  <button onClick={() => { setResolveId(c.id); setResolveNotes(''); }} className="text-xs px-3 py-1.5 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25 transition-all font-medium">
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className={`${isDark ? 'glass' : 'glass-light'} p-8 text-center`}>
            <p className={`text-sm ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>No complaints found</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className={`${isDark ? 'glass-strong' : 'glass-strong-light'} w-full max-w-md p-6 fade-in`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Register Complaint</h3>
              <button onClick={() => setShowForm(false)} className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-[#7c3aed]/10 text-[#1e1145]/50'}`}><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Consumer</label>
                <select value={form.consumerId} onChange={e => setForm({ ...form, consumerId: e.target.value })} className={`${selectClass} w-full px-4 py-2.5 text-sm`} required>
                  <option value="">Choose consumer...</option>
                  {consumers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.consumerNumber})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Complaint['category'] })} className={`${selectClass} w-full px-4 py-2.5 text-sm`}>
                    <option value="Power Failure">Power Failure</option>
                    <option value="Meter Issue">Meter Issue</option>
                    <option value="Billing Issue">Billing Issue</option>
                    <option value="Connection Issue">Connection Issue</option>
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Priority</label>
                  <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Complaint['priority'] })} className={`${selectClass} w-full px-4 py-2.5 text-sm`}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={`${inputClass} w-full px-4 py-2.5 text-sm resize-none`} placeholder="Describe the issue..." required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border ${isDark ? 'border-white/10 text-white/60 hover:bg-white/5' : 'border-[#7c3aed]/10 text-[#1e1145]/60 hover:bg-[#7c3aed]/5'} transition-all`}>Cancel</button>
                <button type="submit" className="flex-1 glow-btn py-2.5 rounded-xl text-white text-sm font-semibold">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {resolveId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setResolveId(null)}>
          <div className={`${isDark ? 'glass-strong' : 'glass-strong-light'} w-full max-w-md p-6 fade-in`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Resolve Complaint</h3>
              <button onClick={() => setResolveId(null)} className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-[#7c3aed]/10 text-[#1e1145]/50'}`}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Resolution Notes</label>
                <textarea value={resolveNotes} onChange={e => setResolveNotes(e.target.value)} rows={4} className={`${inputClass} w-full px-4 py-2.5 text-sm resize-none`} placeholder="Describe the resolution..." />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setResolveId(null)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border ${isDark ? 'border-white/10 text-white/60 hover:bg-white/5' : 'border-[#7c3aed]/10 text-[#1e1145]/60 hover:bg-[#7c3aed]/5'} transition-all`}>Cancel</button>
                <button onClick={handleResolve} className="flex-1 glow-btn py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> Resolve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewComplaint && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setViewComplaint(null)}>
          <div className={`${isDark ? 'glass-strong' : 'glass-strong-light'} w-full max-w-md p-6 fade-in`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Complaint Details</h3>
              <button onClick={() => setViewComplaint(null)} className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-[#7c3aed]/10 text-[#1e1145]/50'}`}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              {[
                ['Complaint No.', viewComplaint.complaintNumber],
                ['Consumer', viewComplaint.consumerName],
                ['Category', viewComplaint.category],
                ['Priority', viewComplaint.priority],
                ['Status', viewComplaint.status],
                ['Created', viewComplaint.createdDate],
                ...(viewComplaint.resolvedDate ? [['Resolved', viewComplaint.resolvedDate]] : []),
              ].map(([l, v]) => (
                <div key={l} className={`flex justify-between py-1.5 border-b ${isDark ? 'border-white/5' : 'border-[#7c3aed]/5'}`}>
                  <span className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{l}</span>
                  <span className={`text-sm font-medium ${isDark ? 'text-white/90' : 'text-[#1e1145]/90'}`}>{v}</span>
                </div>
              ))}
              <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-[#7c3aed]/5'} mt-3`}>
                <p className={`text-xs font-medium mb-1 ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'} uppercase tracking-wider`}>Description</p>
                <p className={`text-sm ${isDark ? 'text-white/80' : 'text-[#1e1145]/80'}`}>{viewComplaint.description}</p>
              </div>
              {viewComplaint.resolutionNotes && (
                <div className="p-3 rounded-xl bg-green-500/10 mt-2">
                  <p className="text-xs font-medium mb-1 text-green-400/60 uppercase tracking-wider">Resolution</p>
                  <p className="text-sm text-green-400">{viewComplaint.resolutionNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
