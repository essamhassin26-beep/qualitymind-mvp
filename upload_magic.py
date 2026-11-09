import openpyxl
import requests
import glob
import os
import time

FOLDER_PATH = "./excel_files" 
API_URL = "https://qualitymind-mvp.onrender.com/api"

print("جاري تسجيل الدخول...")
login_res = requests.post(f"{API_URL}/auth/login", json={"email": "admin@nissan.com.eg", "password": "Admin@123"})
TOKEN = login_res.json().get("access_token")
headers = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}

if not TOKEN:
    print("فشل الدخول!")
    exit()

excel_files = glob.glob(os.path.join(FOLDER_PATH, "*.xlsx"))
print(f"تم العثور على {len(excel_files)} ملف.")

all_parts = {}

for file_path in excel_files:
    print(f"جاري فحص ملف: {os.path.basename(file_path)}")
    wb = openpyxl.load_workbook(file_path, data_only=True)
    for sheet_name in wb.sheetnames:
        sheet = wb[sheet_name]
        current_part_no = None
        
        for row in sheet.iter_rows(values_only=True):
            # العمود B (رقم 1) والعمود K (رقم 10)
            col_b = str(row[1]).strip() if len(row) > 1 and row[1] is not None else ""
            col_k = str(row[10]).strip() if len(row) > 10 and row[10] is not None else ""
            
            # لو العمود K فيه كلام طويل ومفيهوش مسافات، ده غالباً رقم الجزء
            if col_k and len(col_k) > 5 and " " not in col_k and not col_k.startswith("="):
                current_part_no = col_k
                if current_part_no not in all_parts:
                    all_parts[current_part_no] = {
                        "partName": col_b if col_b else "Unknown Part",
                        "partNumber": current_part_no,
                        "checkPoints": []
                    }
            
            # لو إحنا عارفين رقم الجزء، والعمود B فيه كلام، ده يعتبر نقطة فحص
            elif current_part_no and col_b and col_k:
                # نتجاهل العناوين
                if "No." in col_b or "Item Check" in col_b or "Key Point" in col_k:
                    continue
                all_parts[current_part_no]["checkPoints"].append({
                    "item": col_b,
                    "key": col_k,
                    "severity": "V2"
                })

print(f"\nتم استخراج {len(all_parts)} جزء من الملفات.")

for part_no, data in all_parts.items():
    if len(data["checkPoints"]) > 0:
        res = requests.post(f"{API_URL}/parts", json=data, headers=headers)
        if res.status_code in [201, 200]:
            print(f"✅ تم رفع: {data['partName']} (عدد النقاط: {len(data['checkPoints'])})")
        else:
            print(f"❌ فشل: {data['partName']}")
    else:
        print(f"⚠️ تم تجاهل: {data['partName']} (لا يوجد نقاط فحص)")
    time.sleep(0.1)

print("انتهت العملية!")
