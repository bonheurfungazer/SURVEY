const fs = require('fs');
let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// Update the initial state
const searchInitialState = `const [voteForm, setVoteForm] = useState({
    country: '',
    countryCode: '',
    contact: '',
    useCase: 'Personnel',
    intensity: 5,
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

// Update input min value from 1 to 0
const searchInputRange = `<input type="range" value={voteForm.intensity} onChange={(e) => setVoteForm({...voteForm, intensity: parseInt(e.target.value)})} min="1" max="10" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10" />`;
const replaceInputRange = `<input type="range" value={voteForm.intensity} onChange={(e) => setVoteForm({...voteForm, intensity: parseInt(e.target.value)})} min="0" max="10" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10" />`;

code = code.replace(searchInputRange, replaceInputRange);

fs.writeFileSync('src/app/page.tsx', code);
