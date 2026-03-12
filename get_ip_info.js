async function run() {
  try {
    let res = await fetch('https://ipapi.co/json/');
    let data = await res.json();
    console.log('ipapi.co:', data);
  } catch(e) { console.error(e) }

  try {
    let res = await fetch('http://ip-api.com/json/');
    let data = await res.json();
    console.log('ip-api.com:', data);
  } catch(e) { console.error(e) }

  try {
    let res = await fetch('https://ipwho.is/');
    let data = await res.json();
    console.log('ipwho.is:', data);
  } catch(e) { console.error(e) }
}
run();
