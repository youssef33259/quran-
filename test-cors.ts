async function check() {
  const res = await fetch("https://ia800402.us.archive.org/16/items/MisharyRasyidPerJuz/Mishary/01.mp3", {
    method: "OPTIONS",
    headers: {
      "Origin": "http://localhost:3000",
      "Access-Control-Request-Method": "GET"
    }
  });
  console.log(res.status);
  res.headers.forEach((v, k) => console.log(k, v));
}
check();
