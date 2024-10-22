// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAMyuZNp5BJzFLb4KLEdojCJu5pTypgzu0",
    authDomain: "live-quiz-3821c.firebaseapp.com",
    projectId: "live-quiz-3821c",
    storageBucket: "live-quiz-3821c.appspot.com",
    messagingSenderId: "887366464770",
    appId: "1:887366464770:web:14ace4d2878220afd5be1b",
    measurementId: "G-PWC5CVKJZ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth services
const db = getFirestore(app);
const auth = getAuth(app);

// DOM Elements
const startBtn = document.querySelector('.start_btn button');
const infoBox = document.querySelector('.info_box');
const quizBox = document.querySelector('.quiz_box');
const resultBox = document.querySelector('.result_box');
const optionList = document.querySelector('.option_list');
const timeCount = document.querySelector('.timer_sec');
const nextBtn = document.querySelector('.next_btn');
const answerInput = document.querySelector('.live_input'); // Input for additional note
const submitAnswer = document.querySelector('.live_btns button'); // Button to submit answer
const answerList = document.querySelector('.answer_list'); // List to display answers
let hasSubmitted = false; // Allow only one submit

// Questions array
let questions = [
    {
        question: "Care a fost unul dintre principalele evenimente care a marcat începutul Marii Crize Economice?",
        options: ["Căderea bursei de valori de la New York", "Declanșarea Primului Război Mondial", "Criza petrolului", "Războiul civil din Rusia"],
        answer: "Căderea bursei de valori de la New York"
    },
    {
        question: "În ce zi este cunoscută prăbușirea pieței bursiere din 1929, denumită \"Marțea Neagră\"?",
        options: ["15 martie 1929", "24 octombrie 1929", "29 octombrie 1929", "10 noiembrie 1929"],
        answer: "29 octombrie 1929"
    },
    {
        question: "Ce sector economic a fost cel mai grav afectat la începutul Marii Crize Economice?",
        options: ["Sectorul agricol", "Sectorul industrial", "Sectorul bancar", "Sectorul comerțului internațional"],
        answer: "Sectorul bancar"
    },
    {
        question: "Ce program a fost introdus de președintele american Franklin D. Roosevelt pentru a combate efectele crizei economice?",
        options: ["New Deal", "Planul Marshall", "Proiectul Manhattan", "Pactul Kellogg-Briand"],
        answer: "New Deal"
    },
    {
        question: "Ce consecință majoră a avut Marea Criză asupra economiei globale?",
        options: ["Scărea ratei șomajului", "Creșterea producției industriale", "Falimentul a numeroase bănci și companii", "Stabilizarea rapidă a economiilor naționale"],
        answer: "Falimentul a numeroase bănci și companii"
    },
    {
        question: "Care dintre următoarele măsuri a fost luată pentru a încerca să stabilizeze economia Statelor Unite în timpul crizei?",
        options: ["Creșterea impozitelor pentru clasa de mijloc", "Închiderea băncilor insolvente și reformarea sistemului bancar", "Reducerea salariilor și pensiilor", "Oprirea completă a investițiilor străine"],
        answer: "Închiderea băncilor insolvente și reformarea sistemului bancar"
    },
    {
        question: "Ce efect social major a avut Marea Criză asupra populației?",
        options: ["Creșterea speranței de viață", "Reducerea semnificativă a șomajului", "Creșterea sărăciei și a migrațiilor interne", "Explozia natalității"],
        answer: "Creșterea sărăciei și a migrațiilor interne"
    },
    {
        question: "Cum a afectat criza economică relații internaționale în perioada interbelică?",
        options: ["A dus la o cooperare internațională sporită", "A amplificat tensiunile economice și politice dintre state", "A determinat o izolare completă a tuturor statelor", "A contribuit la stabilitatea unor noi alianțe militare"],
        answer: "A amplificat tensiunile economice și politice dintre state"
    },
    {
        question: "Ce schimbare majoră a avut loc în politică economică mondială după Marea Criză Economică?",
        options: ["Adoptarea mai largă a politicilor economice de tip laissez-faire", "Creșterea implicării statului în reglementarea economiei", "Eliminarea completă a taxelor vamale", "Creșterea investițiilor externe în țările emergente"],
        answer: "Creșterea implicării statului în reglementarea economiei"
    },
    {
        question: "În această țară se aplică modele de dirijare a economiei pentru a combate efectele crizei?",
        options: ["Germania", "Franța", "Statele Unite ale Americii", "Marea Britanie"],
        answer: "Germania"
    },
];

let currentQuestion = 0;
let score = 0;
let totalTestTime = 240;  // 4 minute
let globalTimer;

// Check if the quiz has already been taken
if (localStorage.getItem('quizTaken') === 'true') {
    startBtn.disabled = true;
    startBtn.textContent = 'Ați realizat deja testul';
}

// Show info box when starting
startBtn.onclick = () => {
    if (localStorage.getItem('quizTaken') === 'true') return; // Do nothing if the quiz has already been taken
    infoBox.classList.remove('hidden');
};

// Start the quiz when clicking continue
document.querySelector('.restart').onclick = () => {
    if (localStorage.getItem('quizTaken') === 'true') return; // Do nothing if the quiz has already been taken
    infoBox.classList.add('hidden');
    quizBox.classList.remove('hidden');
    showQuestion(currentQuestion);
    startGlobalTimer(totalTestTime); // Start the 2-minute timer
};

// Reload page when quitting
document.querySelector('.quit').onclick = () => {
    window.location.reload();
};

document.querySelector('.qui').onclick = () => {
    window.location.reload(); // Same as above
};

// Show next question
nextBtn.onclick = () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
        nextBtn.classList.remove('show');
    } else {
        clearInterval(globalTimer);
        showResult();
    }
};

// Show the current question and options
function showQuestion(index) {
    const questionText = document.querySelector('.que_text');
    let questionTag = `<span>${questions[index].question}</span>`;
    let optionTag = questions[index].options.map(option => `<div class="option">${option}</div>`).join('');
    
    questionText.innerHTML = questionTag;
    optionList.innerHTML = optionTag;
    
    // Click events after rendering
    const options = optionList.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', () => optionSelected(option));
    });
}

// Check if the selected option is correct
function optionSelected(answer) {
    let userAnswer = answer.textContent;
    let correctAnswer = questions[currentQuestion].answer;
    
    // Disable other options after one is selected
    optionList.querySelectorAll('.option').forEach(option => {
        option.classList.add('disabled');
    });

    if (userAnswer === correctAnswer) {
        answer.classList.add("correct");
        score++;
    } else {
        answer.classList.add("incorrect");
        // Highlight the correct option
        optionList.querySelectorAll('.option').forEach(option => {
            if (option.textContent === correctAnswer) {
                option.classList.add("correct");
            }
        });
    }
    nextBtn.classList.add('show');
}

// Timer for the entire test in minutes:seconds format
function startGlobalTimer(time) {
    globalTimer = setInterval(function () {
        let minutes = Math.floor(time / 60); // Calculate minutes
        let seconds = time % 60; // Calculate seconds

        // Add zero in front of seconds if they are less than 10
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        // Display time in minutes:seconds format
        timeCount.textContent = `${minutes}:${seconds}`;

        time--;
        if (time < 0) {
            clearInterval(globalTimer);
            timeCount.textContent = "0:00";
            showResult();
        }
    }, 1000);
}

// Show results
async function showResult() {
    quizBox.classList.add('hidden');
    resultBox.classList.remove('hidden');

    let scoreText = resultBox.querySelector('.score_text');
    scoreText.innerHTML = `<span> Ai raspuns corect la <p>${score}</p> din <p>${questions.length}</p> intrebari</span>`;

    // Mark the quiz as taken and disable the button
    localStorage.setItem('quizTaken', 'true');
    startBtn.disabled = true;
    startBtn.textContent = 'Ați realizat deja testul';

    // Get the current user from Firebase Auth
    const currentUser = auth.currentUser;

    if (currentUser) {
        const userId = currentUser.uid;
        const username = currentUser.displayName || "User"; // Fallback in case displayName is not set
        const userScore = { username, score };

        console.log("Saving score for:", username, "with score:", score); // Debugging log

        try {
            // Add the user's score to Firestore
            await addDoc(collection(db, "scores"), userScore);
            console.log("Score saved successfully");
        } catch (error) {
            console.error("Error saving score:", error);
        }

        // Display the user's name and score in the results
        scoreText.innerHTML += `<br><span>Utilizator: ${username}</span>`;
    } else {
        console.warn("No user is currently logged in.");
        scoreText.innerHTML += `<br><span>Utilizator: Neautorizat</span>`;
    }

    // Display answers
    if (!hasSubmitted) {
        displayAnswers();
    }
}


// Collect and display user answers
async function displayAnswers() {
    const userAnswer = answerInput.value;
    const submittedAnswer = document.createElement('div');
    submittedAnswer.textContent = `Răspunsul tău: ${userAnswer}`;
    answerList.appendChild(submittedAnswer);

    // Clear input after submission
    answerInput.value = '';
    hasSubmitted = true; // Prevent multiple submissions
}

// Submit button action
submitAnswer.addEventListener('click', async () => {
    await displayAnswers();
});
// Function to display scores in the scoreboard
async function displayScores() {
    const scoreboardList = document.querySelector('.scoreboard_list');
    scoreboardList.innerHTML = ""; // Clear previous scores

    const querySnapshot = await getDocs(collection(db, "scores"));
    querySnapshot.forEach((doc) => {
        const scoreData = doc.data();
        const scoreItem = document.createElement('li');
        scoreItem.textContent = `${scoreData.username}: ${scoreData.score} puncte`; // Display the username and score
        scoreboardList.appendChild(scoreItem);
    });
}

// Call displayScores to show all scores when the script loads
displayScores();


localStorage.setItem('quizTaken', 'false');











