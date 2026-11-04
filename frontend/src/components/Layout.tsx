import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, Users, ClipboardCheck } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const menu = [
    { name: 'لوحة القيادة', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'تقارير PIR', path: '/pirs', icon: <AlertTriangle size={20} /> },
    { name: 'الموردين', path: '/suppliers', icon: <Users size={20} /> },
    { name: 'شاشة الفحص', path: '/inspection', icon: <ClipboardCheck size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white md:min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-8 text-blue-400 flex items-center gap-2">
          <ClipboardCheck /> QualityMind
        </h1>
        <nav className="space-y-2">
          {menu.map((item) => (
            <Link key={item.path} to={item.path} 
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
