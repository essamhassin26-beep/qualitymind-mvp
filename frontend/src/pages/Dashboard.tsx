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
