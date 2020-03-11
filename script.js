// Quiz Content
var quiz = {
    questions: [
        "Which of the following languages are not used for web development?", 
        "What style property determines font color?",
        "What is the index of '5' in this array: [4, 8, 5]?",
        "What tag would you use to insert an image?",
        "What type of data is var x = \"50\"?"
    ],
    answers:[
        ["CSS", "Java", "HTML", "Javascript"],
        ["font", "color", "font-color", "text-color"],
        [ "0", "1", "2", "3"],
        ["img", "image", "picture", "insert-image"],
        ["integer", "char", "string", "boolean"]
    ],
    correct:[
        [false, true, false, false],
        [false, true, false, false],
        [false, false, true, false],
        [true, false, false, false],
        [false, false, true, false]
    ]
}


var timerInterval // will be used to track time
var index // track which question we're on
var score // track current score
var highScoreCounter = []

var startTime // track the time you started a question
var EndTime // track the time you ended a question

var container = document.getElementById("container")

var startButton = document.createElement("button")
startButton.textContent = "Click here to begin"
startButton.setAttribute("id", "start")
startButton.addEventListener("click", beginQuiz)
container.appendChild(startButton)

// Set initial details
function beginQuiz(event){
    console.log("Entered quiz")
    container.removeChild(document.getElementById("start"))
    index = 0

    highScoreCounter = JSON.parse(localStorage.getItem("scores"))
    if (highScoreCounter === null){
        highScoreCounter = [0,0,0,0,0]
    }
    console.log(highScoreCounter)
    
    // make the score counter
    var highScore = document.createElement("p")
    highScore.setAttribute("id", "score")
    score = 0;
    highScore.textContent= "Score: "+score
    container.appendChild(highScore)
    // build the timer element
    var timer = document.createElement("h1")
    timer.setAttribute("id", "timer")
    container.appendChild(timer)

    // set up the remaining elements
    buildQuiz(index)
    makeInterval(timer)
}
// set up question and answer elements
function buildQuiz(index){
    // Create the components of the page
    var questionCount = document.createElement("div")
    var question = document.createElement("div")
    var button1 = document.createElement("button")
    var button2 = document.createElement("button")
    var button3 = document.createElement("button")
    var button4 = document.createElement("button")
    // Add attributes to them. Buttons are given an ID to determine which has the right answer
    questionCount.setAttribute("id", "question")
    setButtonDetails(button1, index, "0")
    setButtonDetails(button2, index, "1")
    setButtonDetails(button3, index, "2")
    setButtonDetails(button4, index, "3")
    
    // Append to the page
    container.appendChild(questionCount)
    questionCount.innerHTML = "Question "+(index+1)+":"
    question.innerHTML = quiz.questions[index]
    questionCount.appendChild(question)
    question.appendChild(button1)
    question.appendChild(button2)
    question.appendChild(button3)
    question.appendChild(button4)

    // Set button text
    button1.textContent = quiz.answers[index][0]
    button2.textContent = quiz.answers[index][1]
    button3.textContent = quiz.answers[index][2]
    button4.textContent = quiz.answers[index][3]

    // set event listeners to the buttons
    button1.addEventListener("click", function(event){
        answerClick(event)
    })
    button2.addEventListener("click", function(event){
        answerClick(event)
    })
    button3.addEventListener("click", function(event){
        answerClick(event)
    })
    button4.addEventListener("click", function(event){
        answerClick(event)
    })
}
// Determine if the clicked button was the correct answer
function answerClick(event){
    var answer = event.target.getAttribute("id")
    console.log(answer)

    if (quiz.correct[index][answer])
    {
        console.log("correct")
        endTime = new Date().getTime()
        score += Math.ceil(1000 - (endTime - startTime)/10)
        var highScore = document.getElementById("score")
        highScore.textContent = "Score: " + score
    }
    else{
        console.log("incorrect")
    }
    if (index >= 4){
        clearInterval(timerInterval)
        resetAll()
    }
    else{
        container.removeChild(document.getElementById("question"))
        buildQuiz(++index)
        makeInterval(document.getElementById("timer"))
    }
}
// Run and reset the timer; timer starts at 9 and counts down to 0
// afterward, quiz jumps to the next question
function makeInterval(timer)
{
    clearInterval(timerInterval)
    startTime = new Date().getTime()
    console.log(startTime)
    var secondsRemaining = 9;
    timer.textContent = "remaining time: " + secondsRemaining

    console.log("Reset the timer")
    timerInterval = setInterval(function(){

        console.log("entered timer")
        console.log(secondsRemaining)
        if (secondsRemaining == 0){
            console.log("i = "+index)
            if (index >= 4){
                clearInterval(timerInterval)
                resetAll()
            }
            else{
                startTime = new Date().getTime()
                container.removeChild(document.getElementById("question"))
                secondsRemaining = 10
                buildQuiz(++index)
            }
        }
        secondsRemaining--
        timer.textContent = "remaining time: " + secondsRemaining
    }, 1000)
}
// set button details
function setButtonDetails(button, index, id){
    button.setAttribute("data-index", index)
    button.setAttribute("id", id)
}
function resetAll(){
    container.removeChild(document.getElementById("timer"))
    container.removeChild(document.getElementById("question"))
    container.removeChild(document.getElementById("score"))

    var highScore = document.createElement("h1")
    highScore.textContent = "Your score " + score
    container.appendChild(highScore)

    addToHighScore()
    // Play another round
    startButton.textContent = "Play again"
    startButton.removeEventListener("click", beginQuiz)
    startButton.addEventListener("click", function(){
        console.log("New Quiz selected")
        container.removeChild(highScore)
        beginQuiz(event)
    })
    container.appendChild(startButton)
    container.appendChild(document.createElement("br"))
    var scoreLink = document.createElement("a")
    scoreLink.textContent = "View High Scores"
    scoreLink.setAttribute("href", "highScores.html")
    container.appendChild(scoreLink)
}

function addToHighScore(){
    for(var i=0;i<5;i++){
        if (highScoreCounter[i] < score)
        {
            highScoreCounter.splice(i,0,score)
            highScoreCounter.pop()
            break
        }
    }
    console.log(highScoreCounter)
    localStorage.setItem("scores", JSON.stringify(highScoreCounter))
}
