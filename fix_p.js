const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const oldP = `<p className="text-sm text-[#94A3B8] leading-relaxed max-w-[280px] mx-auto">
                        Aidez-nous à choisir le prochain modèle à intégrer à notre API unifiée à -80%.
                    </p>`;

// We will change "Aidez-nous" to something else per previous rule, but keep the core message.
// And we add a small badge about CLI tools.
const newP = `<p className="text-sm text-[#94A3B8] leading-relaxed max-w-[280px] mx-auto mb-4">
                        Participez au choix du prochain modèle à intégrer à notre API unifiée à -80%.
                    </p>
                    <div className="inline-flex items-center justify-center space-x-2 bg-[#1A2332] border border-[#3B82F6]/30 px-4 py-2 rounded-full text-xs font-semibold text-[#E2E8F0] shadow-sm">
                        <i className="fas fa-terminal text-[#3B82F6]"></i>
                        <span>Compatible avec Claude Code, Gemini CLI & Codex</span>
                    </div>`;

content = content.replace(oldP, newP);
fs.writeFileSync('src/app/page.tsx', content);
