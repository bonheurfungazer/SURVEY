async function run() {
  let res = await fetch('https://get.geojs.io/v1/ip/country.json');
  let data = await res.json();
  console.log(data);
}
run();
