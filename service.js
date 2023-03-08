// import mongoose from "mongoose";
const mongoose = require("mongoose");
require("dotenv").config();

const Schema = mongoose.Schema;

// main();

async function main() {
  try {
    //connect to db
    await mongoose.connect(process.env.MONGO_URI, {
      //
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
  }
}

//url schema to give the db a structure
const urlSchema = new Schema({
  original_url: { type: String, required: true },
  shortened_url: { type: String, required: true },
});

const Url = mongoose.model("Url", urlSchema);

//create and save url document to the db
const CreateSaveUrl = async (url, shortUrl) => {
  try {
    const newUrl = new Url({ original_url: url, shortened_url: shortUrl });
    const savedUrl = await newUrl.save();
    return savedUrl;
  } catch (err) {
    console.error(
      "Could not save to the new url to the database, because of the following error " +
        err
    );
    return err;
  }
};

//find original url in db and return it
const FindOriginalUrl = async (url) => {
  try {
    const foundUrl = await Url.findOne({ original_url: url });
    console.log(Url);
    return foundUrl;
  } catch (err) {
    return console.error(
      "Could not locate any url matching this in the database: " + err
    );
  }
};

//find url by shortened url in db and return it
const FindShortenedUrl = async (url) => {
  try {
    const foundUrl = await Url.findOne({ shortened_url: url });
    return foundUrl;
  } catch (err) {
    console.error("Could not locate the short url: " + err);
    return err;
  }
};

//get document count, return count
const getDocumentCount = async () => {
  try {
    const count = await Url.countDocuments({});
    console.log("The number of documents are " + count);
    return count;
  } catch (err) {
    console.error("Could not count the number of available documents " + err);
    return err;
  }
};

module.exports = {
  main,
  CreateSaveUrl,
  FindOriginalUrl,
  FindShortenedUrl,
  getDocumentCount,
};
