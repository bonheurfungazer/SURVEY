const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');
content = content.replace('{authLoading ? <i className="fas fa-spinner fa-spin"></i> : (isSignUp ? "S\'inscrire" : "Se connecter")}', '{isSignUp ? "S\'inscrire" : "Se connecter"}');
fs.writeFileSync('src/app/page.tsx', content);
