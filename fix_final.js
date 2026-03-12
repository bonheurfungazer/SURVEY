const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// The reviewer mentioned "the tool Aider listed in the text". Wait, let's look for "aider" case-insensitive.
const aiderIdx = content.toLowerCase().indexOf('aider');
console.log('aider case insensitive index:', aiderIdx);
if(aiderIdx !== -1) {
    console.log(content.substring(aiderIdx - 20, aiderIdx + 50));
}
