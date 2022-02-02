const socket = io('http://localhost:8000');

const form = document.getElementsByClassName("send-msg")[0];
const msgInput = document.getElementsByClassName("msgInput")[0];
const chatbox = document.getElementsByClassName("sec-chatbox")[0];
var joined = new Audio("join.wav");
var disconnected = new Audio("left.wav");
var msgTone = new Audio("msg.wav");


//user status (connected/disconnected)
const userStatus = (user_name, status) => {
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
    chatbox.scrollTop = chatbox.scrollHeight;
}

//message status (msg/media sent/receive)
const statusMsg = (msg, nmaewa, status) => {
    if (status == "img") {
        var imageSent = document.createElement("img");
        imageSent.classList.add("imgStyle");
        imageSent.setAttribute("src", msg);
        // imageSent.setAttribute("onclick", {zoom(msg);}`);
        imageSent.onclick = ()=>window.open(msg);
    }
    let newMsg = document.createElement("div");
    if (nmaewa == "nothing") {
        if (status == "img") {
            newMsg.append(imageSent);
        }
        else {
            newMsg.innerText = `${msg}`;
        }
        var pos = "right"
    }
    else if (nmaewa != "nothing") {
        if (status == "img") {
            newMsg.innerText = `${nmaewa}: \n`;
            newMsg.append(imageSent);
        }
        else {
            newMsg.innerText = `${nmaewa}: \n ${msg}`;
        }
        var pos = "left"
    }
    newMsg.classList.add(pos, "msg-style");
    chatbox.append(newMsg);
    chatbox.scrollTop = chatbox.scrollHeight;
    msgTone.play();
}



//new page for this? maybe//
//cannot be emptied//
let user_name = prompt("enter your name - ");

if (user_name != "") {
    socket.emit('new-user-joined', user_name);
}
////



//joining notification
socket.on('user-joined', user_name => {
    let status = "joined";
    userStatus(user_name, status);
})

//work with disconnecting users
socket.on('user-left', user_name => {
    let status = "disconnected";
    userStatus(user_name, status);
})



//msg send
form.addEventListener("submit", (e) => {
    e.preventDefault();
    let msg = [];
    msg[0] = msgInput.value;
    msg[1] = "msg";
    if (msg[0].trim() == "") { }
    else {
        let nmaewa = "nothing";
        let status = "send";
        msgInput.value = "";
        statusMsg(msg[0], nmaewa, status);
        socket.emit('send', msg);
    }
})

//msg receive
socket.on('receive', data => {
    let msg = data.message;
    let nmaewa = data.name;
    let status = "receive";
    if (data.type == "file") {
        status = "img";
    }
    statusMsg(msg, nmaewa, status);
})



//make it send media files
document.querySelector(".mediaSend").addEventListener('change', function () {
    let msg = [2];
    msg[0] = URL.createObjectURL(this.files[0]);
    msg[1] = "file";
    let nmaewa = "nothing";
    let status = "img";

    //run another function to show a small img at txt field
    statusMsg(msg[0], nmaewa, status);
    socket.emit('send', msg);
    chatbox.scrollTop = chatbox.scrollHeight;
})
