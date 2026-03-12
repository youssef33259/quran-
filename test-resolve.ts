async function check() {
  const res = await fetch("http://localhost:3000/api/resolve?url=http://j.mp/2b8SiNO");
  const text = await res.text();
  console.log(text);
}
check();
