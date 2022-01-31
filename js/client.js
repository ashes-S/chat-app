const socket = io('http://localhost:8000');

const form = document.getElementsByClassName("send-msg")[0];
const msgInput = document.getElementsByClassName("msgInput")[0];
const chatbox = document.getElementsByClassName("sec-chatbox")[0];

const userJoin = (user_name) => {
    const joinMsg = document.createElement("div");
    joinMsg.classList.add("middle", "user-joined", "msg-style");
    joinMsg.innerText = `${user_name} has joined`;
    chatbox.append(joinMsg);
}

const sendMsg = (msg, pos)=>{
    let newMsg = document.createElement("div");
    newMsg.innerText = `${msg}`;
    newMsg.classList.add(pos, "msg-style");
    chatbox.append(newMsg);
    chatbox.scrollTop = chatbox.scrollHeight;
}
const recMsg = (msg, pos, nmaewa)=>{
    let newMsg = document.createElement("div");
    newMsg.innerText = `${nmaewa}: \n ${msg}`;
    newMsg.classList.add(pos, "msg-style");
    chatbox.append(newMsg);
    chatbox.scrollTop = chatbox.scrollHeight;
}
//new page for this? maybe//
let user_name = prompt("enter your name - ");

if (user_name != "") {
    socket.emit('new-user-joined', user_name);
}
////

//joining notification
socket.on('user-joined', user_name => {
    userJoin(user_name);
})

//msg send
form.addEventListener("submit", (e)=>{
    e.preventDefault();
    let msg = msgInput.value;
    let pos = "right"
    sendMsg(msg, pos);
    socket.emit('send', msg);
    msgInput.value = "";
})

//msg receive
socket.on('receive', data=>{
    let pos = "left";
    let msg = data.message;
    let nmaewa = data.name;
    recMsg(msg, pos, nmaewa);
})