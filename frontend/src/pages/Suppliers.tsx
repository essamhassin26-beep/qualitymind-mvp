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
