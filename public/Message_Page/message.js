let inputdata;

window.addEventListener('load', function () {
    //grab the data from the database using fetch() on page route
    fetch('/data')
        .then(res => res.json())
        .then(data => {
            inputdata = data;
            //console.log(inputdata.data[inputdata.data.length-1].dob);
        });

    //get live date and time
    function refreshTime() {
        //get latest JSON data
        console.log(inputdata.data[inputdata.data.length-1]);
        let dobvalue = inputdata.data[inputdata.data.length-1].dob;
        //replace - to /
        let dob = dobvalue.replace(/-/g, '/');

        //add year to dob
        let dobAddYear = Number(dobvalue.substr(0, 4)) + 72;
        //console.log(dobAddYear);
        let replacedob = dob.substring(0, 0) +
            dobAddYear +
            dob.substring(0 + 4);
        let formattedreplacedob = replacedob.replace(/[/]/g, '-') + " 00:00:00";

        //let timeDisplay = document.getElementById("time");
        let dateString = new Date().toLocaleString();
        document.getElementById('current-time').innerHTML = dateString;

        //let formattedString = dateString.replace(/[/ :]/g, '/');

        function getSecondDiff(startDate, endDate) {
            let second = 1000;
            return Math.round(
                Math.abs(endDate - startDate) / second
            );
        }

        let formatteddob = dob.replace(/[/]/g, '-') + " 00:00:00";
        //console.log(formattedString);
        //console.log(formatteddob);

        // console.log(getSecondDiff(
        //     new Date(formatteddob),
        //     new Date(dateString),
        // ));

        let ltv = getSecondDiff(
            new Date(formatteddob),
            new Date(dateString),
        );



        let rtv = getSecondDiff(
            new Date(formattedreplacedob),
            new Date(dateString),
        );

        document.getElementById('living-time-value').innerHTML = ltv + " seconds";
        document.getElementById('remaining-time-value').innerHTML = rtv + " seconds";

    }
    setInterval(refreshTime, 1000);

    //Open and connect socket
    let socket = io();
    //Listen for confirmation of connection
    socket.on('connect', function () {
        console.log("Connected");
    });

    /* --- Code to RECEIVE a socket message from the server --- */
    let chatBox = document.getElementById('chat-box-msgs');

    //Listen for messages named 'msg' from the server
    socket.on('msg', function (data) {
        console.log("Message arrived!");
        console.log(data);

        //Create a message string and page element
        let receivedMsg = data.name + ": " + data.msg;
        let msgEl = document.createElement('p');
        msgEl.innerHTML = receivedMsg;

        //Add the element with the message to the page
        chatBox.appendChild(msgEl);
        //Add a bit of auto scroll for the chat box
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    /* --- Code to SEND a socket message to the Server --- */
    let nameInput = document.getElementById('name-input')
    let msgInput = document.getElementById('msg-input');
    let sendButton = document.getElementById('send-button');

    sendButton.addEventListener('click', function () {
        let curName = nameInput.value;
        let curMsg = msgInput.value;
        let msgObj = { "name": curName, "msg": curMsg };
 
        //Send the message object to the server
        socket.emit('msg', msgObj);
    });

})

