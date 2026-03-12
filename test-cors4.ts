async function check() {
  const res = await fetch("https://ia800402.us.archive.org/16/items/MisharyRasyidPerJuz/Mishary/01.mp3", {
    method: "GET",
    redirect: "manual"
  });
  console.log(res.status);
  res.headers.forEach((v, k) => console.log(k, v));
}
check();
