with open('src/app/HomePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update exportContactsCSV headers
old_headers = 'const headers = ["Date", "Pays", "Modèle Choisi", "Cas d\'usage", "Intensité", "Numéro WhatsApp"];'
new_headers = 'const headers = ["Date", "Pays", "Modèle Choisi", "Cas d\'usage", "Intensité", "Numéro WhatsApp", "Données OSINT (JSON)"];'
content = content.replace(old_headers, new_headers)

# Update row formatting
old_row = """        escapeCSV(c.intensity !== undefined ? c.intensity : 'N/A'),
        escapeCSV(c.contact || 'Non renseigné')
    ]);"""
new_row = """        escapeCSV(c.intensity !== undefined ? c.intensity : 'N/A'),
        escapeCSV(c.contact || 'Non renseigné'),
        escapeCSV(c.osint_data || '')
    ]);"""
content = content.replace(old_row, new_row)

# Update adminStats state type
old_type = 'contacts: [] as Array<{ id: string; contact: string; country: string; model: string; useCase: string; date: string; intensity: number }>,'
new_type = 'contacts: [] as Array<{ id: string; contact: string; country: string; model: string; useCase: string; date: string; intensity: number; osint_data?: string }>,'
content = content.replace(old_type, new_type)

with open('src/app/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
