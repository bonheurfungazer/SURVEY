const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// The default `contact` isn't set, it's missing from `useState({`
const oldState = `  const [voteForm, setVoteForm] = useState({
    country: 'Cameroun',
    countryCode: 'CM',
    model: '',
    intensity: 0,
    useCase: '',
    contact: ''
  })`;

const newState = `  const [voteForm, setVoteForm] = useState({
    country: 'Cameroun',
    countryCode: 'CM',
    model: '',
    intensity: 0,
    useCase: '',
    contact: '+237'
  })`;

if (content.includes(oldState)) {
    content = content.replace(oldState, newState);
    fs.writeFileSync('src/app/page.tsx', content);
    console.log("Patched contact state");
} else {
    // maybe contact is not there
    const regex = /const \[voteForm, setVoteForm\] = useState\(\{\n\s*country: 'Cameroun',\n\s*countryCode: 'CM',\n\s*model: '',\n\s*intensity: 0,\n\s*useCase: '',\n\s*contact: '([^']*)'\n\s*\}\)/;
    const match = content.match(regex);
    if (match) {
        content = content.replace(regex, `const [voteForm, setVoteForm] = useState({
    country: 'Cameroun',
    countryCode: 'CM',
    model: '',
    intensity: 0,
    useCase: '',
    contact: '+237'
  })`);
        fs.writeFileSync('src/app/page.tsx', content);
        console.log("Patched existing contact state");
    } else {
        // Just replace the object directly using regex
        content = content.replace(
/const \[voteForm, setVoteForm\] = useState\(\{([^}]+)\}\)/,
`const [voteForm, setVoteForm] = useState({$1, contact: '+237' } /* patched */ )`.replace(/contact: '[^']*',\s*contact: '\+237'/, `contact: '+237'`)
        );
        fs.writeFileSync('src/app/page.tsx', content);
        console.log("Regex patched contact state");
    }
}
