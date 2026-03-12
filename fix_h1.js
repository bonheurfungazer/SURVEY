const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const oldHero = `<h1 className="text-[28px] font-extrabold leading-tight mb-8 relative z-10 tracking-tight text-white">
                        Accélérez votre<br/>terminal avec<br/>
                        <span className="text-[#3B82F6]">Claude Code,</span><br/>Gemini CLI & Codex<br/>
                        <span className="text-blue-gradient">via API</span> à <span className="text-blue-gradient">-80%</span><br/>du prix officiel
                    </h1>`;

const newHero = `<h1 className="text-3xl font-extrabold leading-tight mb-8 relative z-10 tracking-tight">
                        Accédez aux<br/>derniers<br/>modèles<br/>Claude, Gemini<br/>et ChatGPT <span className="text-blue-gradient">via</span><br/>
                        <span className="text-blue-gradient">API</span> à <span className="text-blue-gradient">-80%</span> du<br/>prix officiel
                    </h1>`;

const oldVoteHeader = `<div className="text-center mb-8">
                    <h1 className="text-[28px] font-extrabold text-white mb-3 tracking-tight leading-tight">L'API Unifiée pour <span className="text-[#3B82F6]">Claude Code</span>, Gemini & Codex</h1>
                    <p className="text-sm text-[#94A3B8] leading-relaxed max-w-[320px] mx-auto">
                        Connectez directement vos outils CLI préférés (Claude Code, Gemini CLI, Codex) à notre API unifiée et développez à <strong>-80% du prix officiel</strong>.
                        <br/><span className="mt-2 block text-[#10B981]">Exportez simplement la clé API et codez !</span>
                    </p>
                </div>`;

const newVoteHeader = `<div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Votez le prochain LLM</h1>
                    <p className="text-sm text-[#94A3B8] leading-relaxed max-w-[280px] mx-auto">
                        Aidez-nous à choisir le prochain modèle à intégrer à notre API unifiée à -80%.
                    </p>
                </div>`;

content = content.replace(oldHero, newHero).replace(oldVoteHeader, newVoteHeader);
fs.writeFileSync('src/app/page.tsx', content);
