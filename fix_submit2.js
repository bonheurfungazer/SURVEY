const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

const searchSubmit = `  const submitVote = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      showToast("Vous devez être connecté pour voter.", 'error')
      return
    }`;

const replaceSubmit = `  const submitVote = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      showToast("Vous devez être connecté pour voter.", 'error')
      return
    }

    if (voteForm.intensity === 0) {
      showToast("Veuillez sélectionner une intensité supérieure à 0.", 'error')
      return
    }

    if (!voteForm.model) {
      showToast("Veuillez sélectionner un modèle.", 'error')
      return
    }`;

code = code.replace(searchSubmit, replaceSubmit);
fs.writeFileSync('src/app/page.tsx', code);
