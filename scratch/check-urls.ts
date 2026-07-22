async function checkUrls() {
  const urls = [
    "https://res.cloudinary.com/virvu4jm/image/upload/v1784551813/polacraft/products/hero/nllyckdr7m6znuz9on5p.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1680000000/kireedam.png"
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(`URL: ${url} -> Status: ${res.status}`);
    } catch (e: any) {
      console.log(`URL: ${url} -> Error: ${e.message}`);
    }
  }
}

checkUrls();
