const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// I saw the print `Default model select value: Claude Opus 4.6 (et antérieures)`
// Which means I forgot to update the initial state of the form to an empty string. Let me fix it.
// Oh wait, in previous steps I had replaced `model: 'Claude Opus 4.6...'` with `model: ''` but let's double check.

const searchInitialState = `const [voteForm, setVoteForm] = useState({
    country: '',
    countryCode: '',
    contact: '',
    useCase: 'Personnel',
    intensity: 0,
    model: 'Claude Opus 4.6 (et antérieures)',
  })`;

const replaceInitialState = `const [voteForm, setVoteForm] = useState({
    country: '',
    countryCode: '',
    contact: '',
    useCase: 'Personnel',
    intensity: 0,
    model: '',
  })`;

code = code.replace(searchInitialState, replaceInitialState);

fs.writeFileSync('src/app/page.tsx', code);
