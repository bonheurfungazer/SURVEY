const fs = require('fs');
const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
    /<\!-- Comparatif Section -->[\s\S]*?<\!-- End Comparatif Section -->/g,
    ''
);

// Fallback if comments are missing
if (content.includes('Comparatif des prix<br/>API')) {
    content = content.replace(
        /<div className="mb-4 flex items-center justify-between">[\s\S]*?La facturation sera de tel sorte que pour <strong className="text-white">1 500 XAF<\/strong> on bénéficie de <strong className="text-white">10\$<\/strong> d'API pour n'importe quel modèle et pour <strong className="text-white">14 000 XAF<\/strong> on bénéficie de <strong className="text-white">100\$<\/strong>\.[\s\S]*?<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>/g,
        ''
    );
}

fs.writeFileSync(file, content);
console.log("Removed comparatif section");
