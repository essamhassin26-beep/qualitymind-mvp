with open('frontend/src/App.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. هنضيف متغير عشان نحفظ فيه رسالة النتيجة
if "const [debugMsg, setDebugMsg]" not in code:
    code = code.replace(
        'export default function QualityMindMockup() {',
        '''export default function QualityMindMockup() {
  const [debugMsg, setDebugMsg] = useState("جاري الاتصال بالسيرفر...");
'''
    )

# 2. هنعدل دالة جلب البيانات عشان تحفظ الرد أو الخطأ
code = code.replace(
    'const partsData = await partsRes.json();',
    '''const partsData = await partsRes.json();
        setDebugMsg("رد السيرفر: " + JSON.stringify(partsData));'''
)
code = code.replace(
    '} catch (e) { console.error(e); }',
    '''} catch (e: any) { 
        setDebugMsg("خطأ في الاتصال: " + e.message); 
      }'''
)

# 3. هنعرض الرسالة دي فوق خالص في الواجهة (شريط أحمر)
if "debugMsg" in code and "style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, background: 'red', color: 'white', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}" not in code:
    # بنحط الشريط جوه المكون الرئيسي قبل الـ return
    code = code.replace(
        'return (',
        '''if (debugMsg !== "تم") return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999, background: '#E5484D', color: 'white', padding: '20px', textAlign: 'center', fontWeight: 'bold', fontFamily: 'monospace', direction: 'ltr' }}>
      {debugMsg}
    </div>
  );

  return (''', 1
  )

with open('frontend/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("✅ تم تجهيز شاشة التشخيص!")
