with open('src/app/HomePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update input tag
old_input = 'placeholder="Numéro local" pattern="^[0-9\\\\s\\\\-\\\\.()]{5,20}$" title="Veuillez entrer le numéro local sans le code pays" required />'
new_input = 'placeholder="Numéro local" pattern="^[0-9\\\\s\\\\-\\\\.()]{5,20}$" title="Veuillez mettre un bon numéro de téléphone" required />'
content = content.replace(old_input, new_input)

# I'll also add a generic message to the placeholder directly or just the title.
# "vos dire veuillent mettre un bon numéro de téléphone" implies putting it in the input area.
# Let's replace the placeholder as well, to be very clear to the user before they type.
new_input_full = 'placeholder="Veuillez mettre un bon numéro" pattern="^[0-9\\\\s\\\\-\\\\.()]{5,20}$" title="Veuillez mettre un bon numéro de téléphone" required />'
content = content.replace(new_input, new_input_full)

with open('src/app/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
