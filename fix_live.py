import re
with open('frontend/src/App.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. إضافة استيراد api
if "import { api }" not in code:
    code = code.replace('import React, { useState, useEffect } from "react";', 'import React, { useState, useEffect } from "react";\nimport { api } from "./lib/api";')

# 2. إضافة useEffect للداتا
if "const [liveParts, setLiveParts]" not in code:
    code = code.replace(
        'export default function QualityMindMockup() {',
        '''export default function QualityMindMockup() {
  const [liveParts, setLiveParts] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const loginRes = await api.post('/auth/login', { email: 'admin@nissan.com.eg', password: 'Admin@123' });
        const partsRes = await api.get('/parts', { headers: { Authorization: `Bearer ${loginRes.data.access_token}` } });
        if (partsRes.data && partsRes.data.length > 0) {
          setLiveParts(partsRes.data.map((p: any) => ({
            id: p.id,
            name: p.partName,
            pn: p.partNumber,
            supplier: p.supplier?.name || 'Real Supplier',
            code: 'API',
            model: 'N17',
            important: p.importantPartClass || 'B',
            real: true
          })));
        }
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);
'''
    )

# 3. تعديل المكون عشان يستقبل الداتا
code = code.replace(
    'function InspectionSheetBrowser({ typeFilter, isMobile }) {',
    'function InspectionSheetBrowser({ typeFilter, isMobile, partsList }: any) {'
)

# 4. تعديل سطر الفلترة
code = code.replace(
    'const scoped = typeFilter ? PARTS_LIST.filter((p) => (typeFilter === "CKD" ? p.supplier.includes("CKD") : !p.supplier.includes("CKD"))) : PARTS_LIST;',
    'const sourceList = partsList && partsList.length > 0 ? partsList : PARTS_LIST;\n  const scoped = typeFilter ? sourceList.filter((p: any) => (typeFilter === "CKD" ? p.supplier.includes("CKD") : !p.supplier.includes("CKD"))) : sourceList;'
)

# 5. تمرير الداتا في الاستدعاء
code = code.replace(
    '<InspectionSheetBrowser typeFilter="Local" isMobile={isMobile} />',
    '<InspectionSheetBrowser typeFilter="Local" isMobile={isMobile} partsList={liveParts} />'
)
code = code.replace(
    '<InspectionSheetBrowser typeFilter="CKD" isMobile={isMobile} />',
    '<InspectionSheetBrowser typeFilter="CKD" isMobile={isMobile} partsList={liveParts} />'
)

with open('frontend/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("✅ تم إضافة كود الداتا بأمان!")
