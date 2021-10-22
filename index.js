let http = require("http");
let express = require("express");
let PORT = 3000;

let app = express();
let server = http.createServer(app).listen(PORT);

app.use(express.static("public"));
console.log("Ready");