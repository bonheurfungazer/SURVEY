const fs = require('fs');
const content = fs.readFileSync('src/app/HomePage.tsx', 'utf8');
console.log(content.includes('setShowVerificationPopup(true)'));
console.log(content.includes('emailRedirectTo: "https://survey-gray-eta.vercel.app/auth/confirm"'));
