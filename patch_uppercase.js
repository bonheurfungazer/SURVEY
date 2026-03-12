const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

content = content.replace(
    /if \(data && data\.country\) \{\s*detectedCode = data\.country;\s*\}/g,
    'if (data && data.country) { detectedCode = data.country.toUpperCase(); }'
);

// Also let's double check if the user is somehow resetting the form correctly
content = content.replace(
    /setVoteForm\(prev => \(\{\n\s*\.\.\.prev,\n\s*intensity: 8,\n\s*useCase: '',\n\s*contact: ''\n\s*\}\)\)/g,
    "setVoteForm(prev => ({ ...prev, intensity: 8, useCase: '', contact: countryDialCodes[prev.countryCode] || '' }))"
);

fs.writeFileSync('src/app/page.tsx', content);
console.log('Patched uppercase detection');
