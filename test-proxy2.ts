async function check() {
  const res = await fetch("http://localhost:3000/api/download?url=http://j.mp/2b8SiNO&filename=Juz_1.mp3");
  const text = await res.text();
  console.log("Length:", text.length);
  console.log("Preview:", text.substring(0, 500));
}
check();
