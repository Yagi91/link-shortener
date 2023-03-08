# URL Shortener Microservice

TECH: JavaScript, CSS, HTML, MONGO-Mongoose, Node-Express


This is a link shortener Node.js Application with MongoDB database. Users are able to get a shorter version of links the parse to the app.

![link shortener](https://user-images.githubusercontent.com/84844806/223753016-bbac00e9-329f-4e35-873c-45e702e71242.PNG)

* You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties. Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}
* When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.
* If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain { error: 'invalid url' }

The root/home contains a recent, it displays most recent shortened links, to ease copying.

BY **BRYAN TIMAH (YAGI91)**
