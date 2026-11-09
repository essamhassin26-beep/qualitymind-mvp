import re
with open('frontend/src/App.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. نمسح الزرار المكسور
code = re.sub(r'<button onClick=\{testConnection\}.*?</button>', '', code, flags=re.DOTALL)
code = re.sub(r'const testConnection = async \(\) => \{.*?\};', '', code, flags=re.DOTALL)
code = re.sub(r'const \[isTesting, setIsTesting\] = useState\(false\);', '', code)
code = code.replace('    </>\n  );\n}', '  );\n}').replace('return (\n    <>\n    <div', 'return (\n    <div')

# 2. نضيف كود جلب الداتا
if "const [liveParts, setLiveParts]" not in code:
    code = code.replace(
        'export default function QualityMindMockup() {',
        '''export default function QualityMindMockup() {
  const [liveParts, setLiveParts] = useState<any[]>([]);
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
          setLiveParts(partsData.map((p: any) => ({
            id: p.id, name: p.partName, pn: p.partNumber,
            supplier: p.supplier?.name || 'Real Supplier', code: 'API', model: 'N17', important: p.importantPartClass || 'B', real: true
          })));
        }
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);
'''
    )

# 3. نربط الداتا بالمكونات
code = re.sub(r'function InspectionSheetBrowser\(\{ typeFilter, isMobile \}\)', 'function InspectionSheetBrowser({ typeFilter, isMobile, partsList }: any)', code)
code = re.sub(r'const scoped = typeFilter \? PARTS_LIST\.filter.*?: PARTS_LIST;', 
             'const sourceList = partsList && partsList.length > 0 ? partsList : PARTS_LIST;\n  const scoped = typeFilter ? sourceList.filter((p: any) => (typeFilter === "CKD" ? p.supplier.includes("CKD") : !p.supplier.includes("CKD"))) : sourceList;', 
             code, flags=re.DOTALL)
code = re.sub(r'<InspectionSheetBrowser typeFilter="Local" isMobile=\{isMobile\} />', '<InspectionSheetBrowser typeFilter="Local" isMobile={isMobile} partsList={liveParts} />', code)
code = re.sub(r'<InspectionSheetBrowser typeFilter="CKD" isMobile=\{isMobile\} />', '<InspectionSheetBrowser typeFilter="CKD" isMobile={isMobile} partsList={liveParts} />', code)

with open('frontend/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("✅ تم استرجاع التصميم الأسود وربط الداتا بنجاح!")
