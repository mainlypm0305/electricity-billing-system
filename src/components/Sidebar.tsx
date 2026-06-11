import React from 'react';
import { Page } from '../types';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  MessageSquareWarning,
  BarChart3,
  Settings,
  Zap,
  LogOut,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
  onLogout: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
  isDark: boolean;
}

const menuItems: { icon: React.ReactNode; label: string; page: Page }[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', page: 'dashboard' },
  { icon: <Users size={20} />, label: 'Consumers', page: 'consumers' },
  { icon: <FileText size={20} />, label: 'Billing', page: 'billing' },
  { icon: <CreditCard size={20} />, label: 'Payments', page: 'payments' },
  { icon: <MessageSquareWarning size={20} />, label: 'Complaints', page: 'complaints' },
  { icon: <BarChart3 size={20} />, label: 'Reports', page: 'reports' },
  { icon: <Settings size={20} />, label: 'Settings', page: 'settings' },
];

export default function Sidebar({ currentPage, onPageChange, onLogout, isMobileOpen, onMobileClose, isDark }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileClose} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} ${isDark ? 'glass-strong' : 'glass-strong-light'}`}
        style={{ borderRadius: '0 20px 20px 0' }}>
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8 px-2 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-[#00d4ff]/20">
                <Zap size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">EBS 2026</h1>
                <p className={`text-[10px] ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'} tracking-wider uppercase`}>Billing System</p>
              </div>
            </div>
            <button onClick={onMobileClose} className="lg:hidden text-white/60 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => { onPageChange(item.page); onMobileClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00d4ff]/20 to-[#7c3aed]/20 text-[#00d4ff] shadow-lg shadow-[#00d4ff]/5'
                      : isDark
                        ? 'text-white/60 hover:text-white/90 hover:bg-white/5'
                        : 'text-[#1e1145]/60 hover:text-[#1e1145]/90 hover:bg-[#7c3aed]/5'
                  }`}
                >
                  <span className={isActive ? 'text-[#00d4ff]' : ''}>{item.icon}</span>
                  {item.label}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00d4ff] shadow-lg shadow-[#00d4ff]/50" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* User & Logout */}
          <div className={`border-t ${isDark ? 'border-white/10' : 'border-[#7c3aed]/10'} pt-4 mt-4`}>
            <div className="flex items-center gap-3 px-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${isDark ? 'text-white/90' : 'text-[#1e1145]/90'} truncate`}>Admin</p>
                <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Administrator</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isDark ? 'text-red-400/80 hover:bg-red-500/10 hover:text-red-400' : 'text-red-500/80 hover:bg-red-50 hover:text-red-600'}`}
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
