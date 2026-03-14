with open('src/app/HomePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Revert headers
old_headers = 'const headers = ["Date", "Pays", "Modèle Choisi", "Cas d\'usage", "Intensité", "Numéro WhatsApp", "Données OSINT (JSON)"];'
new_headers = 'const headers = ["Date", "Pays", "Modèle Choisi", "Cas d\'usage", "Intensité", "Numéro WhatsApp"];'
content = content.replace(old_headers, new_headers)

# Revert row formatting
old_row = """        escapeCSV(c.intensity !== undefined ? c.intensity : 'N/A'),
        escapeCSV(c.contact || 'Non renseigné'),
        escapeCSV(c.osint_data ? JSON.stringify(c.osint_data) : '')
    ]);"""
new_row = """        escapeCSV(c.intensity !== undefined ? c.intensity : 'N/A'),
        escapeCSV(c.contact || 'Non renseigné')
    ]);"""
content = content.replace(old_row, new_row)

# Revert type
old_type = 'contacts: [] as Array<{ id: string; contact: string; country: string; model: string; useCase: string; date: string; intensity: number; osint_data?: string }>,'
new_type = 'contacts: [] as Array<{ id: string; contact: string; country: string; model: string; useCase: string; date: string; intensity: number }>,'
content = content.replace(old_type, new_type)

with open('src/app/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
