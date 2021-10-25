let http = require('http');
let express = require('express');
let PORT = 3000;
const maxApi = require('max-api');
let app = express();
let server = http.createServer(app).listen(PORT);
let io = require('socket.io')(server);

app.use(express.static('public'));
console.log('Ready');

io.on('connection', socket => {
  console.log(socket.id + ' has connected.');

  socket.on('makeSound', data => {
    maxApi.outlet(data);
  });

  socket.on('playDrum1', () => {
    maxApi.outlet({ drum1: 1 });
  });

  socket.on('playDrum2', () => {
    maxApi.outlet({ drum2: 1 });
  });
});
