//console.log("Clock worked!")

window.addEventListener('load', function () {
    //grab the data from the database using fetch() on page route
    fetch('/data')
        .then(res => res.json())
        .then(data => {
            console.log(data);
        });

    document.getElementById('calculate').addEventListener('click', () => {

        //grab name
        let name = document.getElementById('name').value;
        console.log(name);

        //grab dob
        let dobvalue = document.getElementById('dob').value;
        //replace - to /
        dob = dobvalue.replace(/-/g, '/');
        console.log(dob);

        //add year to dob
        let dobAddYear = Number(dobvalue.substr(0, 4)) + 72;
        //console.log(dobAddYear);
        let replacedob = dob.substring(0, 0) +
            dobAddYear +
            dob.substring(0 + 4);
        let formattedreplacedob = replacedob.replace(/[/]/g, '-') + " 00:00:00";
        //console.log(replacedob);

        //create info
        let info = {
            "name": name,
            "dob": dob
        };
        console.log(info);

        //make info JSON
        let infoJSON = JSON.stringify(info);
        console.log(infoJSON);

        //send the JSON object to the server
        fetch('/infoSave', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: infoJSON
        })
            .then(res => res.json())
            .then(data => {
                console.log("work?");
                console.log(data);
            })

        //get live date and time
        function refreshTime() {
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

    })



})

