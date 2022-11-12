<h1>Project 2: The Final Countdown</h1>

<h3>Team:</h3> Nicole Padilla & Suirun (Siri) Zhao

<h3>Link to the project:</h3>

[https://final-countdown-for-submission.glitch.me/](https://final-countdown-for-submission.glitch.me/)

<h3>Concept Write-Up:</h3>

Using data input from the interactor, the countdown clock will countdown back to your current age from 75 years old, which research shows is the average world life expectancy.

We were feeling spooky coming off of Halloween, but there may be the opportunity to include tips/facts to living a longer/healthier life or more inspiration to make the most of your lifetime.

<h3>Initial Concept: 3-Page Experience:</h3>

1. **Splash page:**
    1. Title
    2. Image
    3. Enter button
    4. Potential: ambiance music
2. **Submission page:**
    1. Input fields
        1. Name
        2. Date of Birth
    2. Submit Button
3. **“Tombstone Leaderboard”**
    1. Name from submitted user
    2. “Time left” based on a countdown from 75 years old life expectancy

<h3>Production decisions (i.e. technical, design, creative, etc.)</h3>

Our initial wireframes consisted of a 3-page layout, but this created difficulty in passing data from one page to another. Through discussion/solutioning with Craig, we decided to collapse the experience into two pages:

**Page 1:** 

Landing Page to set the stage for the experience with imagery, sound, and CSS styling.

**Page 2:** 

Input fields + Calculation

Calculated timing & “Tombstone” list/leaderboard t showcase the sorted data

In addition, after we shared the initial concept in class, we received feedback that 75 years old would prevent participation, and this led to us considering the following questions: 

• What would happen if the interactor was over 75 years old? 

• What if someone put in a birthdate in the future?

Solution: we decided to increase the count-back age to 100 years old.

• With this direction, we also included an experience output for people over 100 and for birthdates set in the future, so the experience was fully functional for any situation. The “Long Live [insert name of interactor]” message will appear on the screen if either of those scenarios is input for calculation.

**Describe collaboration (i.e. distribution/sharing of work and responsibilities) if relevant**

The initial concept came with some prework completed by Siri, around the input fields/time calculation to illustrate the initial thinking behind how this would work. Siri did a lot of heavy lifting in building out the code, including the database work for the page 2 interaction.

Nicole refined the conceptual elements and user experience in collaboration with Siri, such as imagery, copy, styling, project name, sound elements, and solutions for the tombstone concept, and created the landing page experience.

We often met over Zoom to discuss direction, progress, and troubleshooting, as well as chatting via Discord and working in Glitch.

<h3>Major challenges and solutions (i.e. the most difficult aspects of the project for you and how you attempted to address them)</h3>

General: Time differences were not a blocker but proved challenging. It wasn't easy to distribute work in a way that felt completely equitable at times.

1. In order to calculate the seconds between two different dates, the first step is to grab the input date and transform the format using .replace, then using .substr to separate the year and add 75(100) to get an expected date. The final step is to create a function that uses Math.round to get the seconds, and also add a conditional statement to prevent the user wants to test the date before 100 years or in the future.

``` Ruby
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
```

2. To collapse the experience into two pages, we separate pages with different div in HTML and use .style.display = ‘none’/‘’ in JS to hide or show the different div.

``` Ruby
document.getElementById('calculate').addEventListener('click', () => {
        //clear
        document.getElementsByClassName("input-info")[0].style.display = 'none';
        document.getElementsByClassName("output-info")[0].style.display = '';
        document.getElementsByClassName("chat-feed")[0].style.display = 'none';
        document.getElementsByClassName("long-live")[0].style.display = 'none';
};
```

3. Using for loop and document.createElement('p') to collect the history messages and display them on the last page.
``` Ruby
for (let i = 0; i < data.data.length; i++) {
    let pastMsg = data.data[i].info.name + ": '" + data.data[i].info.message + "'" + " " + data.data[i].info.rtv + " left";
    let oldMsg = document.createElement('p');
    oldMsg.innerHTML = pastMsg;
    chatBox.appendChild(oldMsg);
    }
```
4. As for the challenge of how to sort history messages by time, we add a date tag when the user clicks the button to upload their information and sort the NeDB database using .sort({ date: 1 }) in the index.js file.
``` Ruby
//create a GET route to send the data
app.get('/data', (req, res) => {
    console.log("A GET req for the data")
    /* ------find and sort nedb data-------*/
    db.find({}).sort({ date: 1 }).exec((err, docs) => {
        console.log(docs);
        let allInfo = { "data": docs };
        //Send a response back to the client
        res.json(allInfo);
    })
});
```
5. For the landing page we used Midjourney to generate cover image.

![Siri_Graveyard_Tombstone_dark_9f8cba2e-8c8b-4857-a28c-1980e6ba9d61](https://user-images.githubusercontent.com/102000475/201457467-2cf33274-a2a5-44df-875c-41866cfdaacd.png)

![Siri_Graveyard_Tombstone_dark_3a4c5fd2-b92b-41ff-9ac3-3a58a51e2e5f](https://user-images.githubusercontent.com/102000475/201457465-0e7557a2-9d39-4492-b36c-da5cea653523.png)
