const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
//dwnlding static files on root. app.use("/", ...)
app.use(express.static(__dirname + '/../assets'));
app.use(express.static(__dirname + '/../css'));
app.use(express.static(__dirname + '/../js'));


var PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
	res.sendFile(path.resolve(__dirname + "/../html/login.html"));
})

app.post("/", (req, res) => {
	res.sendFile(path.resolve(__dirname + "/../html/index.html"))
})


var server = app.listen(PORT, () => 
	console.log("server started on port 8000")
);



//server which handles socket.io connections

const io = require('socket.io')(server, {
	cors: {
		origin: '*',
	}
});
const user = {}

io.on('connection', socket => {
	socket.on('new-user-joined', user_name => {
		//string inside object user
		user[socket.id] = user_name;
		socket.broadcast.emit('user-joined', user_name);
	})

	socket.on('send', message => {
		socket.broadcast.emit('receive', { message: message[0], name: user[socket.id], type: message[1] })
	})

	socket.on('disconnect', message => {
		socket.broadcast.emit('user-left', user[socket.id]);
		delete user[socket.id];
	})

})
