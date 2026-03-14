with open('src/app/actions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Revert fetchSensitiveAdminData query
old_query = """      const { data: contactsData, error: contactsErr } = await supabase
        .from('votes')
        .select('id, contact_info, country, model_choice, use_case, created_at, intensity, osint_data')
        .eq('is_real_user', true)"""

new_query = """      const { data: contactsData, error: contactsErr } = await supabase
        .from('votes')
        .select('id, contact_info, country, model_choice, use_case, created_at, intensity')
        .eq('is_real_user', true)"""
content = content.replace(old_query, new_query)

# Revert format mapping
old_format = """        contacts = contactsData.map(c => ({
            id: c.id,
            contact: c.contact_info,
            country: c.country,
            model: c.model_choice,
            useCase: c.use_case,
            date: new Date(c.created_at).toLocaleString('fr-FR'),
            intensity: c.intensity,
            osint_data: c.osint_data
        }))"""
new_format = """        contacts = contactsData.map(c => ({
            id: c.id,
            contact: c.contact_info,
            country: c.country,
            model: c.model_choice,
            useCase: c.use_case,
            date: new Date(c.created_at).toLocaleString('fr-FR'),
            intensity: c.intensity
        }))"""
content = content.replace(old_format, new_format)

with open('src/app/actions.ts', 'w', encoding='utf-8') as f:
    f.write(content)
