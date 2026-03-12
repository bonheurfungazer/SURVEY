const { execSync } = require('child_process');
try {
  const result = execSync('env | grep SUPABASE', { encoding: 'utf-8' });
  console.log(result);
} catch (e) {
  console.log('Error or no output');
}
