import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. مسح الزرار المكسور
code = re.sub(r'<button onClick=\{testConnection\}.*?</button>', '', code, flags=re.DOTALL)

# 2. مسح الدالة اللي بتشغل الزرار
code = re.sub(r'const testConnection = async \(\) => \{.*?\};', '', code, flags=re.DOTALL)

# 3. مسح المتغير بتاع حالة الزرار
code = re.sub(r'const \[isTesting, setIsTesting\] = useState\(false\);', '', code)

# 4. تنظيف أي أقواس زيادة
code = code.replace('    </>\n  );\n}', '  );\n}')
code = code.replace('return (\n    <>\n    <div', 'return (\n    <div')

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("✅ تم مسح الزرار المكسور وتنظيف الكود!")
