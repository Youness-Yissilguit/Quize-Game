let countQues = document.querySelector('.game-info .count span');
let quizArea = document.querySelector('.question-container');
let pagination = document.querySelector('.pagination');
let submitBtn = document.querySelector('.game-param .submit-btn');
let countdown = document.querySelector('.counter .time');
//set opations
let curtentIndex = 0;
let rightAnswers = 0;
let counterInterval;
function getQuestions(){
  let myRequest = new XMLHttpRequest();


  myRequest.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){

      let questionObject = JSON.parse(this.response);

      let questionNum = questionObject.length;//number of questions

      //add the number of questions
      addQuestinsNum(questionNum);

      //Get and add Question From data
      setQuestion(questionObject[curtentIndex], questionNum);

      //start the counter
      countdouwn(10, questionNum);

      //click the submit button
      submitBtn.onclick = function(e) {
        e.preventDefault();

        //Get The corrrect Inswers
        let correctAns = questionObject[curtentIndex]['right_answer'];

        //Incress the index
        curtentIndex++;

        //check the answer
        checkAnswer(correctAns, questionNum);
        //Get and add new Question From data
        setQuestion(questionObject[curtentIndex], questionNum);
        //handel pagination classes
        hundelPagination(questionNum);
        //clear and start a new counter
        clearInterval(counterInterval);
        countdouwn(10, questionNum)
        //show resault
        showResult(questionNum);
      }

    }
  }

  myRequest.open("GET", "question.json", true);
  myRequest.send();
};

getQuestions();


function addQuestinsNum(num){
  countQues.innerHTML = num;
  for (let i = 0; i < num; i++){
    span = document.createElement("span");
    if(i === 0){
      span.className = "on";
    }
    pagination.appendChild(span);
  }
}

function setQuestion(currentQuestion, questionCount){

  //make the quize area empty
  quizArea.innerHTML = '';

  if(curtentIndex < questionCount){
    //create the question
    let ques = document.createElement("h2");
    ques.className = "question";
    ques.appendChild(document.createTextNode(currentQuestion.title));
    quizArea.appendChild(ques);
    //create the answers
    for(let i = 1; i <= 4; i++){
      //the div
      let mainDiv = document.createElement('div');
      mainDiv.className = "Prospect";
      //the span
      let span = document.createElement('span');
      span.appendChild(document.createTextNode(i));
      mainDiv.appendChild(span);
      //the input
      let radio = document.createElement('input');
      radio.setAttribute('type', 'radio');
      radio.setAttribute('name', 'answer');
      radio.id = `answer_${i}`;
      radio.dataset.theanswer = currentQuestion[`answer_${i}`];
      mainDiv.appendChild(radio);
      //make the first input checked
      if (i === 1) {
        radio.checked = true
      }
      //the answer
      let answer = document.createElement('label');
      answer.htmlFor = (`answer_${i}`);
      answer.appendChild(document.createTextNode(currentQuestion[`answer_${i}`]));
      mainDiv.appendChild(answer);
      quizArea.appendChild(mainDiv);
    }
  }

}
function checkAnswer(rightAns, qNum){

  let answers = document.getElementsByName('answer');
  let choosenAnswer;
  for (let i = 0; i < answers.length; i++){
    if(answers[i].checked){
      choosenAnswer = answers[i].dataset.theanswer;
    }
  }
  if (choosenAnswer === rightAns) {
    rightAnswers++;
  }
}
function hundelPagination(questionCount){
  if (curtentIndex < questionCount) {
    document.querySelector('.pagination span.on').classList.remove('on');
    document.querySelectorAll('.pagination span')[curtentIndex].classList.add('on');
  }
}
function showResult(count){
  if (curtentIndex === count) {
    quizArea.remove();
    submitBtn.remove();
    pagination.remove();
    let resultNum = document.querySelector('.result span');
    if (rightAnswers <= 3) {
      resultNum.style.color = "red";
      document.querySelector('.bad').classList.add('show');
    } else if(rightAnswers > 3 || rightAnswers <=5){
      resultNum.style.color = "blue";
      document.querySelector('.good').classList.add('show');
    } else{
      resultNum.style.color = "green";
      document.querySelector('.perfect').classList.add('show');
    }
    resultNum.innerHTML = rightAnswers;
    document.querySelector('.result').classList.add('show');
    document.querySelector('.refresh').classList.add('show');
    document.querySelector('.audio').play();
  }
}

function countdouwn(duration, count){
  if (curtentIndex < count) {
    let minute, second;
    counterInterval = setInterval(function(){
      duration--;
      minute = parseInt(duration / 60);
      second = parseInt(duration % 60);
      minute = minute < 10 ? `0${minute}` : minute;
      second = second < 10 ? `0${second}` : second;

      countdown.innerHTML = `${minute} : ${second}`;
      if (duration == 0) {
        clearInterval(counterInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}
document.querySelector('.refresh').onclick = function(){
  location.reload(); 
}
