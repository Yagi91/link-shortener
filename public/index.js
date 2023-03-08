const recentUrl = document.getElementById("recent-url");
const url = "api/recent";
fetch(url)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    data.forEach((item) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `./api/shorturl/${item.shortened_url}`;
      a.textContent = `Original: ${item.original_url} - shortened: ${
        window.location.origin + "/api/shorturl/" + item.shortened_url
      }`;
      a.style.textDecoration = "none";
      li.appendChild(a);
      recentUrl.appendChild(li);
    });
  });
