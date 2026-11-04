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
