const fs = require('fs');
const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The section starts at `<div className="mb-4 flex items-center justify-between">`
// and ends after the `La facturation sera...` block. We will just use string indexOf to remove it safely.

const startStr = `<div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white leading-tight">Comparatif des prix<br/>API</h2>`;
const endStr = `bénéfice de <strong className="text-white">100$</strong>.
                    </p>
                </div>`;

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const totalEndIndex = endIndex + endStr.length;
    content = content.substring(0, startIndex) + content.substring(totalEndIndex);
    fs.writeFileSync(file, content);
    console.log("Successfully removed the Comparatif section by string index.");
} else {
    console.log("Could not find the section bounds. Start:", startIndex, "End:", endIndex);
}
