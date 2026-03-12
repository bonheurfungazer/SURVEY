const fs = require('fs');
const file = 'src/app/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const \[voteForm, setVoteForm\] = useState\(\{\n\s*country: 'Cameroun',\n\s*countryCode: 'CM',\n\s*model: '[^]+?',\n\s*intensity: \d+,\n\s*useCase: '',/,
  `const [voteForm, setVoteForm] = useState({
    country: 'Cameroun',
    countryCode: 'CM',
    model: '',
    intensity: 0,
    useCase: '',`
);

fs.writeFileSync(file, content);
console.log('Done');
