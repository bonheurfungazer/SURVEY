const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const oldAuthBlock = `
    try {
        if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({
                options: {
                    emailRedirectTo: \`\${window.location.origin}/auth/callback?next=/?verified=true\`,
                },
                email: loginEmail,
                password: loginPassword,
            })
            if (error) throw error

            // Si la vérification par email est activée sur Supabase, l'utilisateur est créé mais pas connecté
            if (data.user && data.user.identities && data.user.identities.length === 0) {
                showToast("Cet email est déjà utilisé. Veuillez vous connecter.", "error")
            } else {
                showToast("Inscription réussie ! Vous pouvez maintenant voter.")
                setShowLoginModal(false)
            }
        } else {
`;

const newAuthBlock = `
    try {
        if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({
                email: loginEmail,
                password: loginPassword,
            })
            if (error) throw error

            if (data.user && data.user.identities && data.user.identities.length === 0) {
                showToast("Cet email est déjà utilisé. Veuillez vous connecter.", "error")
            } else {
                showToast("Inscription réussie ! Vous êtes maintenant connecté.")
                setShowLoginModal(false)
            }
        } else {
`;

if (content.includes(oldAuthBlock)) {
    content = content.replace(oldAuthBlock, newAuthBlock);
    fs.writeFileSync('src/app/page.tsx', content);
    console.log("Replaced block.");
} else {
    console.log("Block not found.");
}
