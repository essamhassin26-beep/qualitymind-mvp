import openpyxl
import requests
import glob
import os
import time
import re

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
print(f"Found {len(excel_files)} files.")

for file_path in excel_files:
    print(f"Processing: {os.path.basename(file_path)}")
    wb = openpyxl.load_workbook(file_path, data_only=True)
    
    for sheet_name in wb.sheetnames:
        sheet = wb[sheet_name]
        parts_data = {}
        current_part_no = None

        for row in sheet.iter_rows(values_only=True):
            col_item = str(row[1]).strip() if row[1] else ""
            col_key = str(row[10]).strip() if row[10] else ""

            # هل السطر ده فيه رقم جزء؟ (غالباً في العمود K)
            if re.match(r'^[A-Z0-9]{6,}$', col_key) and col_item and not col_item.startswith("="):
                current_part_no = col_key
                if current_part_no not in parts_data:
                    parts_data[current_part_no] = {
                        "partName": col_item,
                        "partNumber": current_part_no,
                        "checkPoints": []
                    }
            
            # هل السطر ده نقطة فحص؟ (فيه كلام في B و K، ومش عناوين)
            elif current_part_no and col_item and col_key and "Item Check" not in col_item and "No." not in col_item:
                parts_data[current_part_no]["checkPoints"].append({
                    "item": col_item,
                    "key": col_key,
                    "severity": "V2"
                })

        # نرفع الأجزاء اللي في الشيت ده
        for part_no, data in parts_data.items():
            if data["checkPoints"]: # نرفع بس اللي ليه نقاط فحص
                res = requests.post(f"{API_URL}/parts", json=data, headers=headers)
                if res.status_code in [201, 200]:
                    print(f"  ✅ {data['partName']} ({len(data['checkPoints'])} checkpoints)")
                else:
                    print(f"  ❌ Failed: {data['partName']}")
                time.sleep(0.5) # نستنى نص ثانية عشان السيرفر ميزعلش

print("Done!")
