const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Replace `<select value={voteForm.country}` with `<select value={voteForm.countryCode}`
content = content.replace(
  /<select value={voteForm\.country} onChange={handleCountryChange}/g,
  '<select value={voteForm.countryCode} onChange={handleCountryChange}'
);

// We need to modify `handleCountryChange`
const oldHandle = `  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.options[e.target.selectedIndex].dataset.code || ''
    const dialCode = countryDialCodes[code] || '';
    setVoteForm(prev => ({ ...prev, country: e.target.value, countryCode: code, contact: dialCode }))
  }`;

const newHandle = `  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const name = e.target.options[e.target.selectedIndex].dataset.name || '';
    const dialCode = countryDialCodes[code] || '';
    setVoteForm(prev => ({ ...prev, country: name, countryCode: code, contact: dialCode }))
  }`;

content = content.replace(oldHandle, newHandle);

// We need to rewrite all `<option data-code="XX" value="Name">` to `<option value="XX" data-name="Name">`
content = content.replace(/<option data-code="([A-Z]{2})" value="([^"]+)">/g, '<option value="$1" data-name="$2">');

fs.writeFileSync('src/app/page.tsx', content);
console.log('Patched select dropdown');
