const fs = require('fs');

const pageFile = 'src/app/page.tsx';
let pageContent = fs.readFileSync(pageFile, 'utf8');

// Fix unescaped entities
pageContent = pageContent.replace(/L'API/g, "L&apos;API");
pageContent = pageContent.replace(/d'API/g, "d&apos;API");
pageContent = pageContent.replace(/n'importe/g, "n&apos;importe");
pageContent = pageContent.replace(/Jusqu'à/g, "Jusqu&apos;à");
pageContent = pageContent.replace(/d'utilisation/g, "d&apos;utilisation");
pageContent = pageContent.replace(/aujourd'hui/g, "aujourd&apos;hui");
pageContent = pageContent.replace(/l'instant/g, "l&apos;instant");
pageContent = pageContent.replace(/s'agissait/g, "s&apos;agissait");
pageContent = pageContent.replace(/d'erreurs/g, "d&apos;erreurs");
pageContent = pageContent.replace(/n'a/g, "n&apos;a");
pageContent = pageContent.replace(/qu'une/g, "qu&apos;une");

fs.writeFileSync(pageFile, pageContent);
console.log("Fixed unescaped entities in page.tsx");
