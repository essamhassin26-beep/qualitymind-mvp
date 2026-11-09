import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. مسح دالة الاختبار
code = re.sub(r'  const testConnection = async \(\) => \{.*?\n  \};\n', '', code, flags=re.DOTALL)
code = re.sub(r'  const \[isTesting, setIsTesting\] = useState\(false\);\n', '', code)

# 2. مسح الزرار اللي مبوظ الدنيا
code = re.sub(r'    <button onClick=\{testConnection\}.*?</button>\n', '', code, flags=re.DOTALL)

# 3. إصلاح أقواس الـ React Fragment اللي اتلخبطت
code = code.replace('    </>\n  );', '  );')
code = code.replace('return (\n    <>\n    <div', 'return (\n    <div')

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
print("✅ تم إصلاح الكود ومسح الزرار المكسور بنجاح!")
