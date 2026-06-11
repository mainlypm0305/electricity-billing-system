import { useMemo } from 'react';
import { Bill, Consumer, Payment, Complaint } from '../types';
import { monthlyRevenueData, categoryDistribution, complaintStats } from '../data';
import {
  Users, FileText, CreditCard, MessageSquareWarning,
  TrendingUp, Zap, IndianRupee, Activity
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

interface DashboardProps {
  consumers: Consumer[];
  bills: Bill[];
  payments: Payment[];
  complaints: Complaint[];
  isDark: boolean;
}

export default function Dashboard({ consumers, bills, payments, complaints, isDark }: DashboardProps) {
  const stats = useMemo(() => {
    const totalRevenue = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
    const pendingBills = bills.filter(b => b.status === 'Pending' || b.status === 'Overdue').length;
    const activeConsumers = consumers.filter(c => c.status === 'Active').length;
    const openComplaints = complaints.filter(c => c.status === 'Open' || c.status === 'In Progress').length;
    const totalUnits = bills.reduce((sum, b) => sum + b.unitsConsumed, 0);
    return { totalRevenue, pendingBills, activeConsumers, openComplaints, totalUnits };
  }, [consumers, bills, payments, complaints]);

  const statCards = [
    { icon: <IndianRupee size={22} />, label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: 'from-[#00d4ff] to-[#0ea5e9]', change: '+12.5%' },
    { icon: <Users size={22} />, label: 'Active Consumers', value: stats.activeConsumers.toString(), color: 'from-[#7c3aed] to-[#a855f7]', change: '+3.2%' },
    { icon: <FileText size={22} />, label: 'Pending Bills', value: stats.pendingBills.toString(), color: 'from-[#f59e0b] to-[#f97316]', change: '-5.1%' },
    { icon: <MessageSquareWarning size={22} />, label: 'Open Complaints', value: stats.openComplaints.toString(), color: 'from-[#ef4444] to-[#f43f5e]', change: '+2 new' },
  ];

  const recentBills = bills.slice(-5).reverse();
  const recentPayments = payments.slice(-5).reverse();

  const tooltipStyle = {
    contentStyle: {
      background: isDark ? 'rgba(30, 17, 69, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(124,58,237,0.1)',
      borderRadius: '12px',
      color: isDark ? 'white' : '#1e1145',
      fontSize: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className={`${isDark ? 'glass' : 'glass-light'} p-5 hover:scale-[1.02] transition-all duration-300 group`} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-xs font-medium ${isDark ? 'text-white/50' : 'text-[#1e1145]/50'} uppercase tracking-wider`}>{card.label}</p>
                <p className={`text-2xl font-bold mt-2 ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{card.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={12} className="text-green-400" />
                  <span className="text-xs text-green-400 font-medium">{card.change}</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white">{card.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className={`${isDark ? 'glass' : 'glass-light'} p-5 lg:col-span-2`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Revenue Overview</h3>
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Monthly revenue trend</p>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium">
              <Activity size={12} />
              Live
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyRevenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(124,58,237,0.08)'} />
              <XAxis dataKey="month" stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(30,17,69,0.3)'} fontSize={11} />
              <YAxis stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(30,17,69,0.3)'} fontSize={11} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip {...tooltipStyle} formatter={(value: unknown) => [`₹${Number(value).toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#00d4ff" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Consumer Distribution */}
        <div className={`${isDark ? 'glass' : 'glass-light'} p-5`}>
          <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Consumer Distribution</h3>
          <p className={`text-xs mb-4 ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>By connection type</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                innerRadius={55}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} formatter={(value: unknown) => [`${value}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryDistribution.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className={isDark ? 'text-white/70' : 'text-[#1e1145]/70'}>{item.name}</span>
                </div>
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complaint Stats + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Complaints by Category */}
        <div className={`${isDark ? 'glass' : 'glass-light'} p-5`}>
          <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Complaints by Category</h3>
          <p className={`text-xs mb-4 ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Current month overview</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={complaintStats}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(124,58,237,0.08)'} />
              <XAxis dataKey="category" stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(30,17,69,0.3)'} fontSize={9} />
              <YAxis stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(30,17,69,0.3)'} fontSize={11} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Bills */}
        <div className={`${isDark ? 'glass' : 'glass-light'} p-5`}>
          <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Recent Bills</h3>
          <div className="space-y-3">
            {recentBills.map((bill) => (
              <div key={bill.id} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-[#7c3aed]/5'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bill.status === 'Paid' ? 'bg-green-500/20 text-green-400' : bill.status === 'Overdue' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    <FileText size={14} />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${isDark ? 'text-white/90' : 'text-[#1e1145]/90'}`}>{bill.consumerName}</p>
                    <p className={`text-[10px] ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{bill.billNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>₹{bill.totalAmount.toLocaleString('en-IN')}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${bill.status === 'Paid' ? 'bg-green-500/20 text-green-400' : bill.status === 'Overdue' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {bill.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className={`${isDark ? 'glass' : 'glass-light'} p-5`}>
          <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Recent Payments</h3>
          <div className="space-y-3">
            {recentPayments.map((pay) => (
              <div key={pay.id} className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-[#7c3aed]/5'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                    <CreditCard size={14} />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${isDark ? 'text-white/90' : 'text-[#1e1145]/90'}`}>{pay.consumerName}</p>
                    <p className={`text-[10px] ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>{pay.paymentMode} • {pay.paymentDate}</p>
                  </div>
                </div>
                <p className="text-xs font-bold text-green-400">₹{pay.amount.toLocaleString('en-IN')}</p>
              </div>
            ))}
            {recentPayments.length === 0 && (
              <p className={`text-xs text-center py-8 ${isDark ? 'text-white/30' : 'text-[#1e1145]/30'}`}>No recent payments</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`${isDark ? 'glass' : 'glass-light'} p-4 text-center`}>
          <Zap size={20} className="text-[#00d4ff] mx-auto mb-2" />
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{stats.totalUnits.toLocaleString()}</p>
          <p className={`text-[10px] ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'} uppercase tracking-wider`}>Total Units</p>
        </div>
        <div className={`${isDark ? 'glass' : 'glass-light'} p-4 text-center`}>
          <FileText size={20} className="text-[#7c3aed] mx-auto mb-2" />
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{bills.length}</p>
          <p className={`text-[10px] ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'} uppercase tracking-wider`}>Total Bills</p>
        </div>
        <div className={`${isDark ? 'glass' : 'glass-light'} p-4 text-center`}>
          <CreditCard size={20} className="text-green-400 mx-auto mb-2" />
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{payments.length}</p>
          <p className={`text-[10px] ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'} uppercase tracking-wider`}>Payments</p>
        </div>
        <div className={`${isDark ? 'glass' : 'glass-light'} p-4 text-center`}>
          <Users size={20} className="text-[#f59e0b] mx-auto mb-2" />
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{consumers.length}</p>
          <p className={`text-[10px] ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'} uppercase tracking-wider`}>Consumers</p>
        </div>
      </div>
    </div>
  );
}
