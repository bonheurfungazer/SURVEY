const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const oldFetch = `      // Auto-detect country
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
          }`;

const newFetch = `      // Auto-detect country
      try {
          let detectedCode = '';

          try {
              // Primary reliable detection via GeoJS
              const res = await fetch('https://get.geojs.io/v1/ip/country.json');
              const data = await res.json();
              if (data && data.country) {
                  detectedCode = data.country;
              } else {
                  throw new Error('geojs failed');
              }
          } catch (e) {
              try {
                  // Fallback 1 to ipapi.co
                  const res = await fetch('https://ipapi.co/json/');
                  const data = await res.json();
                  if (data && data.country) {
                      detectedCode = data.country;
                  } else {
                      throw new Error('ipapi.co failed');
                  }
              } catch (e2) {
                  // Fallback 2 to ipinfo.io
                  const res = await fetch('https://ipinfo.io/json');
                  const data = await res.json();
                  if (data && data.country) {
                      detectedCode = data.country;
                  }
              }
          }`;

if (content.includes(oldFetch)) {
    content = content.replace(oldFetch, newFetch);
    fs.writeFileSync('src/app/page.tsx', content);
    console.log("Patched fetch block successfully.");
} else {
    console.log("Could not find the fetch block to replace.");
}
