import re
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. تعديل تعريف المكون
code = re.sub(r'function InspectionSheetBrowser\(\{ typeFilter, isMobile \}\)', 'function InspectionSheetBrowser({ typeFilter, isMobile, partsList })', code)

# 2. تعديل سطر الفلترة
code = re.sub(r'const scoped = typeFilter \? PARTS_LIST\.filter.*?: PARTS_LIST;', 
             'const sourceList = partsList && partsList.length > 0 ? partsList : PARTS_LIST;\n  const scoped = typeFilter ? sourceList.filter((p) => (typeFilter === "CKD" ? p.supplier.includes("CKD") : !p.supplier.includes("CKD"))) : sourceList;', 
             code, flags=re.DOTALL)

# 3. تمرير الداتا للمكون
code = code.replace('<InspectionSheetBrowser typeFilter="Local" isMobile={isMobile} />', '<InspectionSheetBrowser typeFilter="Local" isMobile={isMobile} partsList={liveParts} />')
code = code.replace('<InspectionSheetBrowser typeFilter="CKD" isMobile={isMobile} />', '<InspectionSheetBrowser typeFilter="CKD" isMobile={isMobile} partsList={liveParts} />')

# 4. إضافة كود جلب البيانات
if "const [liveParts, setLiveParts]" not in code:
    code = code.replace(
        'export default function QualityMindMockup() {',
        '''export default function QualityMindMockup() {
  const [liveParts, setLiveParts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const loginRes = await fetch('https://qualitymind-mvp.onrender.com/api/auth/login', {
          method: 'POST', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email: 'admin@nissan.com.eg', password: 'Admin@123'})
        });
        const loginData = await loginRes.json();
        const partsRes = await fetch('https://qualitymind-mvp.onrender.com/api/parts', {
          headers: { 'Authorization': 'Bearer ' + loginData.access_token }
        });
        const partsData = await partsRes.json();
        if (Array.isArray(partsData) && partsData.length > 0) {
          const mapped = partsData.map((p) => ({
            id: p.id,
            name: p.partName,
            pn: p.partNumber,
            supplier: p.supplier?.name || 'Real Supplier',
            code: 'API',
            model: 'N17',
            important: p.importantPartClass || 'B',
            real: true
          }));
          setLiveParts(mapped);
        }
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);
'''
    )

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("✅ Done")
