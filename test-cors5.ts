async function check() {
  const res = await fetch("http://j.mp/2b8SiNO");
  console.log(res.status);
  res.headers.forEach((v, k) => console.log(k, v));
}
check();
