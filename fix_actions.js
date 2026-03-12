const fs = require('fs');
let code = fs.readFileSync('src/app/actions.ts', 'utf8');

const searchSelect = `.select('id, contact_info, use_case, country, model_choice, created_at')`;
const replaceSelect = `.select('id, contact_info, use_case, country, model_choice, intensity, created_at')`;
code = code.replace(searchSelect, replaceSelect);

const searchMap = `contacts: recentData?.map((v: any) => ({
              id: v.id,
              contact: v.contact_info || '',
              useCase: v.use_case || '',
              country: v.country || '',
              model: v.model_choice || '',
              date: new Date(v.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
          })) || []`;

const replaceMap = `contacts: recentData?.map((v: any) => ({
              id: v.id,
              contact: v.contact_info || '',
              useCase: v.use_case || '',
              country: v.country || '',
              model: v.model_choice || '',
              intensity: v.intensity !== undefined ? v.intensity : null,
              date: new Date(v.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
          })) || []`;

code = code.replace(searchMap, replaceMap);

fs.writeFileSync('src/app/actions.ts', code);
