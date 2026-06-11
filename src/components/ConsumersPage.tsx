import { useState } from 'react';
import { Consumer } from '../types';
import { Plus, Search, Edit, Trash2, Eye, X, UserCheck, UserX } from 'lucide-react';

interface ConsumersPageProps {
  consumers: Consumer[];
  onAdd: (consumer: Omit<Consumer, 'id' | 'consumerNumber'>) => void;
  onUpdate: (consumer: Consumer) => void;
  onDelete: (id: number) => void;
  isDark: boolean;
}

type ConsumerForm = {
  name: string; email: string; mobile: string; address: string; city: string; state: string; pincode: string;
  connectionType: Consumer['connectionType']; connectionDate: string; status: Consumer['status']; meterId: string;
};

const emptyConsumer: ConsumerForm = {
  name: '', email: '', mobile: '', address: '', city: '', state: '', pincode: '',
  connectionType: 'Residential', connectionDate: '', status: 'Active', meterId: ''
};

export default function ConsumersPage({ consumers, onAdd, onUpdate, onDelete, isDark }: ConsumersPageProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editConsumer, setEditConsumer] = useState<Consumer | null>(null);
  const [viewConsumer, setViewConsumer] = useState<Consumer | null>(null);
  const [form, setForm] = useState<ConsumerForm>(emptyConsumer);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = consumers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.consumerNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.connectionType === filter || c.status === filter;
    return matchSearch && matchFilter;
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Valid email required';
    if (!form.mobile.match(/^\d{10}$/)) errs.mobile = 'Valid 10-digit mobile required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.state.trim()) errs.state = 'State is required';
    if (!form.pincode.match(/^\d{6}$/)) errs.pincode = 'Valid 6-digit pincode required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (editConsumer) {
      onUpdate({ ...editConsumer, ...form });
    } else {
      onAdd(form);
    }
    setShowForm(false);
    setEditConsumer(null);
    setForm(emptyConsumer);
  };

  const openEdit = (c: Consumer) => {
    setEditConsumer(c);
    setForm({ name: c.name, email: c.email, mobile: c.mobile, address: c.address, city: c.city, state: c.state, pincode: c.pincode, connectionType: c.connectionType, connectionDate: c.connectionDate, status: c.status, meterId: c.meterId });
    setShowForm(true);
  };

  const inputClass = isDark ? 'glass-input' : 'glass-input-light';
  const selectClass = isDark ? 'glass-select' : 'glass-select-light';

  return (
    <div className="space-y-4 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/30' : 'text-[#1e1145]/30'}`} />
            <input
              type="text"
              placeholder="Search consumers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputClass} w-full pl-9 pr-4 py-2.5 text-sm`}
            />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`${selectClass} px-3 py-2.5 text-sm pr-8`}>
            <option value="all">All</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <button onClick={() => { setShowForm(true); setEditConsumer(null); setForm(emptyConsumer); setErrors({}); }} className="glow-btn px-4 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Add Consumer
        </button>
      </div>

      {/* Table */}
      <div className={`${isDark ? 'glass' : 'glass-light'} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className={`w-full ${isDark ? 'glass-table' : 'glass-table-light'}`}>
            <thead>
              <tr>
                <th className="text-left">Consumer</th>
                <th className="text-left hidden md:table-cell">Contact</th>
                <th className="text-left hidden lg:table-cell">Location</th>
                <th className="text-left">Type</th>
                <th className="text-left">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="transition-colors">
                  <td>
                    <div>
                      <p className="font-semibold text-sm">{c.name}</p>
                      <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{c.consumerNumber}</p>
                    </div>
                  </td>
                  <td className="hidden md:table-cell">
                    <p className="text-sm">{c.email}</p>
                    <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{c.mobile}</p>
                  </td>
                  <td className="hidden lg:table-cell text-sm">{c.city}, {c.state}</td>
                  <td>
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${c.connectionType === 'Residential' ? 'bg-blue-500/15 text-blue-400' : c.connectionType === 'Commercial' ? 'bg-purple-500/15 text-purple-400' : 'bg-orange-500/15 text-orange-400'}`}>
                      {c.connectionType}
                    </span>
                  </td>
                  <td>
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium flex items-center gap-1 w-fit ${c.status === 'Active' ? 'bg-green-500/15 text-green-400' : c.status === 'Inactive' ? 'bg-gray-500/15 text-gray-400' : 'bg-red-500/15 text-red-400'}`}>
                      {c.status === 'Active' ? <UserCheck size={10} /> : <UserX size={10} />}
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewConsumer(c)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10 text-white/50 hover:text-[#00d4ff]' : 'hover:bg-[#7c3aed]/10 text-[#1e1145]/50 hover:text-[#7c3aed]'} transition-all`}>
                        <Eye size={15} />
                      </button>
                      <button onClick={() => openEdit(c)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10 text-white/50 hover:text-yellow-400' : 'hover:bg-yellow-50 text-[#1e1145]/50 hover:text-yellow-600'} transition-all`}>
                        <Edit size={15} />
                      </button>
                      <button onClick={() => { if (confirm('Delete this consumer?')) onDelete(c.id); }} className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10 text-white/50 hover:text-red-400' : 'hover:bg-red-50 text-[#1e1145]/50 hover:text-red-600'} transition-all`}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-sm opacity-40">No consumers found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className={`${isDark ? 'glass-strong' : 'glass-strong-light'} w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 fade-in`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{editConsumer ? 'Edit Consumer' : 'Add Consumer'}</h3>
              <button onClick={() => setShowForm(false)} className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-[#7c3aed]/10 text-[#1e1145]/50'}`}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Full Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={`${inputClass} w-full px-4 py-2.5 text-sm`} placeholder="Enter full name" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Email</label>
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={`${inputClass} w-full px-4 py-2.5 text-sm`} placeholder="email@example.com" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Mobile</label>
                  <input value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} className={`${inputClass} w-full px-4 py-2.5 text-sm`} placeholder="10-digit number" />
                  {errors.mobile && <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>}
                </div>
              </div>
              <div>
                <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Address</label>
                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={`${inputClass} w-full px-4 py-2.5 text-sm`} placeholder="Street address" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>City</label>
                  <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className={`${inputClass} w-full px-4 py-2.5 text-sm`} placeholder="City" />
                  {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>State</label>
                  <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className={`${inputClass} w-full px-4 py-2.5 text-sm`} placeholder="State" />
                  {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Pincode</label>
                  <input value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} className={`${inputClass} w-full px-4 py-2.5 text-sm`} placeholder="6-digit" />
                  {errors.pincode && <p className="text-red-400 text-xs mt-1">{errors.pincode}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Connection Type</label>
                  <select value={form.connectionType} onChange={e => setForm({ ...form, connectionType: e.target.value as Consumer['connectionType'] })} className={`${selectClass} w-full px-4 py-2.5 text-sm`}>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-[#1e1145]/60'} uppercase tracking-wider mb-1 block`}>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Consumer['status'] })} className={`${selectClass} w-full px-4 py-2.5 text-sm`}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border ${isDark ? 'border-white/10 text-white/60 hover:bg-white/5' : 'border-[#7c3aed]/10 text-[#1e1145]/60 hover:bg-[#7c3aed]/5'} transition-all`}>Cancel</button>
                <button type="submit" className="flex-1 glow-btn py-2.5 rounded-xl text-white text-sm font-semibold">{editConsumer ? 'Update' : 'Add Consumer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewConsumer && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setViewConsumer(null)}>
          <div className={`${isDark ? 'glass-strong' : 'glass-strong-light'} w-full max-w-md p-6 fade-in`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Consumer Details</h3>
              <button onClick={() => setViewConsumer(null)} className={`p-2 rounded-xl ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-[#7c3aed]/10 text-[#1e1145]/50'}`}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              {[
                ['Consumer No.', viewConsumer.consumerNumber],
                ['Name', viewConsumer.name],
                ['Email', viewConsumer.email],
                ['Mobile', viewConsumer.mobile],
                ['Address', `${viewConsumer.address}, ${viewConsumer.city}, ${viewConsumer.state} - ${viewConsumer.pincode}`],
                ['Connection Type', viewConsumer.connectionType],
                ['Status', viewConsumer.status],
                ['Meter ID', viewConsumer.meterId],
                ['Connection Date', viewConsumer.connectionDate],
              ].map(([label, value]) => (
                <div key={label} className={`flex justify-between py-2 border-b ${isDark ? 'border-white/5' : 'border-[#7c3aed]/5'}`}>
                  <span className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'} uppercase tracking-wider`}>{label}</span>
                  <span className={`text-sm font-medium ${isDark ? 'text-white/90' : 'text-[#1e1145]/90'}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
