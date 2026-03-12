async function check() {
  try {
    const res = await fetch("http://localhost:3000/api/download?url=http://j.mp/2b8SiNO&filename=Juz_1.mp3");
    console.log(res.status, res.headers.get("content-type"), res.headers.get("content-length"));
    const text = await res.text();
    console.log("Length:", text.length);
    console.log("Preview:", text.substring(0, 100));
  } catch (e) {
    console.error(e);
  }
}
check();
