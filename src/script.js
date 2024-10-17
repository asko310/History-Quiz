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
        question: "Care dintre următoarele a fost principala politică economică a Uniunii Sovietice între 1918 și 1921?",
        options: ["Noua Politică Economică (NEP)", "Comunismul de război", "Planul cincinal", "Colectivizarea agriculturii"],
        answer: "Comunismul de război"
    },
    {
        question: "Ce reformă a fost introdusă de Lenin prin Noua Politică Economică (NEP) în 1921?",
        options: ["Naționalizarea completă a industriei", "Permisiunea limitată a inițiativei private și a pieței libere", "Înființarea kolhozurilor", "Desființarea proprietății private"],
        answer: "Permisiunea limitată a inițiativei private și a pieței libere"
    },
    {
        question: "Ce scop principal avea „Planul cincinal” lansat de Stalin în 1928?",
        options: ["Dezvoltarea agriculturii", "Industrializarea rapidă a Uniunii Sovietice", "Creșterea exporturilor de produse agricole", "Liberalizarea pieței muncii"],
        answer: "Industrializarea rapidă a Uniunii Sovietice"
    },
    {
        question: "Cum a fost afectată agricultura de politicile economice sovietice între 1928 și 1933?",
        options: ["Agricultorii au primit mai multe terenuri pentru proprietatea privată", "A fost introdusă colectivizarea forțată a gospodăriilor țărănești.", "Productivitatea agricolă a crescut dramatic", "A fost promovată agricultura de subzistență"],
        answer: "A fost introdusă colectivizarea forțată a gospodăriilor țărănești."
    },
    {
        question: "Ce consecință majoră a avut colectivizarea forțată a agriculturii asupra populației?",
        options: ["Creșterea producției agricole", "Îmbunătățirea standardului de viață al țăranilor", "Foametea catastrofală din Ucraina și alte regiuni (Holodomor)", "Redistribuirea echitabilă a resurselor alimentare"],
        answer: "Foametea catastrofală din Ucraina și alte regiuni (Holodomor)"
    },
    {
        question: "Ce organizație economică a fost înființată pentru a coordona planificarea centralizată a economiei sovietice?",
        options: ["Comitetul pentru Agricultură", "Gosplan", "Comintern", "Sovietul Suprem"],
        answer: "Gosplan"
    },
    {
        question: "În ce domeniu a investit masiv Uniunea Sovietică în timpul primului Plan cincinal (1928-1932)?",
        options: ["Servicii sociale", "Infrastructura militară", "Industria grea și producția de oțel", "Industria textilă"],
        answer: "Industria grea și producția de oțel"
    },
    {
        question: "Cum a răspuns Uniunea Sovietică la criza economică mondială din 1929?",
        options: ["A redus producția industrială pentru a evita colapsul pieței", "A continuat politica de izolare economică și planificare centralizată", "A împrumutat fonduri de la statele capitaliste", "A început să colaboreze cu alte țări socialiste pentru ajutor economic"],
        answer: "A continuat politica de izolare economică și planificare centralizată"
    },
    {
        question: "Care a fost efectul principal al planificării centralizate asupra economiei sovietice în anii 1930?",
        options: ["Creșterea masivă a industriei grele, dar lipsa bunurilor de consum", "Liberalizarea economiei și creșterea concurenței", "Reducerea birocrației economice", "O tranziție rapidă către economia de piață"],
        answer: "Creșterea masivă a industriei grele, dar lipsa bunurilor de consum"
    },
    {
        question: "Ce măsură economică a fost introdusă de Stalin pentru a elimina opoziția internă împotriva colectivizării și industrializării forțate?",
        options: ["Desființarea completă a proprietății private", "Lansarea „Marilor Epurări”", "Introducerea salariului minim garantat", "Implementarea unei noi legislații privind comerțul liber"],
        answer: "Lansarea „Marilor Epurări”"
    },
];

let currentQuestion = 0;
let score = 0;
let totalTestTime = 120;  // 2 minutes in seconds
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


//localStorage.setItem('quizTaken', 'false');











