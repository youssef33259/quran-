async function check() {
  const res = await fetch("http://localhost:3000/");
  const text = await res.text();
  console.log("Length:", text.length);
}
check();
