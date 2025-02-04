let userName = ''; // Variable to store the user's name
let currentQuestion = 0;
let responses = {};

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
}

// Display a question
function displayQuestion() {
    questionnaireDiv.innerHTML = `
        <h2>Question ${currentQuestion + 1}</h2>
        <audio controls>
            <source src="${randomizedSounds[currentQuestion].fileA}" type="audio/wav">
            Your browser does not support the audio element.
        </audio>
        <audio controls>
            <source src="${randomizedSounds[currentQuestion].fileB}" type="audio/wav">
            Your browser does not support the audio element.
        </audio>
        <div>
            <button onclick="saveResponse('${randomizedSounds[currentQuestion].id}', 'A')">Sound A is brighter</button>
            <button onclick="saveResponse('${randomizedSounds[currentQuestion].id}', 'B')">Sound B is brighter</button>
            <button onclick="saveResponse('${randomizedSounds[currentQuestion].id}', 'Neither')">Neither is brighter</button>
        </div>
    `;
    updateNavigation();
}

// Save the response
function saveResponse(questionId, choice) {
    responses[questionId] = choice;
    console.log(responses); // Debugging purpose
}

// Update navigation buttons
function updateNavigation() {
    prevButton.disabled = currentQuestion === 0;
    nextButton.disabled = currentQuestion === randomizedSounds.length - 1;
}

// Add navigation functionality
prevButton.addEventListener('click', () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion();
    }
});

nextButton.addEventListener('click', () => {
    if (currentQuestion < randomizedSounds.length - 1) {
        currentQuestion++;
        displayQuestion();
    } else if (currentQuestion === randomizedSounds.length - 1) {
        submitData();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#submitButton").addEventListener("click", () => {
        console.log("Submit button clicked. Data being sent...");
        submitData();
    });
});

// Submit data to PHP
function submitData() {
    // console.log("Submit button clicked. Data being sent..."); // Debugging line
    fetch('data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userName, responses}),
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
        const response = await fetch('sounds_list');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}



// Initialize
displayQuestion();
