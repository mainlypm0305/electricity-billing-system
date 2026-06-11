import { useState } from 'react';
import { Sun, Moon, Shield, Bell, Database, Info, Zap } from 'lucide-react';

interface SettingsPageProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function SettingsPage({ isDark, toggleTheme }: SettingsPageProps) {
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  const inputClass = isDark ? 'glass-input' : 'glass-input-light';

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${checked ? 'bg-gradient-to-r from-[#00d4ff] to-[#7c3aed]' : isDark ? 'bg-white/10' : 'bg-gray-300'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
  );

  return (
    <div className="space-y-4 fade-in max-w-3xl">
      {/* Appearance */}
      <div className={`${isDark ? 'glass' : 'glass-light'} p-5`}>
        <div className="flex items-center gap-3 mb-4">
          {isDark ? <Moon size={20} className="text-[#7c3aed]" /> : <Sun size={20} className="text-[#f59e0b]" />}
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Appearance</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-white/80' : 'text-[#1e1145]/80'}`}>Dark Mode</p>
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Toggle between light and dark themes</p>
            </div>
            <Toggle checked={isDark} onChange={toggleTheme} />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className={`${isDark ? 'glass' : 'glass-light'} p-5`}>
        <div className="flex items-center gap-3 mb-4">
          <Bell size={20} className="text-[#00d4ff]" />
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Notifications</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-white/80' : 'text-[#1e1145]/80'}`}>Push Notifications</p>
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Receive real-time alerts for new events</p>
            </div>
            <Toggle checked={notifEnabled} onChange={() => setNotifEnabled(!notifEnabled)} />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className={`${isDark ? 'glass' : 'glass-light'} p-5`}>
        <div className="flex items-center gap-3 mb-4">
          <Shield size={20} className="text-green-400" />
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Security</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-white/80' : 'text-[#1e1145]/80'}`}>Session Timeout</p>
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Auto logout after inactivity (minutes)</p>
            </div>
            <input
              type="number"
              value={sessionTimeout}
              onChange={e => setSessionTimeout(parseInt(e.target.value) || 0)}
              className={`${inputClass} w-20 px-3 py-1.5 text-sm text-center`}
              min={5}
              max={120}
            />
          </div>
          <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-[#7c3aed]/5'}`}>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className={isDark ? 'text-white/60' : 'text-[#1e1145]/60'}>Password hashing: SHA-256 with salt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className={isDark ? 'text-white/60' : 'text-[#1e1145]/60'}>SQL injection protection: Prepared statements</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className={isDark ? 'text-white/60' : 'text-[#1e1145]/60'}>Session management: HttpOnly, Secure cookies</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className={isDark ? 'text-white/60' : 'text-[#1e1145]/60'}>Account lockout after 5 failed attempts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Database */}
      <div className={`${isDark ? 'glass' : 'glass-light'} p-5`}>
        <div className="flex items-center gap-3 mb-4">
          <Database size={20} className="text-[#f59e0b]" />
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Database</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-white/80' : 'text-[#1e1145]/80'}`}>Auto Backup</p>
              <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Daily automatic database backup</p>
            </div>
            <Toggle checked={autoBackup} onChange={() => setAutoBackup(!autoBackup)} />
          </div>
          <div className={`p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-[#7c3aed]/5'}`}>
            <p className={`text-xs ${isDark ? 'text-white/50' : 'text-[#1e1145]/50'}`}>Database: MySQL 8.0+ | Engine: InnoDB | Charset: utf8mb4</p>
            <p className={`text-xs ${isDark ? 'text-white/50' : 'text-[#1e1145]/50'} mt-1`}>Tables: users, consumers, meters, bills, payments, complaints, notifications, audit_log</p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className={`${isDark ? 'glass' : 'glass-light'} p-5`}>
        <div className="flex items-center gap-3 mb-4">
          <Info size={20} className="text-[#00d4ff]" />
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>About</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center shadow-lg">
            <Zap size={28} className="text-white" />
          </div>
          <div>
            <h4 className="gradient-text font-bold text-lg">EBS 2026</h4>
            <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'}`}>Electricity Billing System</p>
            <p className={`text-xs ${isDark ? 'text-white/50' : 'text-[#1e1145]/50'} mt-1`}>Version 2.0.0 • June 2026</p>
          </div>
        </div>
        <div className={`mt-4 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-[#7c3aed]/5'} text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'} space-y-1`}>
          <p>Built with: React, TypeScript, Tailwind CSS, Recharts</p>
          <p>Architecture: MVC with component-based frontend</p>
          <p>Features: Glassmorphism UI, Dark/Light mode, Real-time analytics</p>
        </div>
      </div>
    </div>
  );
}
