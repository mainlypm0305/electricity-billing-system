import { useState, useRef, useEffect } from 'react';
import { Notification } from '../types';
import { Bell, Sun, Moon, Menu, Search, X } from 'lucide-react';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  notifications: Notification[];
  onMarkRead: (id: number) => void;
  onMenuToggle: () => void;
  pageTitle: string;
}

export default function Navbar({ isDark, toggleTheme, notifications, onMarkRead, onMenuToggle, pageTitle }: NavbarProps) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const typeColors: Record<string, string> = {
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
  };

  return (
    <header className={`${isDark ? 'glass' : 'glass-light'} px-4 sm:px-6 py-3 flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className={`lg:hidden p-2 rounded-xl ${isDark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-[#7c3aed]/10 text-[#1e1145]/70'}`}>
          <Menu size={22} />
        </button>
        <div>
          <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>{pageTitle}</h2>
          <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'} hidden sm:block`}>Welcome back, Administrator</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden sm:block">
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search..."
                className={`${isDark ? 'glass-input' : 'glass-input-light'} px-4 py-2 text-sm w-48`}
                autoFocus
              />
              <button onClick={() => setSearchOpen(false)} className={`p-2 rounded-xl ${isDark ? 'text-white/60 hover:bg-white/10' : 'text-[#1e1145]/60 hover:bg-[#7c3aed]/10'}`}>
                <X size={18} />
              </button>
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className={`p-2 rounded-xl ${isDark ? 'text-white/60 hover:bg-white/10 hover:text-white' : 'text-[#1e1145]/60 hover:bg-[#7c3aed]/10 hover:text-[#1e1145]'} transition-all`}>
              <Search size={20} />
            </button>
          )}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl transition-all ${isDark ? 'text-yellow-400 hover:bg-yellow-400/10' : 'text-[#7c3aed] hover:bg-[#7c3aed]/10'}`}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className={`p-2 rounded-xl relative transition-all ${isDark ? 'text-white/60 hover:bg-white/10 hover:text-white' : 'text-[#1e1145]/60 hover:bg-[#7c3aed]/10 hover:text-[#1e1145]'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center pulse-glow">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className={`absolute right-0 top-12 w-80 ${isDark ? 'glass-strong' : 'glass-strong-light'} p-4 shadow-2xl z-50 toast-enter`}>
              <h3 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-[#1e1145]'}`}>Notifications</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className={`text-sm ${isDark ? 'text-white/40' : 'text-[#1e1145]/40'} text-center py-4`}>No notifications</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => onMarkRead(n.id)}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-[#7c3aed]/5'} ${!n.isRead ? (isDark ? 'bg-white/5' : 'bg-[#7c3aed]/5') : ''}`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${typeColors[n.type]}`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold ${isDark ? 'text-white/90' : 'text-[#1e1145]/90'}`}>{n.title}</p>
                          <p className={`text-xs mt-0.5 ${isDark ? 'text-white/50' : 'text-[#1e1145]/50'}`}>{n.message}</p>
                          <p className={`text-[10px] mt-1 ${isDark ? 'text-white/30' : 'text-[#1e1145]/30'}`}>{n.createdDate}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
