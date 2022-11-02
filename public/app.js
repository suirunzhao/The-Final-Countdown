//console.log("Clock worked!")

window.addEventListener('load', function () {

    document.getElementById('calculate').addEventListener('click', () => {

        //grab name
        let name = document.getElementById('name').value;
        //console.log(name);

        //grab dob
        let dobvalue = document.getElementById('dob').value;
        //replace - to /
        dob = dobvalue.replace(/-/g, '/');
        //console.log(dob);

        //create info
        let info = {
            "name": name,
            "dob": dob
        };
        //console.log(info);

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

