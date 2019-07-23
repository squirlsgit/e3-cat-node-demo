var path = require('path');
var express = require('express');
var app = express();
app.use(express.static(__dirname + "/dist/category-demo"));
console.log("express");
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '/dist/category-demo', 'index.html'));
});
// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080).addListener("listening", () => { console.log("listening"); });
