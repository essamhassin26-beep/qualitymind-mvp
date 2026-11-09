with open('frontend/src/App.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# هنحط Alert يظهر لنا رد السيرفر بالظبط
if "alert('API Response: '" not in code:
    code = code.replace(
        "const partsData = await partsRes.json();", 
        "const partsData = await partsRes.json();\n        alert('رد السيرفر: ' + JSON.stringify(partsData));"
    )

with open('frontend/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("✅ تم إضافة التنبيه!")
