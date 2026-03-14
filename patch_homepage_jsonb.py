import re

with open('src/app/HomePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Since OSINT data is stored as a stringified JSON but column is JSONB, we should actually pass it as an object
# Or if it's already working, we can leave it as JSON string but Supabase will parse it or fail?
# Wait, insert_new had `osint_data: osintData`. Since it's stringified JSON, postgres will auto cast if it's valid JSON.
# But it's better to pass the object directly.

content = content.replace("let osintData = '';", "let osintData: any = null;")
content = content.replace("osintData = JSON.stringify({", "osintData = {")
content = content.replace("phoneNumber.number.replace('+', '')}`\n            });", "phoneNumber.number.replace('+', '')}`\n            };")

with open('src/app/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed OSINT data object format")
