async function check() {
  const res = await fetch("http://j.mp/2b8SiNO", {
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
