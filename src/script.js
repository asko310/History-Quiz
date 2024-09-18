const startBtn = document.querySelector('.start_btn button');
const infoBox = document.querySelector('.info_box');
const quizBox = document.querySelector('.quiz_box');
const resultBox = document.querySelector('.result_box');
const optionList = document.querySelector('.option_list');
const timeCount = document.querySelector('.timer_sec');
const nextBtn = document.querySelector('.next_btn');

//
//salvam in local storage
if (localStorage.getItem('quizTaken') === 'true') {
    startBtn.disabled = true;
    startBtn.textContent = 'Ati realizat deja testul :)';
}

// Array cu intrebari si optiuni
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


// Aratam info box cand apasam start
startBtn.onclick = () => {
    if (localStorage.getItem('quizTaken') === 'true') return; // Nu face nimic dacă testul a fost deja realizat
    infoBox.classList.remove('hidden');
};

// Incepe quiz-ul cand apasam pe continue
document.querySelector('.restart').onclick = () => {
    if (localStorage.getItem('quizTaken') === 'true') return; // Nu face nimic dacă testul a fost deja realizat
    infoBox.classList.add('hidden');
    quizBox.classList.remove('hidden');
    showQuestion(currentQuestion);
    startTimer(15);
};
document.querySelector('.quit').onclick = () => {
    window.location.reload(); // Da reload la pagina cand quit
};
// Quit button logic
document.querySelector('.qui').onclick = () => {
    window.location.reload(); // acelasi lucru dar la urma
};



// Srata urmatoarea intrebare
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

// Arata intrebarea curenta si optiunile
function showQuestion(index) {
    const questionText = document.querySelector('.que_text');
    let questionTag = `<span>${questions[index].question}</span>`;
    let optionTag = questions[index].options.map(option => `<div class="option">${option}</div>`).join('');
    
    questionText.innerHTML = questionTag;
    optionList.innerHTML = optionTag;
    
    // Click events dupa render
    const options = optionList.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', () => optionSelected(option));
    });
}

// Verifica daca optiunea aleasa este corecta
function optionSelected(answer) {
    let userAnswer = answer.textContent;
    let correctAnswer = questions[currentQuestion].answer;
    
    // Dezactiveaza celelalte optiuni dupa ce ai ales una
    optionList.querySelectorAll('.option').forEach(option => {
        option.classList.add('disabled');
    });

    if (userAnswer === correctAnswer) {
        answer.classList.add("correct");
        score++;
    } else {
        answer.classList.add("incorrect");
        // Dam highlight la optiunea corecta
        optionList.querySelectorAll('.option').forEach(option => {
            if (option.textContent === correctAnswer) {
                option.classList.add("correct");
            }
        });
    }
    nextBtn.classList.add('show');
}

// Timer de countdown
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

// Arata rezultatele
function showResult() {
    quizBox.classList.add('hidden');
    resultBox.classList.remove('hidden');
    let scoreText = resultBox.querySelector('.score_text');
    scoreText.innerHTML = `<span> Ai raspuns corect la <p>${score}</p> din <p>${questions.length}</p> intrebari</span>`;

    // Marcheaza testul ca deja realizat
    localStorage.setItem('quizTaken', 'true');
}
//localStorage.setItem('quizTaken', 'false');











