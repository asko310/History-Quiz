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

restart_quiz.onclick = () => {
    quiz_box.classList.remove("hidden");
    quiz_box.classList.add("flex");
    result_box.classList.remove("flex");
    result_box.classList.add("hidden");

     timeValue = 15;
     que_count  = 0;
     que_numb = 1;
     userScore = 0;
     counter;
     counterLine;
     widthValue = 0;
    showQuestions(que_count);//call showQuestions
    queCounter(que_numb);//passing que_numb value to queCounter
    clearInterval(counter);//clear counter
    clearInterval(counterLine);//clear counterLine
    startTimer(timeValue); //call startTimer function
    startTimerLine(widthValue);
    timeText.textContent = "Time left"; //schimbam textul din timeText in Time Left
    next_btn.classList.add("hidden");


};

//Quit Quiz button
quit_quiz.onclick = ()=>{
    window.location.reload; //da reload la window

};

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

next_btn.onclick = ()=>{
    if (que_count < questions.length - 1){//daca question count este mai mic de que_length
        que_count++;//incrementam valoarea
        que_numb++;//incrementam que_numb
        showQuestions(que_count);//calling showQuestions
        queCounter(que_numb);
        clearInterval(counter);
        clearInterval(counterLine);
        startTimer(timeValue);
        startTimerLine(widthValue);
        timeText.textContent - "Time left";
        next_btn.classList.remove("flex");
        next_btn.classList.add("hidden");

    }else{
        clearInterval(counter);
        clearInterval(counterLine);
        showResult();
    }
};

//luam intrebarile din array
function showQuestions(index){
    const que_text = document.querySelector(".que_text");
    //cream un nou span si div tag intrebare si optiune 
    let que_tag = '<span>' + questions[index].numb + ". " + questions[index].question + '<span>';
    let option_tag = '<div class = "option"><span>' + questions[index].options[0] + '</span></div>'
    + '<div class = "option"><span>' + questions[index].options[1] + '</span></div>'
    + '<div class = "option"><span>' + questions[index].options[2] + '</span></div>'
    + '<div class = "option"><span>' + questions[index].options[3] + '</span></div>';
    que_text.innerHTML = que_tag;
    option_list.innerHTML = option_tag;

    const option = option_list.querySelectorAll(".option");
    //set click attribute to all options
    for(i = 0; i<option.length; i++){
        option[i].setAttribute("onclick","optionSelected(this)");
    }
};