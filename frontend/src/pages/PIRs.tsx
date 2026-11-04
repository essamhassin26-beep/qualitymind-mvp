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
