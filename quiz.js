var quizzes = {
    ktmt: [
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
        {
            question: "Câu hỏi 3",
            answers: ["A", "B", "C", "D"],
            correctAnswer: 2
        },
        // Thêm câu hỏi tại đây
    ],
    // Thêm bộ đề thi tại đây
};

var currentQuiz = null;

function loadQuiz() {
    var quizSelect = document.getElementById("quizSelect");
    var quizId = quizSelect.value;
    currentQuiz = quizzes[quizId];
    displayQuiz();
}

function displayQuiz() {
    var quizDiv = document.getElementById("quiz");
    quizDiv.innerHTML = "";
    for (var i = 0; i < currentQuiz.length; i++) {
        var question = currentQuiz[i];
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
    var result = [];
    for (var i = 0; i < currentQuiz.length; i++) {
        var question = currentQuiz[i];
        var answerInputs = document.getElementsByName("question" + i);
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
        if (answer == question.answers[question.correctAnswer]) {
            score++;
        }
        result.push({
            correctAnswer: question.answers[question.correctAnswer],
            userAnswer: question.answers[answer]
        });
    }
    if (!confirm("Bạn có chắc chắn muốn nộp bài không?")) {
        return;
    }
    localStorage.setItem('myUniqueKey', JSON.stringify({ result: result, score: score }));
    alert("Bạn đã trả lời đúng " + score + " câu hỏi!");
}

