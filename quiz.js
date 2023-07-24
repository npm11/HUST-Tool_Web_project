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

function displayQuiz() {
    var quizDiv = document.getElementById("quiz");
    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];
        var questionDiv = document.createElement("div");
        questionDiv.textContent = question.question;
        for (var j = 0; j < question.answers.length; j++) {
            var answer = question.answers[j];
            var answerInput = document.createElement("input");
            answerInput.type = "radio";
            answerInput.name = "question" + i;
            answerInput.value = j;
            var answerLabel = document.createElement("label");
            answerLabel.textContent = answer;
            questionDiv.appendChild(answerInput);
            questionDiv.appendChild(answerLabel);
        }
        quizDiv.appendChild(questionDiv);
    }
}

function submitQuiz() {
    var score = 0;
    for (var i = 0; i < questions.length; i++) {
        var question = questions[i];
        var answer = document.querySelector('input[name="question' + i + '"]:checked').value;
        if (answer == question.correctAnswer) {
            score++;
        }
    }
    alert("Bạn đã trả lời đúng " + score + " câu hỏi!");
}

displayQuiz();
