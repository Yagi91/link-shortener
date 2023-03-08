const {
  main,
  CreateSaveUrl,
  FindOriginalUrl,
  FindShortenedUrl,
  getDocumentCount,
} = require("./service.js");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("node:dns");

// Basic Configuration
const port = process.env.PORT || 3000;
main();

app.use(cors()); //To prevent cross-origin errors

app.use("/public", express.static(`${process.cwd()}/public`)); //To serve static assets

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

//post request to create and save url
app.post("/api/shorturl", async (req, res) => {
  const { url } = req.body;
  //check if url is valid;

  function isUrlFormatValid(url) {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
  }

  if (
    dns.lookup(url, (err, address, family) => {
      console.log("address: %j family: IPv%s", address, family);
      if (err) return false;
      return address;
    }) &&
    isUrlFormatValid(url)
  ) {
    //check if url is already in db
    const foundUrl = await FindOriginalUrl(url);
    console.log("The found user is " + foundUrl);
    if (foundUrl) {
      let _shortUrl = foundUrl.shortened_url;
      //return short url in json format
      console.log("url already in db and short url is " + _shortUrl);
      return res.json({ original_url: url, short_url: _shortUrl });
    }
    let _shortUrl = await getDocumentCount();
    //save url to db
    console.log("url not in db and short url is: " + _shortUrl);
    await CreateSaveUrl(url, _shortUrl);
    return res.json({ original_url: url, short_url: _shortUrl });
  }
  console.log("invalid url");
  return res.json({ error: "invalid URL" });
});

app.get("/api/shorturl/:uId", async (req, res) => {
  //find url in db
  let _url = await FindShortenedUrl(req.params.uId);
  if (!_url) {
    console.log("link not found");
    return res.json({
      error: "invalid url, Ensure the link has been shortened ",
    });
  }
  //redirect to url
  return res.redirect(_url.original_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
