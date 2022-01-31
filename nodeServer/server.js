//server which handles socket.io connections

const io = require('socket.io')(8000, {
  cors: {
    origin: '*',
  }
});
console.log("server running on localhost something");
const user = {}

io.on('connection', socket => {
  socket.on('new-user-joined', user_name => {
    //string inside object user
    user[socket.id] = user_name;
    socket.broadcast.emit('user-joined', user_name);
  })

  socket.on('send', message => {
    socket.broadcast.emit('receive', { message: message, name: user[socket.id] })
  })

})
