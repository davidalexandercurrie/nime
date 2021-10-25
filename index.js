let http = require("http");
let express = require("express");
let PORT = 3000;

let app = express();
let server = http.createServer(app).listen(PORT);
let io = require('socket.io')(server);

app.use(express.static("public"));
console.log("Ready");

io.on("connection", (socket) => {
    console.log(socket.id + " has connected.");

    socket.on("makeSound", (data) => {
        console.log(data);
    });
    
    socket.on("playDrum1", () => {
        console.log("Drum!");
    });

    socket.on("playDrum2", () => {
        console.log("Drum!");
    });
});