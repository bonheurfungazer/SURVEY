const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

const searchSelect = `<select value={voteForm.model} onChange={(e) => setVoteForm({...voteForm, model: e.target.value})} className="w-full bg-[#1A2332] border border-white/5 rounded-xl px-4 py-3.5 text-sm font-semibold text-white appearance-none focus:outline-none focus:border-[#3B82F6]/50">
                                    <option value="Claude Opus 4.6 (et antérieures)">Claude Opus 4.6 (et versions 2026 en descendant)</option>
                                    <option value="GPT-5.4 Thinking (et antérieures)">GPT-5.4 Thinking (et versions 2026 en descendant)</option>
                                    <option value="Gemini 3.1 Pro (et antérieures)">Gemini 3.1 Pro (et versions 2026 en descendant)</option>
                                </select>`;

const replaceSelect = `<select value={voteForm.model} onChange={(e) => setVoteForm({...voteForm, model: e.target.value})} className="w-full bg-[#1A2332] border border-white/5 rounded-xl px-4 py-3.5 text-sm font-semibold text-white appearance-none focus:outline-none focus:border-[#3B82F6]/50">
                                    <option value="" disabled hidden>Veuillez sélectionner un modèle</option>
                                    <option value="Claude Opus 4.6 (et antérieures)">Claude Opus 4.6 (et versions 2026 en descendant)</option>
                                    <option value="GPT-5.4 Thinking (et antérieures)">GPT-5.4 Thinking (et versions 2026 en descendant)</option>
                                    <option value="Gemini 3.1 Pro (et antérieures)">Gemini 3.1 Pro (et versions 2026 en descendant)</option>
                                </select>`;

code = code.replace(searchSelect, replaceSelect);
fs.writeFileSync('src/app/page.tsx', code);
