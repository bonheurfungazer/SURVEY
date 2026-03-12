const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

const searchGreenBox = `<div className="inline-flex items-center justify-center space-x-2 bg-[#1A2332] border border-[#3B82F6]/30 px-4 py-2 rounded-full text-xs font-semibold text-[#E2E8F0] shadow-sm">
                        <i className="fas fa-terminal text-[#3B82F6]"></i>
                        <span>Compatible avec Claude Code, Gemini CLI & Codex</span>
                    </div>`;

const replaceGreenBox = `<div className="inline-flex flex-col items-center justify-center space-y-2 bg-[#1A2332] border-2 border-[#10B981]/50 px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] w-full max-w-[320px] mx-auto transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center space-x-2 text-[#10B981]">
                            <i className="fas fa-terminal text-2xl"></i>
                            <span className="font-bold text-lg tracking-wider">COMPATIBILITÉ CLI</span>
                        </div>
                        <span className="text-sm font-semibold text-center text-white">Utilisez l'API Unifiée avec :</span>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                            <span className="bg-[#10B981]/20 text-[#10B981] px-3 py-1 rounded-md text-sm font-bold border border-[#10B981]/30">Claude Code</span>
                            <span className="bg-[#3B82F6]/20 text-[#3B82F6] px-3 py-1 rounded-md text-sm font-bold border border-[#3B82F6]/30">Gemini CLI</span>
                            <span className="bg-[#A855F7]/20 text-[#A855F7] px-3 py-1 rounded-md text-sm font-bold border border-[#A855F7]/30">Codex</span>
                        </div>
                    </div>`;

code = code.replace(searchGreenBox, replaceGreenBox);
fs.writeFileSync('src/app/page.tsx', code);
