import {
  main,
  CreateSaveUrl,
  FindOriginalUrl,
  FindShortenedUrl,
  getDocumentCount,
} from "./service.js";

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

app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;
  //check if url is valid;
  if (
    dns.lookup(url, (err, address, family) => {
      console.log("address: %j family: IPv%s", address, family);
      if (err) return false;
      return address;
    })
  ) {
    //check if url is already in db
    if (FindOriginalUrl(url)) {
      let _shortUrl = FindOriginalUrl(url).shortened_url;
      //return short url in json format
      return res.json({ original_url: url, short_url: _shortUrl });
    } else {
      let _shortUrl = getDocumentCount();
      //save url to db
      CreateSaveUrl(url, _shortUrl);
      return res.json({ original_url: url, short_url: _shortUrl });
    }
  }

  return res.json({ error: "invalid URL" });
});

app.get("/api/shorturl/:uId", (req, res) => {
  //find url in db
  let _url = FindShortenedUrl(req.params.uId);
  if (!_url) {
    console.log("link not found");
    return res.json({ error: "invalid URL" });
  }
  //redirect to url
  res.redirect(_url.original_url);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
