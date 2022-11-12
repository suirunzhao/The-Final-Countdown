window.addEventListener('load', function () {
    //grab the data from the database using fetch() on page route
    fetch('/data')
        .then(res => res.json())
        .then(data => {
            //console.log(data.data.length);
            //console.log(data.data[1].info.name);
            let chatBox = document.getElementById('chat-box-msgs');

            for (let i = 0; i < data.data.length; i++) {
                let pastMsg = data.data[i].info.name + ": '" + data.data[i].info.message + "'" + " " + data.data[i].info.rtv + " left";
                let oldMsg = document.createElement('p');
                oldMsg.innerHTML = pastMsg;
                chatBox.appendChild(oldMsg);
            }
        });

    document.getElementsByClassName("output-info")[0].style.display = 'none';
    document.getElementsByClassName("chat-feed")[0].style.display = 'none';
    document.getElementsByClassName("long-live")[0].style.display = 'none';

    document.getElementById('calculate').addEventListener('click', () => {

        //clear
        document.getElementsByClassName("input-info")[0].style.display = 'none';
        document.getElementsByClassName("output-info")[0].style.display = '';
        document.getElementsByClassName("chat-feed")[0].style.display = 'none';
        document.getElementsByClassName("long-live")[0].style.display = 'none';

        //grab name
        let name = document.getElementById('name').value;
        //console.log(name);
        document.getElementById('name-input').innerHTML = name;

        //grab dob
        let dobvalue = document.getElementById('dob').value;
        //replace - to /
        dob = dobvalue.replace(/-/g, '/');
        //console.log(dob);

        //add year to dob
        let dobAddYear = Number(dobvalue.substr(0, 4)) + 100;
        //console.log(dobAddYear);
        let replacedob = dob.substring(0, 0) +
            dobAddYear +
            dob.substring(0 + 4);
        let formattedreplacedob = replacedob.replace(/[/]/g, '-') + " 00:00:00";
        //console.log(replacedob);

        //get live date and time
        function refreshTime() {
            //let timeDisplay = document.getElementById("time");
            let dateString = new Date().toLocaleString();
            document.getElementById('current-time').innerHTML = dateString;

            let formatteddob = dob.replace(/[/]/g, '-') + " 00:00:00";
            //console.log(formattedString);
            //console.log(formatteddob);

            // console.log(getSecondDiff(
            //     new Date(formatteddob),
            //     new Date(dateString),
            //function calculate seconds
            function getSecondDiff(startDate, endDate) {
                let second = 1000;
                if(Math.round(
                    (endDate - startDate) / second
                ) < 0){
                    document.getElementsByClassName("heading")[0].style.display = 'none';
                    document.getElementsByClassName("input-info")[0].style.display = 'none';
                    document.getElementsByClassName("output-info")[0].style.display = 'none';
                    document.getElementsByClassName("chat-feed")[0].style.display = 'none';
                    document.getElementsByClassName("long-live")[0].style.display = '';
                    document.getElementById('long-live').innerHTML = name;
                }else{ 
                    return Math.round(
                    (endDate - startDate) / second
                )
                };
            }

            let ltv = getSecondDiff(
                new Date(formatteddob),
                new Date(dateString),
            );



            let rtv = getSecondDiff(
                new Date(dateString),
                new Date(formattedreplacedob),
            );

            document.getElementById('living-time-value').innerHTML = ltv + " sec";
            document.getElementById('remaining-time-value').innerHTML = rtv + " sec";

        }
        setInterval(refreshTime, 1000);

        //document.getElementsByClassName("input-info").hidden = true;

    });

    /* --- Code to page 4 --- */
    // document.getElementById('send-button').addEventListener('click', () => {
    //     document.getElementsByClassName("input-info")[0].style.display = 'none';
    //     document.getElementsByClassName("output-info")[0].style.display = 'none';
    //     document.getElementsByClassName("chat-feed")[0].style.display = '';
    // });

    //Open and connect socket
    let socket = io();
    //Listen for confirmation of connection
    socket.on('connect', function () {
        //console.log("Connected");
    });

    /* --- Code to RECEIVE a socket message from the server --- */

    //Listen for messages named 'msg' from the server
    socket.on('msg', function (data) {
        //console.log("Message arrived!");
        //console.log(data);

        //Create a message string and page element
        let receivedMsg = data.name + ": '" + data.msg + "'" + " " + data.time + " left";
        let msgEl = document.createElement('p');
        msgEl.innerHTML = receivedMsg;
        let newchatBox = document.getElementById('chat-box-msgs');
        //Add the element with the message to the page
        newchatBox.appendChild(msgEl);
        //Add a bit of auto scroll for the chat box
        newchatBox.scrollTop = newchatBox.scrollHeight;
    });

    /* --- Code to SEND a socket message to the Server --- */
    let nameInput = document.getElementById('name')
    let timeLeft = document.getElementById('remaining-time-value')
    let msgInput = document.getElementById('msg-input');
    let sendButton = document.getElementById('send-button');

    sendButton.addEventListener('click', function () {
        document.getElementsByClassName("input-info")[0].style.display = 'none';
        document.getElementsByClassName("output-info")[0].style.display = 'none';
        document.getElementsByClassName("chat-feed")[0].style.display = '';
        document.getElementsByClassName("long-live")[0].style.display = 'none';

        let curName = nameInput.value;
        let curTime = timeLeft.innerHTML;
        let curMsg = msgInput.value;
        let msgObj = { "name": curName, "time": curTime, "msg": curMsg };

        //Send the message object to the server
        socket.emit('msg', msgObj);
        //create info
        let info = {
            "name": curName,
            "dob": dob,
            "message": curMsg,
            "rtv": document.getElementById('remaining-time-value').innerHTML
        };
        console.log(info);

        //make info JSON
        let infoJSON = JSON.stringify(info);
        //console.log(infoJSON);

        //send the JSON object to the server
        fetch('/infoSave', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: infoJSON
        })
            .then(res => res.json())
            .then(data => {
                //console.log("work?");
                //console.log(data);
            })
    })
})