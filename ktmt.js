if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
} else {
    alert("Trình duyệt của bạn không hỗ trợ lưu trữ cục bộ. Vui lòng cập nhật trình duyệt của bạn để sử dụng tính năng này.");
}

var questions = [
    {
        question: "Câu hỏi 1",
        answers: ["A", "B", "C", "D"],
        correctAnswer: 0
    },
    {
        question: "Câu hỏi 2",
        answers: ["A", "B", "C", "D"],
        correctAnswer: 1
    },
    // Thêm câu hỏi tại đây
];

var currentQuestion = 0;

function displayQuestionList() {
    var questionListDiv = document.getElementById("questionList");
    for (var i = 0; i < questions.length; i++) {
        var questionButton = document.createElement("button");
        questionButton.textContent = "Câu " + (i + 1);
        questionButton.className = "question-button";
        questionButton.onclick = (function(i) {
            return function() {
                currentQuestion = i;
                displayQuestion();
                updateQuestionButtons();
            };
        })(i);
        questionListDiv.appendChild(questionButton);
    }
}

function displayQuestion() {
    var question = questions[currentQuestion];
    var questionDisplayDiv = document.getElementById("questionDisplay");
    questionDisplayDiv.innerHTML = "";
    var questionText = document.createElement("p");
    questionText.textContent = question.question;
    questionDisplayDiv.appendChild(questionText);
    for (var i = 0; i < question.answers.length; i++) {
        var answer = question.answers[i];
        var answerInput = document.createElement("input");
        answerInput.type = "radio";
        answerInput.name = "answer";
        answerInput.value = i;
        answerInput.checked = i === question.userAnswer;
        answerInput.onchange = (function(i) {
            return function() {
                questions[currentQuestion].userAnswer = i;
                updateQuestionButtons();
            };
        })(i);
        var answerLabel = document.createElement("label");
        answerLabel.textContent = answer;
        questionDisplayDiv.appendChild(answerInput);
        questionDisplayDiv.appendChild(answerLabel);
    }
}

function updateQuestionButtons() {
    var buttons = document.querySelectorAll(".question-button");
    buttons.forEach(function(button, index) {
        if (index === currentQuestion) {
            button.classList.add("current");
        } else {
            button.classList.remove("current");
        }
        if (questions[index].userAnswer !== undefined) {
            button.classList.add("answered");
        } else {
            button.classList.remove("answered");
        }
    });
}

function submitQuiz() {
    var unansweredQuestions = questions.filter(q => q.userAnswer === undefined);
    if (unansweredQuestions.length > 0) {
        openPopup('confirmPopup');
        return;
    }
    confirmSubmit();
}

function confirmSubmit() {
    var score = 0;
    var result = [];
    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];
        var answer = question.userAnswer;
        if (answer === null) {
            alert("Bạn chưa trả lời tất cả các câu hỏi!");
            return;
        }
        if (answer == question.correctAnswer) {
            score++;
        } else {
            result.push({
                question: question.question,
                correctAnswer: question.answers[question.correctAnswer],
                userAnswer: question.answers[answer]
            });
        }
    }
    localStorage.setItem('myUniqueKey', JSON.stringify(result));
    window.location.href = 'result.html';
}

function openPopup(id) {
    document.getElementById(id).style.display = "block";
}

function closePopup(id) {
    document.getElementById(id).style.display = "none";
}

displayQuestionList();
displayQuestion();
