with open('src/App.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# هنستبدل الجزء الخاص بعرض النقاط والزرار
old_html = '''            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <Badge tone="ok">{counts.OK || 0} OK</Badge>
                <Badge tone="warn">{counts.CONCESSION || 0} بتجاوز</Badge>
                <Badge tone="crit">{counts.REJECT || 0} مرفوض</Badge>
              </div>
              <button onClick={handleSubmit} className="qm-sans px-6 py-2 rounded-lg font-bold text-sm" style={{ background: C.cyan, color: "#000" }}>
                إرسال نتيجة الفحص
              </button>
            </div>

            <div className="space-y-2.5">'''

new_html = '''            <div className="flex gap-2 mb-4">
              <Badge tone="ok">{counts.OK || 0} OK</Badge>
              <Badge tone="warn">{counts.CONCESSION || 0} بتجاوز</Badge>
              <Badge tone="crit">{counts.REJECT || 0} مرفوض</Badge>
            </div>

            <div className="space-y-2.5 pb-24">'''

if old_html in code:
    code = code.replace(old_html, new_html)
    
    # هنضيف الزرار الثابت قبل ما نقفل الديف الرئيسي
    old_end = '''              {points.map((pt, i) => (
                <DispositionRow key={i} point={pt} value={disp[i]} onChange={(v) => setPointDisp(i, v)} />
              ))}
            </div>
          </div>'''

    new_end = '''              {points.map((pt, i) => (
                <DispositionRow key={i} point={pt} value={disp[i]} onChange={(v) => setPointDisp(i, v)} />
              ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 md:relative md:mt-6 p-4 md:p-0 z-50" style={{ background: isMobile ? C.bg : 'transparent', borderTop: isMobile ? `1px solid ${C.line}` : 'none' }}>
              <button onClick={handleSubmit} className="w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition-transform active:scale-95" style={{ background: C.cyan, color: "#000" }}>
                إرسال نتيجة الفحص
              </button>
            </div>
          </div>'''
    
    code = code.replace(old_end, new_end)
    with open('src/App.tsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("✅ تم تعديل الزرار بنجاح!")
else:
    print("❌ لم يتم العثور على الكود القديم، سنقوم بتحديث الملف بالكامل.")
