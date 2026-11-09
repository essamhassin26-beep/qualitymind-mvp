import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. نرجع القائمة كاملة (9 أقسام)
new_sections = '''  const SECTIONS = [
    { id: "local", n: 1, label: "فحص أجزاء اللوكال", icon: ClipboardList },
    { id: "ckd", n: 2, label: "فحص أجزاء CKD", icon: PackageCheck },
    { id: "line", n: 3, label: "مشاكل خط الإنتاج", icon: AlertTriangle },
    { id: "supplier-insp", n: 4, label: "فحص الموردين", icon: Factory },
    { id: "dphu", n: 5, label: "DPHU", icon: Gauge },
    { id: "ppm", n: 6, label: "PPM", icon: TrendingDown },
    { id: "faults", n: 7, label: "أعطال الإنتاج", icon: Wrench },
    { id: "audit", n: 8, label: "أودت سبلاير", icon: ShieldAlert },
    { id: "kaizen5s", n: 9, label: "الكايزن و5S", icon: Sparkles },
  ];'''

# بنستبدل القائمة القديمة اللي فيها قسمين بس
code = re.sub(r'const SECTIONS = \[.*?\];', new_sections, code, flags=re.DOTALL)

# 2. نعدل دالة عرض المحتوى عشان الأقسام التانية تظهر بشكل لائق (قيد التطوير)
old_render = '''  const renderContent = () => {
    switch (section) {
      case "local": return <InspectionSheetBrowser typeFilter="Local" isMobile={isMobile} partsList={liveParts} />;
      case "ckd": return <InspectionSheetBrowser typeFilter="CKD" isMobile={isMobile} partsList={liveParts} />;
      default: return null;
    }
  };'''

new_render = '''  const renderContent = () => {
    switch (section) {
      case "local": return <InspectionSheetBrowser typeFilter="Local" isMobile={isMobile} partsList={liveParts} />;
      case "ckd": return <InspectionSheetBrowser typeFilter="CKD" isMobile={isMobile} partsList={liveParts} />;
      default: return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center qm-fade" dir="rtl">
          <Construction size={48} color={C.gold} className="mb-4" />
          <h2 className="qm-sans font-bold text-2xl mb-2" style={{ color: C.text }}>قيد التطوير</h2>
          <p className="qm-sans text-sm" style={{ color: C.textDim }}>هذا القسم سيتم ربطه بالبيانات الحقيقية في التحديث القادم.</p>
        </div>
      );
    }
  };'''

# بنستبدل الدالة القديمة
code = re.sub(r'const renderContent = \(\) => \{.*?\n  \};', new_render, code, flags=re.DOTALL)

# نتأكد إن أيقونة Construction موجودة في الاستيراد
if "Construction" not in code:
    code = code.replace('Sparkles,', 'Sparkles, Construction,')
    code = code.replace('Sparkles }', 'Sparkles, Construction }')

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("✅ تم استرجاع القائمة الجانبية كاملة بنجاح!")
