const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const oldPopup = `              const newLatest = [newVote, ...prev.latestVotes].slice(0, 10)`;

// We can add a periodic check every 3 seconds while showVerificationPopup is true to see if they clicked the link on another device.
const pollingLogic = `
  useEffect(() => {
      let interval: NodeJS.Timeout;
      if (showVerificationPopup) {
          interval = setInterval(async () => {
              const { data } = await supabase.auth.getSession();
              if (data.session) {
                  setUser(data.session.user);
                  setShowVerificationPopup(false);
                  setShowLoginModal(false);
                  showToast("Email confirmé ! Vous êtes connecté.", "success");
              }
          }, 3000);
      }
      return () => clearInterval(interval);
  }, [showVerificationPopup]);
`;

// Find a good place to insert it
content = content.replace("useEffect(() => {", pollingLogic + "\n  useEffect(() => {");
fs.writeFileSync('src/app/page.tsx', content);
