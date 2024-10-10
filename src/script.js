const startBtn = document.querySelector('.start_btn button');
const infoBox = document.querySelector('.info_box');
const quizBox = document.querySelector('.quiz_box');
const resultBox = document.querySelector('.result_box');
const optionList = document.querySelector('.option_list');
const timeCount = document.querySelector('.timer_sec');
const nextBtn = document.querySelector('.next_btn');

let questions = [
    {
        question: "Determină un obiectiv politic al lui Carol al II-lea ",
        options: ["Razboi cu legionarii ","Pace cu legionarii","Alianță militară permanentă cu Germania Nazistă","Promovarea comunismului ca regim de guvernare"],
        answer: "Pace cu legionarii"
    },
    {
        question: "Precizaţi, pe baza textului, condiţia cerută de Carol al II-lea pentru ca Mişcarea Legionară să preia puterea în România.",
        options: ["Carol II să devină lider al Partidului Comunist Român","Carol II să fie proclamat conducător suprem al Gărzii de Fier","Carol II să fie ales în fruntea Frontului Renașterii Naționale pentru salvarea țării","Carol II să fie numit Căpitanul Mișcării Legionare."],
        answer: "Carol II să fie numit Căpitanul Mișcării Legionare."
    },
    {
        question: "Care funcție i se propunea lui Zelea Codreanu? ",
        options: ["Prim-ministru al României","Președinte al Senatului","Șeful guvernului","Ministru al Afacerilor Externe"],
        answer: "Șeful guvernului"
    },
    {
        question: "De ce Corneliu Zelea Codreanu refuză propunerea regelui?",
        options: ["Nu dorea să părăsească cariera sa diplomatică internațională","Plănuia să se retragă din viața publică pentru a se dedica afacerilor personale","Legionarii nu sunt pregătiți pentru guvernare","Nu dorea să colaboreze cu partidele liberale aflate la putere la acea vreme"],
        answer: "Legionarii nu sunt pregătiți pentru guvernare"
    },
    {
        question: "Când are loc lovitura de stat a lui Carol II?",
        options: ["1930","1937","1938","1936"],
        answer: "1938"
    },
    {
        question: "Carol al II era fiul lui... ? ",
        options: ["Alexandru Ioan Cuza","Anatol Durbala","Mihai Viteazul","Ferdinand I"],
        answer: "Ferdinand I"
    },
];

let currentQuestion = 0;
let score = 0;
let totalTestTime = 120;  // 2 minutes in seconds
let globalTimer;

// Verificam daca testul a fost deja realizat
if (localStorage.getItem('quizTaken') === 'true') {
    startBtn.disabled = true;
    startBtn.textContent = 'Ați realizat deja testul';
}

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
    startGlobalTimer(120); // Start the 2-minute timer
};

document.querySelector('.quit').onclick = () => {
    window.location.reload(); // Da reload la pagina cand quit
};

document.querySelector('.qui').onclick = () => {
    window.location.reload(); // acelasi lucru dar la urma
};

// Srata urmatoarea intrebare
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

// Timer pentru intreg testul in format minute:secunde
function startGlobalTimer(time) {
    globalTimer = setInterval(function () {
        let minutes = Math.floor(time / 60); // Calculam minutele
        let seconds = time % 60; // Calculam secundele

        // Adaugam zero in fata secundelor daca sunt sub 10
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        // Afisam timpul in format minute:secunde
        timeCount.textContent = `${minutes}:${seconds}`;

        time--;
        if (time < 0) {
            clearInterval(globalTimer);
            timeCount.textContent = "0:00";
            showResult();
        }
    }, 1000);
}

// Arata rezultatele
function showResult() {
    quizBox.classList.add('hidden');
    resultBox.classList.remove('hidden');
    let scoreText = resultBox.querySelector('.score_text');
    scoreText.innerHTML = `<span> Ai raspuns corect la <p>${score}</p> din <p>${questions.length}</p> intrebari</span>`;

    // Marcheaza testul ca deja realizat si schimba butonul
    localStorage.setItem('quizTaken', 'true');
    startBtn.disabled = true;
    startBtn.textContent = 'Ați realizat deja testul';
}


localStorage.setItem('quizTaken', 'false');











