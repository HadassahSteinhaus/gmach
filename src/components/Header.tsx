import { Home, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  current: 'home' | 'admin';
  onNavigate: (page: 'home' | 'admin') => void;
}

export default function Header({ current, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white grid place-items-center shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Home className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <div className="text-right leading-tight">
            <div className="text-base font-bold text-slate-800">גמ"ח ציוד לאירועים</div>
            <div className="text-[11px] text-slate-500 font-medium">השאלת ציוד ליולדות ולאירועים</div>
          </div>
        </button>

        <nav className="flex items-center gap-1.5">
          <button
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-1.5 px-3.5 h-9 rounded-lg text-sm font-medium transition-colors ${
              current === 'home'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">פריטים</span>
          </button>
          <button
            onClick={() => onNavigate('admin')}
            className={`flex items-center gap-1.5 px-3.5 h-9 rounded-lg text-sm font-medium transition-colors ${
              current === 'admin'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">ניהול</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
