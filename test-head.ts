async function check() {
  const res = await fetch("http://j.mp/2b8SiNO", {
    method: "HEAD",
    redirect: "follow"
  });
  console.log(res.status, res.url);
}
check();
