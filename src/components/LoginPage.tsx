import { useState } from 'react';
import { Zap, Eye, EyeOff, Lock, User, Users, Shield } from 'lucide-react';

export type LoginRole = 'admin' | 'consumer';

interface LoginPageProps {
  onAdminLogin: (username: string, password: string) => boolean;
  onConsumerLogin: (consumerNumber: string, mobile: string) => boolean;
}

export default function LoginPage({ onAdminLogin, onConsumerLogin }: LoginPageProps) {
  const [role, setRole] = useState<LoginRole>('consumer');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [mobile, setMobile] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      let success = false;
      if (role === 'admin') {
        success = onAdminLogin(username, password);
        if (!success) setError('Invalid admin credentials');
      } else {
        success = onConsumerLogin(consumerNumber, mobile);
        if (!success) setError('Invalid consumer number or mobile');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="dark-bg min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Particles */}
      <div className="particle w-72 h-72 top-10 left-10" style={{ animationDelay: '0s' }} />
      <div className="particle w-96 h-96 bottom-20 right-20" style={{ animationDelay: '3s', background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent)' }} />
      <div className="particle w-48 h-48 top-1/3 right-1/4" style={{ animationDelay: '6s' }} />

      <div className="glass-strong w-full max-w-md p-8 sm:p-10 fade-in relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-[#00d4ff]/30 mb-4">
            <Zap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">EBS 2026</h1>
          <p className="text-white/40 text-sm mt-1">Electricity Billing System</p>
        </div>

        {/* Role Toggle */}
        <div className="flex mb-6 p-1 rounded-xl bg-white/5 border border-white/10">
          <button
            type="button"
            onClick={() => { setRole('consumer'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              role === 'consumer'
                ? 'bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white shadow-lg'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <Users size={16} />
            Consumer
          </button>
          <button
            type="button"
            onClick={() => { setRole('admin'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              role === 'admin'
                ? 'bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] text-white shadow-lg'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <Shield size={16} />
            Admin
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {role === 'admin' ? (
            <>
              {/* Admin Username */}
              <div>
                <label className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2 block">Username</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="glass-input w-full pl-11 pr-4 py-3 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Admin Password */}
              <div>
                <label className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2 block">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="glass-input w-full pl-11 pr-11 py-3 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Consumer Number */}
              <div>
                <label className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2 block">Consumer Number</label>
                <div className="relative">
                  <Zap size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={consumerNumber}
                    onChange={(e) => setConsumerNumber(e.target.value.toUpperCase())}
                    placeholder="EBS-2026-001"
                    className="glass-input w-full pl-11 pr-4 py-3 text-sm uppercase"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2 block">Mobile Number</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number"
                    className="glass-input w-full pl-11 pr-4 py-3 text-sm"
                    required
                    pattern="[0-9]{10}"
                  />
                </div>
              </div>
            </>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="glow-btn w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              `Sign In as ${role === 'admin' ? 'Administrator' : 'Consumer'}`
            )}
          </button>
        </form>


      </div>
    </div>
  );
}
