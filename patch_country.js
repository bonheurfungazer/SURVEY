const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// The dropdown currently uses `value={voteForm.country}` and `option value="..."`. The name is localized.
// To fix the issue, the easiest way is to use `countryCode` as the `<select value={voteForm.countryCode}>`
// and `<option value={code} data-code={code}>...`. However, we must change all the options.
// Let's replace the options to have `value` be the `code`, and the `handleCountryChange` logic.

// Alternatively, when the fetch succeeds, we can find the matching option based on `data-code` using a small script snippet, or an object map.

// Let's look at `countryDialCodes`
const regex = /<option data-code="([A-Z]{2})" value="([^"]+)">/g;
let match;
let countryCodeToName = {};

while ((match = regex.exec(content)) !== null) {
  countryCodeToName[match[1]] = match[2];
}

console.log('Total countries:', Object.keys(countryCodeToName).length);
console.log('FR:', countryCodeToName['FR']);
console.log('US:', countryCodeToName['US']);

fs.writeFileSync('countryCodeToName.json', JSON.stringify(countryCodeToName, null, 2));
