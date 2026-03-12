const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const bannerLocation = `                    </div>
                </div>

                <div className="bg-[#111823] border border-white/5 rounded-xl p-5">
                    <div className="flex items-center space-x-2 mb-6 text-white">
                        <i className="fas fa-chart-line text-[#3B82F6] text-xs"></i>
                        <span className="text-xs font-bold tracking-widest uppercase">ANALYSE DES VOTES</span>`;

const newBanner = `                    </div>
                </div>

                {/* API & CLI Integration Banner */}
                <div className="bg-[#111823] border border-[#3B82F6]/30 rounded-xl p-6 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/5 to-[#10B981]/5 opacity-50"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center md:justify-between gap-6">
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-lg font-extrabold text-white mb-2 flex items-center justify-center md:justify-start">
                                <i className="fas fa-terminal text-[#3B82F6] mr-3"></i>
                                Intégration CLI Native & Authentification
                            </h3>
                            <p className="text-[#94A3B8] text-[13px] leading-relaxed max-w-[400px]">
                                Notre API unifiée vous permet de vous authentifier et d'utiliser directement vos assistants de code préférés (<span className="text-white font-semibold">Claude Code</span>, <span className="text-white font-semibold">Gemini CLI</span>, <span className="text-white font-semibold">Codex</span>) dans votre terminal, à -80% du prix officiel.
                            </p>
                        </div>
                        <div className="flex flex-col space-y-3 shrink-0">
                            <div className="flex -space-x-2 justify-center md:justify-end">
                                <div className="w-10 h-10 rounded-full bg-[#1A2332] border border-[#94A3B8]/20 flex items-center justify-center relative z-30 shadow-lg">
                                    <span className="text-[#D97757] font-bold text-xs" style={{fontFamily: 'serif'}}>A|</span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#1A2332] border border-[#94A3B8]/20 flex items-center justify-center relative z-20 shadow-lg">
                                    <i className="fab fa-google text-xs" style={{background: 'conic-gradient(from -45deg, #ea4335 110deg, #4285f4 90deg 180deg, #34a853 180deg 270deg, #fbbc05 270deg) 73% 55%/150% 150% no-repeat', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', WebkitTextFillColor: 'transparent'}}></i>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-[#1A2332] border border-[#94A3B8]/20 flex items-center justify-center relative z-10 shadow-lg">
                                    <i className="fas fa-code text-xs text-white"></i>
                                </div>
                            </div>
                            <div className="bg-[#3B82F6]/10 text-[#3B82F6] text-[10px] font-bold px-3 py-1.5 rounded-full text-center border border-[#3B82F6]/20">
                                Export API Key = OK
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#111823] border border-white/5 rounded-xl p-5">
                    <div className="flex items-center space-x-2 mb-6 text-white">
                        <i className="fas fa-chart-line text-[#3B82F6] text-xs"></i>
                        <span className="text-xs font-bold tracking-widest uppercase">ANALYSE DES VOTES</span>`;

content = content.replace(bannerLocation, newBanner);
fs.writeFileSync('src/app/page.tsx', content);
