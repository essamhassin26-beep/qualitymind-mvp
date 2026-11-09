import openpyxl
import requests
import glob
import os
import time

FOLDER_PATH = "./excel_files" 
API_URL = "https://qualitymind-mvp.onrender.com/api"

login_res = requests.post(f"{API_URL}/auth/login", json={"email": "admin@nissan.com.eg", "password": "Admin@123"})
TOKEN = login_res.json().get("access_token")
headers = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}

if not TOKEN:
    print("Login failed!")
    exit()

excel_files = glob.glob(os.path.join(FOLDER_PATH, "*.xlsx"))
print(f"Found {len(excel_files)} files.")

for file_path in excel_files:
    print(f"Processing: {os.path.basename(file_path)}")
    wb = openpyxl.load_workbook(file_path, data_only=True)
    
    for sheet_name in wb.sheetnames:
        sheet = wb[sheet_name]
        
        for row in sheet.iter_rows(values_only=True):
            if row[1] and isinstance(row[1], str) and row[10] and isinstance(row[10], str):
                part_name = str(row[1]).strip()
                part_no = str(row[10]).strip()
                
                if any(x in part_name for x in ["ASSY", "GLASS", "CUSH", "FIN", "HARN", "SEAT", "BATTERY", "SPEAKER"]):
                    payload = {
                        "partName": part_name,
                        "partNumber": part_no,
                        "checkPoints": [{"item": "فحص عام", "key": "مطابقة العينة", "severity": "V2"}]
                    }
                    
                    # بنبعت قطعة واحدة بس في كل طلب
                    res = requests.post(f"{API_URL}/parts", json=payload, headers=headers)
                    
                    if res.status_code in [201, 200]:
                        print(f"  ✅ Uploaded: {part_no}")
                    else:
                        print(f"  ❌ Failed: {part_no} - {res.text}")
                    
                    time.sleep(1) # نستنى ثانية عشان السيرفر يرتاح

print("Done!")
