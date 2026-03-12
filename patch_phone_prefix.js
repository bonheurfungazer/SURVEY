const fs = require('fs');
const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldInput = `<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="fab fa-whatsapp text-[#10B981]/70 text-sm"></i>
                                </div>
                                <input type="text" value={voteForm.contact} onChange={(e) => setVoteForm({...voteForm, contact: e.target.value})} className="w-full bg-[#1A2332] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#3B82F6]/50" placeholder="n° WhatsApp (ex: +237...)" pattern="^\\+?[0-9\\s\\-\\.()]{7,25}$" title="Veuillez entrer un numéro valide (ex: +33612345678)" required />`;

const newInput = `<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none space-x-2">
                                    <i className="fab fa-whatsapp text-[#10B981]/70 text-sm"></i>
                                    <span className="text-white text-sm font-medium">{countryDialCodes[voteForm.countryCode] || '+'}</span>
                                </div>
                                <input type="tel" value={voteForm.contact} onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9\\s\\-]/g, '');
                                    setVoteForm({...voteForm, contact: val})
                                }} className="w-full bg-[#1A2332] border border-white/5 rounded-xl pl-20 pr-4 py-3 text-sm text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#3B82F6]/50" placeholder="n° WhatsApp (ex: 612 34 56 78)" pattern="^[0-9\\s\\-]{6,20}$" title="Veuillez entrer un numéro valide sans le code pays" required />`;

content = content.replace(oldInput, newInput);

const oldValidationLogic = `    const phoneRegex = /^\\+?[0-9\\s\\-\\.()]{7,25}$/;
    if (!voteForm.contact || !phoneRegex.test(voteForm.contact)) {
      showToast("Veuillez renseigner un numéro de téléphone valide (ex: +33612345678).", 'error')
      return
    }`;

const newValidationLogic = `    const phoneRegex = /^[0-9\\s\\-]{6,20}$/;
    if (!voteForm.contact || !phoneRegex.test(voteForm.contact)) {
      showToast("Veuillez renseigner un numéro de téléphone valide sans le préfixe pays.", 'error')
      return
    }

    // Prepare full contact info by prepending country dial code
    const dialCode = countryDialCodes[voteForm.countryCode] || '';
    const fullContact = dialCode + voteForm.contact.replace(/[\\s\\-]/g, '');`;

content = content.replace(oldValidationLogic, newValidationLogic);

const oldInsertData = `            contact_info: voteForm.contact,
            is_real_user: true`;

const newInsertData = `            contact_info: fullContact,
            is_real_user: true`;

content = content.replace(oldInsertData, newInsertData);


// Now we must ensure the contact form field does NOT contain the dial code initially
const oldSetInitialVoteForm = `      if (countryDialCodes[countryCode]) {
        setVoteForm(prev => ({
          ...prev,
          country: countryName,
          countryCode: countryCode,
          contact: countryDialCodes[countryCode]
        }))
      } else {
        setVoteForm(prev => ({
          ...prev,
          country: countryName,
          countryCode: countryCode
        }))
      }`;

const newSetInitialVoteForm = `      if (countryDialCodes[countryCode]) {
        setVoteForm(prev => ({
          ...prev,
          country: countryName,
          countryCode: countryCode,
          contact: '' // Do not pre-fill contact with dial code anymore
        }))
      } else {
        setVoteForm(prev => ({
          ...prev,
          country: countryName,
          countryCode: countryCode,
          contact: ''
        }))
      }`;

content = content.replace(oldSetInitialVoteForm, newSetInitialVoteForm);


const oldSetVoteFormSuccess = `setVoteForm(prev => ({ ...prev, intensity: 8, useCase: '', contact: countryDialCodes[prev.countryCode] || '' }))`;
const newSetVoteFormSuccess = `setVoteForm(prev => ({ ...prev, intensity: 8, useCase: '', contact: '' }))`;
content = content.replace(oldSetVoteFormSuccess, newSetVoteFormSuccess);


fs.writeFileSync(file, content);
console.log('Phone prefix locked.');
