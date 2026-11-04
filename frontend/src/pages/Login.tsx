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
