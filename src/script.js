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
    startBtn.textContent = 'Ati realizat deja testul';
}

// Array cu intrebari si optiuni
let questions = [
        {
            question: "totalitatea sistemelor politice care definesc relația dintre stat și societate, când societatea controlează statul regimul politic este unul democratic iar când statul controlează societatea regimul politic este totalitar.",
            options: ["Totalitarism","Democratie","Regim politic","Regim militar"],
            answer: "Regim politic"
        },
        {
            question: "formă de organizare şi funcţionare a societăţii în care statul controlează toate aspectele vieţii sociale şi individuale.",
            options: ["Democratie","Regim militar","Totalitarism","Regim Politic"],
            answer: "Totalitarism"
        },
        {
            question: "Formă de organizare și de conducere politică a societății, care proclamă suveranitatea poporului. Formă de guvernare a statului, bazată pe separația puterilor și pe votul universal.",
            options: ["Democratie","Totalitarism","Regim Politic","Regim militar"],
            answer: "Democratie"
        },
        {
            question: "In ce an s-a instaurat regimul totalitar in Rusia?",
            options: ["2024","1917","1918","1916"],
            answer: "1917"
        },
        {
            question: "In ce an s-a instaurat regimul totalitar in Italia?",
            options: ["1917","1922","1918","1924"],
            answer: "1922"
        },
        {
            question: "In ce an s-a instaurat regimul totalitar in Germania?",
            options: ["1920","1924","1933","1934"],
            answer: "1933"
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











