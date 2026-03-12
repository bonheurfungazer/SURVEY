const regex = /const fetchAdminStats = async \(\) => {([\s\S]*?)const fetchSensitiveAdminData/g;
const fs = require('fs');
const content = fs.readFileSync('src/app/page.tsx', 'utf8');
const match = regex.exec(content);
console.log(match ? match[1] : 'not found');
