const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const regexOptions = /<option data-code="([A-Z]{2})" value="([^"]+)">/g;
let match;
let countryCodeToNameStr = "{\n";

while ((match = regexOptions.exec(content)) !== null) {
  countryCodeToNameStr += `    "${match[1]}": "${match[2]}",\n`;
}
countryCodeToNameStr += "  }";

const oldInit = `    const init = async () => {
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
          console.error("Failed to detect country", e);
      }`;

const newInit = `    const init = async () => {
      // Mapping from country code to localized name for dropdown
      const codeToName: Record<string, string> = ${countryCodeToNameStr};

      // Auto-detect country
      try {
          let detectedCode = '';

          try {
              const res = await fetch('https://ipapi.co/json/');
              const data = await res.json();
              if (data && data.country) {
                  detectedCode = data.country;
              } else if (data && data.error) {
                  throw new Error('ipapi.co rate limit or error');
              }
          } catch (e) {
              // Fallback to ipinfo.io
              const res = await fetch('https://ipinfo.io/json');
              const data = await res.json();
              if (data && data.country) {
                  detectedCode = data.country;
              }
          }

          if (detectedCode) {
              const localizedName = codeToName[detectedCode] || 'États-Unis'; // default if not found
              setVoteForm(prev => ({
                  ...prev,
                  country: localizedName,
                  countryCode: detectedCode,
                  contact: countryDialCodes[detectedCode] || ''
              }));
          }
      } catch (e) {
          console.error("Failed to detect country", e);
      }`;

content = content.replace(oldInit, newInit);

fs.writeFileSync('src/app/page.tsx', content);
console.log('Patched src/app/page.tsx');
