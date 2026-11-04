#!/bin/bash
mkdir -p src/pages src/components

# 1. Layout Component (Sidebar & Header)
cat << 'LAYOUT' > src/components/Layout.tsx
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
LAYOUT

# 2. Dashboard (Second Rule-60)
cat << 'DASH' > src/pages/Dashboard.tsx
import { AlertCircle, CheckCircle, TrendingDown, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">لوحة القيادة (Second Rule-60)</h2>
        <p className="text-slate-500">ملخص حالة الجودة في 60 ثانية</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm">مؤشر PPM</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-2">450</h3>
            </div>
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><TrendingDown size={24} /></div>
          </div>
          <p className="text-xs text-emerald-600 mt-4 font-medium">↓ 15% عن الشهر الماضي</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm">PIRs مفتوحة</p>
              <h3 className="text-3xl font-bold text-orange-600 mt-2">12</h3>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><AlertCircle size={24} /></div>
          </div>
          <p className="text-xs text-orange-600 mt-4 font-medium">3 تقارير متأخرة عن الـ SLA</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm">مخاطر خط الإنتاج (PRI)</p>
              <h3 className="text-3xl font-bold text-red-600 mt-2">عالية</h3>
            </div>
            <div className="bg-red-100 p-2 rounded-lg text-red-600"><ShieldAlert size={24} /></div>
          </div>
          <p className="text-xs text-red-600 mt-4 font-medium">الجزء رقم 77777 (تغطية 1.8 يوم)</p>
        </div>
      </div>

      {/* Rule 60 Answers */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-bold text-lg mb-4 text-slate-800">إجابات القيادة السريعة</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <CheckCircle className="text-emerald-500" />
            <p className="text-slate-700"><strong>هل المصنع آمن؟</strong> نعم، لا توجد حوادث اليوم.</p>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <AlertCircle className="text-red-500" />
            <p className="text-slate-700"><strong>من أسوأ مورد اليوم؟</strong> شركة ABC (تسجيل 3 عيوب V1).</p>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <CheckCircle className="text-blue-500" />
            <p className="text-slate-700"><strong>أهم فرصة Kaizen؟</strong> تقليل عيوب الخدش في خط الأبواب (توفير 8K ج).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
DASH

# 3. PIRs Page
cat << 'PIRS' > src/pages/PIRs.tsx
export default function PIRs() {
  const pirs = [
    { id: 'PIR-2026-089', part: 'Part# 12345', supplier: 'ABC Auto', status: 'OPEN', severity: 'V1', days: 2 },
    { id: 'PIR-2026-090', part: 'Part# 77777', supplier: 'XYZ Parts', status: 'WAITING_PERMANENT', severity: 'V2', days: 5 },
    { id: 'PIR-2026-091', part: 'Part# 99999', supplier: 'ABC Auto', status: 'CLOSED', severity: 'V3', days: 12 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">تقارير المشاكل (PIRs)</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600">رقم التقرير</th>
              <th className="p-4 text-sm font-semibold text-slate-600">الجزء</th>
              <th className="p-4 text-sm font-semibold text-slate-600">المورد</th>
              <th className="p-4 text-sm font-semibold text-slate-600">الحالة</th>
              <th className="p-4 text-sm font-semibold text-slate-600">الخطورة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pirs.map(pir => (
              <tr key={pir.id} className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-800">{pir.id}</td>
                <td className="p-4 text-slate-600">{pir.part}</td>
                <td className="p-4 text-slate-600">{pir.supplier}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${pir.status === 'OPEN' ? 'bg-orange-100 text-orange-700' : pir.status === 'CLOSED' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {pir.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${pir.severity === 'V1' ? 'bg-red-100 text-red-700' : pir.severity === 'V2' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'}`}>
                    {pir.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
PIRS

# 4. Suppliers Page
cat << 'SUPS' > src/pages/Suppliers.tsx
export default function Suppliers() {
  const suppliers = [
    { name: 'ABC Auto Parts', score: 62, trend: 'down' },
    { name: 'XYZ Manufacturing', score: 88, trend: 'up' },
    { name: 'Global Plastics', score: 95, trend: 'up' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">أداء الموردين (Smart Score)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map(s => (
          <div key={s.name} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-slate-800">{s.name}</h3>
              <p className="text-sm text-slate-500">آخر تحديث: اليوم</p>
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-3xl font-bold ${s.score > 80 ? 'text-emerald-600' : s.score > 60 ? 'text-orange-500' : 'text-red-600'}`}>
                {s.score}/100
              </span>
              <span className={`text-xs font-medium ${s.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                {s.trend === 'up' ? '↑ تحسن' : '↓ تراجع'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
SUPS

# 5. Inspection Page (Mock)
cat << 'INSP' > src/pages/Inspection.tsx
import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Inspection() {
  const [result, setResult] = useState('OK');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">شاشة الفحص (Inspector View)</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Part Number</label>
          <input value="PART-12345" readOnly className="w-full p-2 border rounded-lg bg-slate-50 text-slate-600" dir="ltr" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">النتيجة</label>
            <select value={result} onChange={e => setResult(e.target.value)} className="w-full p-2 border rounded-lg">
              <option value="OK">مطابق (OK)</option>
              <option value="NG">غير مطابق (NG)</option>
            </select>
          </div>
          {result === 'NG' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">درجة الخطورة</label>
              <select className="w-full p-2 border rounded-lg border-red-300 bg-red-50">
                <option>V1 - خطير جداً</option>
                <option>V2 - متوسط</option>
                <option>V3 - بسيط</option>
              </select>
            </div>
          )}
        </div>
        {result === 'NG' && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3">
            <AlertTriangle className="text-red-500 shrink-0" />
            <p className="text-sm text-red-700">تنبيه: تسجيل عيب V1 سيقوم بتوليد تقرير PIR أوتوماتيكياً وإيقاف خط الإنتاج.</p>
          </div>
        )}
        <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition mt-4">
          إرسال النتيجة
        </button>
      </div>
    </div>
  );
}
INSP

# 6. App Routing
cat << 'APP' > src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PIRs from './pages/PIRs';
import Suppliers from './pages/Suppliers';
import Inspection from './pages/Inspection';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="pirs" element={<PIRs />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="inspection" element={<Inspection />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
APP

echo "✅ Demo UI created successfully!"
