import { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastProps {
  toasts: ToastData[];
  onRemove: (id: number) => void;
}

const icons = {
  success: <CheckCircle size={18} className="text-green-400" />,
  error: <XCircle size={18} className="text-red-400" />,
  warning: <AlertTriangle size={18} className="text-yellow-400" />,
  info: <Info size={18} className="text-blue-400" />,
};

const bgColors = {
  success: 'border-green-500/20',
  error: 'border-red-500/20',
  warning: 'border-yellow-500/20',
  info: 'border-blue-500/20',
};

export default function ToastContainer({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2 max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: ToastData; onRemove: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div className={`glass-strong flex items-center gap-3 px-4 py-3 border ${bgColors[toast.type]} toast-enter`}>
      {icons[toast.type]}
      <p className="text-sm text-white/90 flex-1">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="text-white/30 hover:text-white/60 transition-colors">
        <X size={14} />
      </button>
    </div>
  );
}
