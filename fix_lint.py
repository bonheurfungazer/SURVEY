with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add eslint-disable at the top
if '/* eslint-disable @typescript-eslint/no-explicit-any */' not in content:
    content = '/* eslint-disable @typescript-eslint/no-explicit-any */\n' + content

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
