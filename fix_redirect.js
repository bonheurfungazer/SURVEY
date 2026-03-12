const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const oldSignUp = `emailRedirectTo: \`\${window.location.origin}/auth/callback\`,`;
// Sometimes query params are better to ensure it gets picked up
const newSignUp = `emailRedirectTo: \`\${window.location.origin}/auth/callback\`,`;

// Actually, wait, the user's issue might be that we haven't set up the callback route appropriately to handle Next.js client-side redirects?
// But it is server side!

content = content.replace(oldSignUp, newSignUp);
fs.writeFileSync('src/app/page.tsx', content);
