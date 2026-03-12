const fs = require('fs');
const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldSelect = `<select value={voteForm.model} onChange={(e) => setVoteForm({...voteForm, model: e.target.value})} className="w-full bg-[#1A2332] border border-white/5 rounded-xl px-4 py-3.5 text-sm font-semibold text-white appearance-none focus:outline-none focus:border-[#3B82F6]/50">
                                    <option value="" disabled hidden>Veuillez sélectionner un modèle</option>
                                    <option value="Claude Opus 4.6 (et antérieures)">Claude Opus 4.6 (et versions 2026 en descendant)</option>
                                    <option value="GPT-5.4 Thinking (et antérieures)">GPT-5.4 Thinking (et versions 2026 en descendant)</option>
                                    <option value="Gemini 3.1 Pro (et antérieures)">Gemini 3.1 Pro (et versions 2026 en descendant)</option>
                                </select>`;

const newSelect = `<select value={voteForm.model} onChange={(e) => setVoteForm({...voteForm, model: e.target.value})} className="w-full bg-[#1A2332] border border-white/5 rounded-xl px-4 py-3.5 text-sm font-semibold text-white appearance-none hover:border-white/20 hover:bg-[#1E293B] focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/50 transition-all duration-300 cursor-pointer">
                                    <option value="" disabled hidden className="bg-[#1A2332] text-gray-400">Veuillez sélectionner un modèle</option>
                                    <option value="Claude Opus 4.6 (et antérieures)" className="bg-[#1A2332] text-white py-2">🧠 Claude Opus 4.6 (et versions 2026 en descendant)</option>
                                    <option value="GPT-5.4 Thinking (et antérieures)" className="bg-[#1A2332] text-white py-2">🤖 GPT-5.4 Thinking (et versions 2026 en descendant)</option>
                                    <option value="Gemini 3.1 Pro (et antérieures)" className="bg-[#1A2332] text-white py-2">✨ Gemini 3.1 Pro (et versions 2026 en descendant)</option>
                                </select>`;

content = content.replace(oldSelect, newSelect);

fs.writeFileSync(file, content);
console.log('Select patched.');
