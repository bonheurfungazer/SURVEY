const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// The user wants the popup to say "waiting for confirmation", and then automatically log them in when they click the link in their email.
// When they click the link on their phone or PC, they will be redirected to the site, so they are logged in.
// If they are waiting on the *original* tab, we can poll for session or just rely on onAuthStateChange (which we already have in useEffect).
// So let's make the popup state clearer, and maybe add a spinner.

const oldPopup = `{showVerificationPopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111823] border border-[#3B82F6]/30 rounded-2xl p-8 w-full max-w-sm relative shadow-[0_0_40px_rgba(59,130,246,0.2)] text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center mb-6 text-[#3B82F6] text-3xl shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse">
                    <i className="fas fa-envelope-open-text"></i>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Vérifiez votre boîte mail</h2>
                <p className="text-[#94A3B8] text-sm leading-relaxed mb-8">
                    Un lien de confirmation a été envoyé à <span className="text-white font-semibold">{loginEmail}</span>. <br/>Veuillez cliquer sur ce lien pour activer votre compte.
                </p>
                <button
                    onClick={() => setShowVerificationPopup(false)}
                    className="w-full bg-[#1A2332] hover:bg-[#1E293B] border border-white/10 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
                >
                    J'ai compris
                </button>
            </div>
        </div>
      )}`;

const newPopup = `{showVerificationPopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111823] border border-[#3B82F6]/30 rounded-2xl p-8 w-full max-w-sm relative shadow-[0_0_40px_rgba(59,130,246,0.2)] text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center mb-6 text-[#3B82F6] text-3xl shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse">
                    <i className="fas fa-spinner fa-spin"></i>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">En attente de confirmation...</h2>
                <p className="text-[#94A3B8] text-sm leading-relaxed mb-8">
                    Un lien a été envoyé à <span className="text-white font-semibold">{loginEmail}</span>. <br/>
                    Veuillez cliquer sur ce lien depuis votre boîte mail.<br/><br/>
                    <span className="text-xs text-[#3B82F6]">Cette page se mettra à jour automatiquement dès que l'email sera confirmé.</span>
                </p>
                <button
                    onClick={() => setShowVerificationPopup(false)}
                    className="w-full bg-[#1A2332] hover:bg-[#1E293B] border border-white/10 text-white font-bold py-3.5 rounded-xl text-sm transition-colors mt-2"
                >
                    Fermer ou réessayer
                </button>
            </div>
        </div>
      )}`;

content = content.replace(oldPopup, newPopup);

// Also need to automatically close the popup when the user gets logged in!
// So in the onAuthStateChange listener:
const oldListener = `      // Listen for normal auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)
      })`;

const newListener = `      // Listen for normal auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
            setUser(session.user)
            setShowVerificationPopup(false)
            setShowLoginModal(false)
        } else {
            setUser(null)
        }
      })`;

content = content.replace(oldListener, newListener);

fs.writeFileSync('src/app/page.tsx', content);
