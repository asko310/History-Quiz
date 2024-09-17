const startBtn = document.querySelector('.start_btn button');
const infoBox = document.querySelector('.info_box');
const quizBox = document.querySelector('.quiz_box');
const resultBox = document.querySelector('.result_box');
const optionList = document.querySelector('.option_list');
const timeCount = document.querySelector('.timer_sec');
const nextBtn = document.querySelector('.next_btn');

//

if (localStorage.getItem('quizTaken') === 'true') {
    startBtn.disabled = true;
    startBtn.textContent = 'Ati realizat deja testul :)';
}

// Questions and options array
let questions = [
        {
            question: "In ce an a murit Ceausescu?",
            options: ["1750","2017","1","prima optiune"],
            answer: "2017"
        },
        {
            question: "In ce an s-a nascut Ceausescu?",
            options: ["1750","2017","1","prima optiune"],
            answer: "1"
        },
        {
            question: "Cati copii a avut Ceausescu?",
            options: ["1","3","2","nu stiu"],
            answer: "nu stiu"
        },
        {
            question: "Cum va simtiti azi?",
            options: ["Bine","Prima optiune","Optiunea 2","al treilea raspuns"],
            answer: "Bine"
        },
        {
            question: "In ce an s-a casatorit Ceausescu?",
            options: ["1750","2017","1","prima optiune"],
            answer: "prima optiune"
        },
        {
            question: "Cati dinti are omul adult?",
            options: ["1","2","rosu sau oranj","verde"],
            answer: "verde"
        },
        {
            question: "Cum se numeste un melc fara casa?",
            options: ["Limax","melc","Francez","businessman"],
            answer: "Limax"
        },
        {
            question: "V-a placut testul?",
            options: ["da","nu prea","nu","nu..."],
            answer: "da"
        },
    

];

let currentQuestion = 0;
let score = 0;
let timer;


// Show the info box when the quiz starts
startBtn.onclick = () => {
    if (localStorage.getItem('quizTaken') === 'true') return; // Nu face nimic dacă testul a fost deja realizat
    infoBox.classList.remove('hidden');
};

// Start the quiz when "Continue" is clicked
document.querySelector('.restart').onclick = () => {
    if (localStorage.getItem('quizTaken') === 'true') return; // Nu face nimic dacă testul a fost deja realizat
    infoBox.classList.add('hidden');
    quizBox.classList.remove('hidden');
    showQuestion(currentQuestion);
    startTimer(15);
};
document.querySelector('.quit').onclick = () => {
    window.location.reload(); // Reload the page
};
// Quit button logic
document.querySelector('.qui').onclick = () => {
    window.location.reload(); // Reload the page
};



// Show the next question
nextBtn.onclick = () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
        clearInterval(timer);
        startTimer(15);
        nextBtn.classList.remove('show');
    } else {
        clearInterval(timer);
        showResult();
    }
};

// Display the current question and options
function showQuestion(index) {
    const questionText = document.querySelector('.que_text');
    let questionTag = `<span>${questions[index].question}</span>`;
    let optionTag = questions[index].options.map(option => `<div class="option">${option}</div>`).join('');
    
    questionText.innerHTML = questionTag;
    optionList.innerHTML = optionTag;
    
    // Add click events to options after rendering
    const options = optionList.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', () => optionSelected(option));
    });
}

// Handle option selection and check if it's correct
function optionSelected(answer) {
    let userAnswer = answer.textContent;
    let correctAnswer = questions[currentQuestion].answer;
    
    // Disable other options after selecting one
    optionList.querySelectorAll('.option').forEach(option => {
        option.classList.add('disabled');
    });

    if (userAnswer === correctAnswer) {
        answer.classList.add("correct");
        score++;
    } else {
        answer.classList.add("incorrect");
        // Automatically highlight the correct answer
        optionList.querySelectorAll('.option').forEach(option => {
            if (option.textContent === correctAnswer) {
                option.classList.add("correct");
            }
        });
    }
    nextBtn.classList.add('show');
}

// Start the countdown timer
function startTimer(time) {
    timer = setInterval(function () {
        timeCount.textContent = time;
        time--;
        if (time < 0) {
            clearInterval(timer);
            timeCount.textContent = "0";
            optionList.querySelectorAll('.option').forEach(option => {
                option.classList.add('disabled');
            });
            nextBtn.classList.add('show');
        }
    }, 1000);
}

// Show the quiz result
function showResult() {
    quizBox.classList.add('hidden');
    resultBox.classList.remove('hidden');
    let scoreText = resultBox.querySelector('.score_text');
    scoreText.innerHTML = `<span> Ai raspuns corect la <p>${score}</p> din <p>${questions.length}</p> intrebari</span>`;

    // Marcare test ca realizat
    localStorage.setItem('quizTaken', 'true');
}


