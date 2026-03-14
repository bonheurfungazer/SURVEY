with open('src/app/HomePage.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'showToast("idiots la méchanceté te donne quoi , comment pense tu que tu sera recontacter?", \'error\')',
    'showToast("idiots la méchanceté te donne quoi comment pense tu que tu sera recontacter?", \'error\')'
)

with open('src/app/HomePage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
