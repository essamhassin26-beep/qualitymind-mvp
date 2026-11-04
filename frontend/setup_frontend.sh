#!/bin/bash
mkdir -p src/pages src/lib

cat << 'APP' > src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
APP

cat << 'LOGIN' > src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('admin@nissan.com.eg');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.access_token);
      navigate('/');
    } catch (err) {
      setError('بيانات الدخول غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4" dir="rtl">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6 text-blue-600">
          <ShieldCheck size={48} />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">QualityMind AI</h2>
        {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center text-sm">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">كلمة المرور</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">تسجيل الدخول</button>
        </form>
      </div>
    </div>
  );
}
LOGIN

cat << 'DASH' > src/pages/Dashboard.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { LogOut, ClipboardCheck, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [inspectionId, setInspectionId] = useState('1d6ed373-6118-4c3f-96b0-bb7fa3e11cb1');
  const [result, setResult] = useState('OK');
  const [severity, setSeverity] = useState('V1');
  const [message, setMessage] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const submitInspection = async () => {
    try {
      await api.post(`/inspections/${inspectionId}/results`, {
        result, severity, defectCode: 'D-001', notes: 'تم الفحص من الواجهة'
      });
      setMessage('✅ تم تسجيل نتيجة الفحص بنجاح!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ حدث خطأ أثناء تسجيل الفحص');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
          <ClipboardCheck /> QualityMind
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-red-600">
          <LogOut size={18} /> خروج
        </button>
      </nav>

      <main className="max-w-4xl mx-auto p-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">شاشة الفحص (Inspector View)</h2>
          
          {message && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-center">{message}</div>}

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">رقم الفحص (Inspection ID)</label>
              <input value={inspectionId} onChange={e => setInspectionId(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-50" dir="ltr" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">النتيجة</label>
                <select value={result} onChange={e => setResult(e.target.value)} className="w-full p-2 border rounded-lg">
                  <option value="OK">مطابق (OK)</option>
                  <option value="NG">غير مطابق (NG)</option>
                </select>
              </div>
              {result === 'NG' && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">درجة الخطورة</label>
                  <select value={severity} onChange={e => setSeverity(e.target.value)} className="w-full p-2 border rounded-lg">
                    <option value="V1">V1 - خطير جداً</option>
                    <option value="V2">V2 - متوسط</option>
                    <option value="V3">V3 - بسيط</option>
                  </select>
                </div>
              )}
            </div>

            {result === 'NG' && (
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg flex items-start gap-3">
                <AlertTriangle className="text-orange-500 shrink-0" />
                <p className="text-sm text-orange-700">تنبيه: تسجيل عيب V1 سيقوم بتوليد تقرير PIR أوتوماتيكياً بناءً على قواعد النظام (BR-001).</p>
              </div>
            )}

            <button onClick={submitInspection} className="w-full mt-4 bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">
              إرسال نتيجة الفحص
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
DASH
