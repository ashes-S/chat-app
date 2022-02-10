const socket = io('http://localhost:8000');

$ = document.querySelector.bind(document)
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

    //conditions for file being sent/received
    if (status == "img" || status == "audio" || status == "video" || status == "doc") {

        var obj = {}

        if (status == "doc") {
            obj[status + "Sent"] = document.createElement("iframe");
        }
        else {
            obj[status + "Sent"] = document.createElement(status);
        }

        obj[status + "Sent"].classList.add(status + "Style");
        obj[status + "Sent"].setAttribute("src", msg);

        if (status == "audio" || status == "video") {
            obj[status + "Sent"].setAttribute('controls', true);
            if (status == "video") {
                obj[status + "Sent"].onclick = () => window.open(msg);
            }
            else {
                obj[status + "Sent"].setAttribute('loop', true);
                obj[status + "Sent"].setAttribute('autoplay', true);
            }
        }
        else if (status == "img") {
            obj[status + "Sent"].onclick = () => window.open(msg);
        }
    }

    let newMsg = document.createElement("div");

    if (nmaewa == "nothing") {
        //send conditions
        if (status == "img" || status == "audio" || status == "video" || status == "doc") {
            newMsg.append(obj[status + "Sent"]);
        }
        else {
            newMsg.innerText = `${msg}`;
        }
        var pos = "right"
    }

    else if (nmaewa != "nothing") {
        //receiving conditions
        if (status == "img" || status == "audio" || status == "video" || status == "doc") {
            newMsg.innerText = `${nmaewa}: \n`;
            newMsg.append(obj[status + "Sent"]);
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
var user_name, user_password;

subBtn = () => {
    user_name = document.querySelector(".nameInp").value;
    user_password = document.querySelector(".passInp").value;
}

//maX length on input

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
    let status = data.type;
    statusMsg(msg, nmaewa, status);
})



//make it send media files
document.querySelector(".mediaAttach").addEventListener('change', function () {
    //take file then trim extension at the end then call function related to file type
    let msg = [2];
    msg[0] = URL.createObjectURL(this.files[0]);
    let nmaewa = "nothing";

    let ext = (this.files[0].name).split(".");
    ext = (ext[ext.length - 1]).toLowerCase();

    // if extension is one of img - run this cmnd
    let status;

    if (ext === "png" || ext === "jpeg" || ext === "jpg" || ext === "webp" || ext === "gif") {
        status = "img";
        msg[1] = "img";
    }
    else if (ext == "mp3" || ext == "wav" || ext == "wma" || ext == "aac") {
        status = "audio";
        msg[1] = "audio";
    }
    else if (ext == "mp4" || ext == "avi" || ext == "mkv" || ext == "webm" || ext == "flv" || ext == "amv" || ext == "mpg") {
        status = "video";
        msg[1] = "video";
    }
    else if (ext == "pdf" || ext == "doc" || ext == "docx" || ext == "txt") {
        status = "doc";
        msg[1] = "doc";
    }

    //run another function to show a small img at txt field
    statusMsg(msg[0], nmaewa, status);
    socket.emit('send', msg);
    chatbox.lastChild.scrollIntoView();
})

