const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const oldBlock = `
      // Auto-detect country
      try {
          const res = await fetch('https://ipwho.is/');
          const data = await res.json();
          if (data && data.country && data.country_code) {
              setVoteForm(prev => ({
                  ...prev,
                  country: data.country,
                  countryCode: data.country_code,
                  contact: countryDialCodes[data.country_code] || ''
              }));
          }
      } catch (e) {
`;

const newBlock = `
      // Auto-detect country
      try {
          const res = await fetch('https://ipapi.co/json/');
          const data = await res.json();
          if (data && data.country_name && data.country) {
              setVoteForm(prev => ({
                  ...prev,
                  country: data.country_name,
                  countryCode: data.country,
                  contact: countryDialCodes[data.country] || ''
              }));
          }
      } catch (e) {
`;

if (content.includes(oldBlock)) {
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync('src/app/page.tsx', content);
    console.log("Replaced block.");
} else {
    console.log("Block not found.");
}
