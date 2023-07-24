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
        questionButton.onclick = (function(i) {
            return function() {
                currentQuestion = i;
                displayQuestion();
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
        var answerLabel = document.createElement("label");
        answerLabel.textContent = answer;
        questionDisplayDiv.appendChild(answerInput);
        questionDisplayDiv.appendChild(answerLabel);
    }
}

function submitQuiz() {
    var score = 0;
    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];
        var answerInputs = document.getElementsByName("answer");
        var answer = null;
        for (var j = 0; j < answerInputs.length; j++) {
            if (answerInputs[j].checked) {
                answer = answerInputs[j].value;
                break;
            }
        }
        if (answer === null) {
            alert("Bạn chưa trả lời tất cả các câu hỏi!");
            return;
        }
        if (answer == question.correctAnswer) {
            score++;
        }
    }
    if (!confirm("Bạn có chắc chắn muốn nộp bài không?")) {
        return;
    }
    alert("Bạn đã trả lời đúng " + score + " câu hỏi!");
}

displayQuestionList();
displayQuestion();
