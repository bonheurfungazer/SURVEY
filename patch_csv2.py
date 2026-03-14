with open('src/app/HomePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure we stringify the object when exporting to CSV
old_row = """        escapeCSV(c.intensity !== undefined ? c.intensity : 'N/A'),
        escapeCSV(c.contact || 'Non renseigné'),
        escapeCSV(c.osint_data || '')
    ]);"""
new_row = """        escapeCSV(c.intensity !== undefined ? c.intensity : 'N/A'),
        escapeCSV(c.contact || 'Non renseigné'),
        escapeCSV(c.osint_data ? JSON.stringify(c.osint_data) : '')
    ]);"""
content = content.replace(old_row, new_row)

with open('src/app/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
