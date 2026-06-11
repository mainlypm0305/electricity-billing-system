import { Bill, Payment, Consumer, Complaint } from '../types';
import { monthlyRevenueData } from '../data';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line
} from 'recharts';
import { TrendingUp, Download, Calendar, IndianRupee, Zap } from 'lucide-react';

interface ReportsPageProps {
  consumers: Consumer[];
  bills: Bill[];
  payments: Payment[];
  complaints: Complaint[];
  isDark: boolean;
}

export default function ReportsPage({ consumers, bills, payments, isDark }: ReportsPageProps) {
  const totalRevenue = payments.filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0);
  const totalUnits = bills.reduce((s, b) => s + b.unitsConsumed, 0);
  const avgBill = bills.length > 0 ? bills.reduce((s, b) => s + b.totalAmount, 0) / bills.length : 0;
  const collectionRate = bills.length > 0 ? (bills.filter(b => b.status === 'Paid').length / bills.length * 100) : 0;

  const connectionTypeData = [
    { type: 'Residential', count: consumers.filter(c => c.connectionType === 'Residential').length },
    { type: 'Commercial', count: consumers.filter(c => c.connectionType === 'Commercial').length },
    { type: 'Industrial', count: consumers.filter(c => c.connectionType === 'Industrial').length },
  ];

  const paymentModeData = [
    { mode: 'Cash', count: payments.filter(p => p.paymentMode === 'Cash').length },
    { mode: 'Cheque', count: payments.filter(p => p.paymentMode === 'Cheque').length },
    { mode: 'Online', count: payments.filter(p => p.paymentMode === 'Online').length },
    { mode: 'Card', count: payments.filter(p => p.paymentMode === 'Card').length },
    { mode: 'Bank Transfer', count: payments.filter(p => p.paymentMode === 'Bank Transfer').length },
  ].filter(d => d.count > 0);

  const tooltipStyle = {
    contentStyle: {
      background: isDark ? 'rgba(30, 17, 69, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(124,58,237,0.1)',
      borderRadius: '12px',
      color: isDark ? 'white' : '#1e1145',
      fontSize: '12px',
    }
  };

  return (
    <div className="space-y-4 fade-in">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <IndianRupee size={18} />, label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: 'from-[#00d4ff] to-[#0ea5e9]' },
          { icon: <Zap size={18} />, label: 'Total Units Billed', value: totalUnits.toLocaleString(), color: 'from-[#7c3aed] to-[#a855f7]' },
          { icon: <Calendar size={18} />, label: 'Avg Bill Amount', value: `₹${avgBill.toFixed(0)}`, color: 'from-[#f59e0b] to-[#f97316]' },
          { icon: <TrendingUp size={18} />, label: 'Collection Rate', value: `${collectionRate.toFixed(1)}%`, color: 'from-[#10b981] to-[#34d399]' },
        ].map((kpi, i) => (
          <div key={i} className={`${isDark ? 'glass' : 'glass-light'} p-4`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-lg`}>{kpi.icon}</div>
              <div>
                <p className={`text-[10px] ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'} uppercase tracking-wider`}>{kpi.label}</p>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{kpi.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Trend */}
        <div className={`${isDark ? 'glass' : 'glass-light'} p-5`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Revenue Trend</h3>
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>6-month revenue overview</p>
            </div>
            <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10 text-white/40' : 'hover:bg-[#7c3aed]/10 text-[#1e1145]/40'} transition-all`}>
              <Download size={16} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyRevenueData}>
              <defs>
                <linearGradient id="reportRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(124,58,237,0.08)'} />
              <XAxis dataKey="month" stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(30,17,69,0.3)'} fontSize={11} />
              <YAxis stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(30,17,69,0.3)'} fontSize={11} tickFormatter={v => `₹${v / 1000}k`} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} fillOpacity={1} fill="url(#reportRevGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Consumer Growth */}
        <div className={`${isDark ? 'glass' : 'glass-light'} p-5`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Consumer Growth</h3>
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Monthly consumer count</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(124,58,237,0.08)'} />
              <XAxis dataKey="month" stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(30,17,69,0.3)'} fontSize={11} />
              <YAxis stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(30,17,69,0.3)'} fontSize={11} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="consumers" stroke="#00d4ff" strokeWidth={2.5} dot={{ fill: '#00d4ff', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Connection Type Distribution */}
        <div className={`${isDark ? 'glass' : 'glass-light'} p-5`}>
          <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Connection Type Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={connectionTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(124,58,237,0.08)'} />
              <XAxis dataKey="type" stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(30,17,69,0.3)'} fontSize={11} />
              <YAxis stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(30,17,69,0.3)'} fontSize={11} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" fill="#00d4ff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Modes */}
        <div className={`${isDark ? 'glass' : 'glass-light'} p-5`}>
          <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Payment Mode Analysis</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={paymentModeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(124,58,237,0.08)'} />
              <XAxis type="number" stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(30,17,69,0.3)'} fontSize={11} />
              <YAxis type="category" dataKey="mode" stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(30,17,69,0.3)'} fontSize={11} width={80} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" fill="#f59e0b" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Billing Rate Table */}
      <div className={`${isDark ? 'glass' : 'glass-light'} p-5`}>
        <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Current Billing Rate Structure</h3>
        <div className="overflow-x-auto">
          <table className={`w-full ${isDark ? 'glass-table' : 'glass-table-light'}`}>
            <thead>
              <tr>
                <th className="text-left">Slab</th>
                <th className="text-left">Units Range</th>
                <th className="text-right">Rate (₹/unit)</th>
                <th className="text-right">Max Charge</th>
              </tr>
            </thead>
            <tbody>
              {[
                { slab: 'Slab 1', range: '0 - 100', rate: 5, max: '₹500' },
                { slab: 'Slab 2', range: '101 - 300', rate: 7, max: '₹1,400' },
                { slab: 'Slab 3', range: '301 - 500', rate: 9, max: '₹1,800' },
                { slab: 'Slab 4', range: '500+', rate: 12, max: 'Unlimited' },
              ].map((s) => (
                <tr key={s.slab}>
                  <td className="font-medium">{s.slab}</td>
                  <td>{s.range}</td>
                  <td className="text-right font-semibold">₹{s.rate}</td>
                  <td className="text-right">{s.max}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={`mt-4 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-[#7c3aed]/5'} text-xs ${isDark ? 'text-white/50' : 'text-[#1e1145]/50'}`}>
          <p><strong>Additional Charges:</strong> Electricity Duty (5%), Fixed Charge (₹50), GST (18% on subtotal)</p>
        </div>
      </div>
    </div>
  );
}
