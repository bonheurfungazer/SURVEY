const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');
console.log(content.indexOf('Aider') !== -1 ? 'Found Aider' : 'Not found');
