const fs = require('fs');
const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const validationLogic = `
    if (!voteForm.model) {
      showToast("Veuillez sélectionner un modèle.", 'error')
      return
    }

    const phoneRegex = /^\\+?[0-9\\s\\-\\.()]{7,25}$/;
    if (!voteForm.contact || !phoneRegex.test(voteForm.contact)) {
      showToast("Veuillez renseigner un numéro de téléphone valide (ex: +33612345678).", 'error')
      return
    }

    setIsSubmitting(true)`;

content = content.replace(`    if (!voteForm.model) {
      showToast("Veuillez sélectionner un modèle.", 'error')
      return
    }

    setIsSubmitting(true)`, validationLogic);

fs.writeFileSync(file, content);
console.log('Phone validation added.');
