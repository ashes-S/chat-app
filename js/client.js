const socket = io('http://localhost:8000');

const form = document.getElementsByClassName("send-msg")[0];
const msgInput = document.getElementsByClassName("msgInput")[0];
const chatbox = document.getElementsByClassName("sec-chatbox")[0];
var joined = new Audio("join.wav");
var disconnected = new Audio("left.wav");
var msgTone = new Audio("msg.wav");

const userJoin = (user_name, status) => {
    const joinMsg = document.createElement("div");
    joinMsg.classList.add("middle", "user-joined", "msg-style");
    joinMsg.innerText = `${user_name} has ${status}`;
    chatbox.append(joinMsg);
    if (status == "joined") {
        joined.play();
    }
    else if (status == "disconnected") {
        disconnected.play();
    }
}

const statusMsg = (msg, pos, nmaewa) => {
    let newMsg = document.createElement("div");
    if (nmaewa == "nothing") {
        newMsg.innerText = `${msg}`;
    }
    else {
        newMsg.innerText = `${nmaewa}: \n ${msg}`;
    }
    newMsg.classList.add(pos, "msg-style");
    chatbox.append(newMsg);
    chatbox.scrollTop = chatbox.scrollHeight;
    msgTone.play();
}
//new page for this? maybe//
let user_name = prompt("enter your name - ");

if (user_name != "") {
    socket.emit('new-user-joined', user_name);
}
////

//joining notification
socket.on('user-joined', user_name => {
    let status = "joined";
    userJoin(user_name, status);
})

//msg send
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let msg = msgInput.value;
    let pos = "right";
    let nmaewa = "nothing";
    msgInput.value = "";
    statusMsg(msg, pos, nmaewa);
    socket.emit('send', msg);
})

//msg receive
socket.on('receive', data => {
    let pos = "left";
    let msg = data.message;
    let nmaewa = data.name;
    statusMsg(msg, pos, nmaewa);
})

//work with disconnecting users
socket.on('user-left', user_name => {
    let status = "disconnected";
    userJoin(user_name, status);
})