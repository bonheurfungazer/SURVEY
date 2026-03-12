const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// The bottom tab navigation handles clicking "admin"
const searchTabClick = `<button onClick={() => setCurrentTab('admin')} className={\`p-2 transition-all duration-200 hover:text-white hover:scale-110 \${currentTab === 'admin' ? 'text-[#3B82F6]' : 'text-[#94A3B8]'}\`}>
              <i className="fas fa-chart-line text-lg"></i>
          </button>`;

const replaceTabClick = `<button onClick={() => { if (!user) { setShowLoginModal(true); showToast("Veuillez vous connecter pour accéder à l'administration.", "error"); } else { setCurrentTab('admin'); } }} className={\`p-2 transition-all duration-200 hover:text-white hover:scale-110 \${currentTab === 'admin' ? 'text-[#3B82F6]' : 'text-[#94A3B8]'}\`}>
              <i className="fas fa-chart-line text-lg"></i>
          </button>`;

code = code.replace(searchTabClick, replaceTabClick);
fs.writeFileSync('src/app/page.tsx', code);
