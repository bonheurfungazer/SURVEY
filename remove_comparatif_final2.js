const fs = require('fs');
const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const startStr = '<div className="mb-4 flex items-center justify-between">';
const endStr = 'bénéficie de <span className="font-bold text-white">100$</span>.\n                    </p>\n                </div>';

const startIndex = content.lastIndexOf(startStr, content.indexOf('Comparatif des prix'));
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const totalEndIndex = endIndex + endStr.length;
    content = content.substring(0, startIndex) + content.substring(totalEndIndex);
    fs.writeFileSync(file, content);
    console.log("Successfully removed the Comparatif section by string index.");
} else {
    console.log("Could not find the section bounds. Start:", startIndex, "End:", endIndex);
}
