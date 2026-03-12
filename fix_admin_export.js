const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Update contacts array type
const searchType = `contacts: [] as Array<{ id: string; contact: string; country: string; model: string; useCase: string; date: string }>,`;
const replaceType = `contacts: [] as Array<{ id: string; contact: string; country: string; model: string; useCase: string; date: string; intensity: number }>,`;
code = code.replace(searchType, replaceType);

// 2. Update CSV Headers and Rows
const searchCSV = `    const headers = ["Date", "Pays", "Modèle Choisi", "Cas d'usage", "Numéro WhatsApp"];
    const rows = adminStats.contacts.map(c => [
        \`"\${c.date}"\`,
        \`"\${c.country}"\`,
        \`"\${c.model}"\`,
        \`"\${c.useCase || 'Non renseigné'}"\`,
        \`"\${c.contact || 'Non renseigné'}"\`
    ]);`;

const replaceCSV = `    const headers = ["Date", "Pays", "Modèle Choisi", "Cas d'usage", "Intensité", "Numéro WhatsApp"];
    const rows = adminStats.contacts.map(c => [
        \`"\${c.date}"\`,
        \`"\${c.country}"\`,
        \`"\${c.model}"\`,
        \`"\${c.useCase || 'Non renseigné'}"\`,
        \`"\${c.intensity !== undefined ? c.intensity : 'N/A'}"\`,
        \`"\${c.contact || 'Non renseigné'}"\`
    ]);`;
code = code.replace(searchCSV, replaceCSV);

// 3. Update the admin UI to show intensity in the preview
const searchUI = `<div className="text-[#94A3B8] flex items-center space-x-2">
                                        <span>{contact.country}</span>
                                        <span className="w-1 h-1 rounded-full bg-[#3B82F6]/50"></span>
                                        <span className="text-[#10B981] truncate max-w-[100px] inline-block">{contact.model}</span>
                                    </div>`;

const replaceUI = `<div className="text-[#94A3B8] flex items-center space-x-2 text-[9px] mt-1">
                                        <span className="truncate max-w-[60px]" title={contact.country}>{contact.country}</span>
                                        <span className="w-1 h-1 rounded-full bg-[#3B82F6]/50"></span>
                                        <span className="text-[#10B981] truncate max-w-[80px]" title={contact.model}>{contact.model}</span>
                                        <span className="w-1 h-1 rounded-full bg-[#3B82F6]/50"></span>
                                        <span className="text-[#F59E0B]">Intensité: {contact.intensity !== undefined ? contact.intensity : '?'}</span>
                                    </div>`;
code = code.replace(searchUI, replaceUI);

fs.writeFileSync('src/app/page.tsx', code);
