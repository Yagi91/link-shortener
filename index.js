require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("node:dns");

// Basic Configuration
const port = process.env.PORT || 3000;

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

  if (
    dns.lookup(url, (err, address, family) => {
      console.log("address: %j family: IPv%s", address, family);
      if (err) return err;
      return address;
    })
  ) {
    return res.json({ error: "invalid URL" });
  }

  res.json({ original_url: url, short_url: 1 });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
