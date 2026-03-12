async function run() {
  try {
    let res = await fetch('https://ipinfo.io/json');
    let data = await res.json();
    console.log('ipinfo.io:', data);
  } catch(e) { console.error(e) }
}
run();
