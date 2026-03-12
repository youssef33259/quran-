async function check() {
  const response = await fetch("http://j.mp/2b8SiNO", {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  });
  console.log(response.status, response.headers.get("content-type"), response.headers.get("content-length"));
  const text = await response.text();
  console.log(text.substring(0, 200));
}
check();
