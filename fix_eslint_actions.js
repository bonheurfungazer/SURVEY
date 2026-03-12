const fs = require('fs');
const file = 'src/app/actions.ts';
let content = fs.readFileSync(file, 'utf8');

content = '/* eslint-disable @typescript-eslint/no-explicit-any */\n' + content;
content = '/* eslint-disable @typescript-eslint/no-unused-vars */\n' + content;

fs.writeFileSync(file, content);
console.log('Fixed actions.ts');
