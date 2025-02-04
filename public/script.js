let userName = ''; // Variable to store the user's name
let currentQuestion = 0;
let totalQuestions = 10;
let answers = [];

const questionnaireDiv = document.getElementById('questionnaire');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

var sounds_list 


// Function to start the questionnaire
document.getElementById('startButton').addEventListener('click', () => {
    userName = document.getElementById('userName').value.trim();
    if (!userName) {
        alert('Please enter your name to begin.');
        return;
    }

    // Hide the name section and show the questionnaire
    document.getElementById('name-section').style.display = 'none';
    // document.getElementById('questionnaire-section').style.display = 'block';
    displayQuestion();
});

// onload function
window.onload = async () => {
    console.log("Page loaded");
    sounds_list = await get_sounds_list();
    console.log(sounds_list);
    displayQuestion();
}

// Display a question
async function displayQuestion() {
    const randomizedSounds = get_couple_sounds();

    soundA = await get_sound(randomizedSounds[0])
    soundB = await get_sound(randomizedSounds[1])

    questionnaireDiv.innerHTML = `
        <h2>Question ${currentQuestion + 1}/${totalQuestions}</h2>
        <audio controls>
            <source src="${soundA}" type="audio/wav">
            Your browser does not support the audio element.
        </audio>
        <audio controls>
            <source src="${soundB}" type="audio/wav">
            Your browser does not support the audio element.
        </audio>
        <div>
            <button onclick="saveResponse('${randomizedSounds[0]}', '${randomizedSounds[1]}', 'false')">they're the same</button>
            <button onclick="saveResponse('${randomizedSounds[0]}', '${randomizedSounds[1]}', 'true')">they're different</button>
        </div>
    `;
}

// Save the response
function saveResponse(soundA, soundB, difference) {
    currentQuestion++;
    const answer = {
        "soundA": soundA,
        "soundB": soundB,
        "difference": difference
    };
    answers.push(answer);
    console.log(answers);

    if (currentQuestion === totalQuestions) {
        conclusion();
    } else {
        displayQuestion();
    }
}

function conclusion() {
    questionnaireDiv.innerHTML = `
    <h2>Thank you for completing the questionnaire!</h2>
    `;
    submitData();
}

// Submit data to PHP
function submitData() {
    // console.log("Submit button clicked. Data being sent..."); // Debugging line
    fetch('data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userName, answers}),
    })
    .then(response => response.text())
    .then(data => {
        alert('Thank you for completing the questionnaire!');
        console.log(data); // Debugging purpose
    })
    .catch(error => console.error('Error:', error));
}

async function get_sounds_list() {
    try {
        const response = await fetch('sounds_list.json');
        return await response.json();
    }
    catch (error) {
        console.error('Error:', error);
        return null;
    }
}


function get_couple_sounds() {
    folders = Object.keys(sounds_list)
    randomFolder = folders[Math.floor(Math.random() * folders.length)]
    sounds = sounds_list[randomFolder]["children"]
    console.log(sounds)
    
    fullSound = sounds.find(sound => sound["name"].includes('_full'))
    
    randomSound = sounds[Math.floor(Math.random() * sounds.length)]

    fullSoundPath = "sounds/"+fullSound["path"]
    randomSoundPath = "sounds/"+randomSound["path"]
    
    soundpPathCouple = [fullSoundPath, randomSoundPath]
    console.log(soundpPathCouple)
    
    soundpPathCouple.sort(() => Math.random() - 0.5)
    return soundpPathCouple
}

async function get_sound(path) {
    console.log(path)
    try {
        const response = await fetch(path);
        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);
    }
    catch (error) {
        console.error('Error:', error);
        return null;
    }
}