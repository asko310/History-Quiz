//selectam toate elementele necesare
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left");
const timeCount = document.querySelector(".timer .timer_sec");

//cand apasam butonul start
start_btn.onclick = () => {
    info_box.classList.remove("hidden"); 
    info_box.classList.add("flex"); 
    start_btn.classList.add("hidden");

};
//cand apasam renunta :(
exit_btn.onclick = () => {
    info_box.classList.remove('flex');
    info_box.classList.add("hidden");
    start_btn.classList.remove("hidden");
    start_btn.classList.add("flex");
};


//continua buton
continue_btn.onclick = () => {
    info_box.classList.remove("flex");
    info_box.classList.add("hidden");
    quiz_box.classList.remove("hidden");
    quiz_box.classList.add("flex");
    showQuestions(0);
    queCounter(1);
    startTimer(15);
    startTimerLine(0);
};


let timeValue = 15;
let que_count  = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");
