with open('supabase_schema.sql', 'r', encoding='utf-8') as f:
    content = f.read()

if 'osint_data text' not in content:
    content = content.replace("contact_info text,", "contact_info text,\n    osint_data text,")

with open('supabase_schema.sql', 'w', encoding='utf-8') as f:
    f.write(content)
