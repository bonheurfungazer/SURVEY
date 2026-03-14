import re

with open('src/app/HomePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remplacer le message des numéros trop longs
content = content.replace(
    'showToast("idiots la méchanceté vous donne quoi", \'error\')',
    'showToast("idiots la méchanceté de donne quoi , comment pense tu que tu sera recontacter?", \'error\')'
)

# Remplacer le message des faux numéros génériques
content = content.replace(
    'showToast("Veuillez renseigner un numéro de téléphone valide pour votre pays.", \'error\')',
    'showToast("idiots la méchanceté de donne quoi , comment pense tu que tu sera recontacter?", \'error\')'
)

with open('src/app/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
