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
    ],
};

var currentQuiz = null;

var urlParams = new URLSearchParams(window.location.search);
var quizId = urlParams.get('quiz');
if (quizId && quizzes[quizId]) {
    currentQuiz = quizzes[quizId];
    displayQuiz();
}

function showWarningModal(text, callback) {
    var modal = document.getElementById("myModal");
    var modalContent = document.getElementById("modalContent");
    document.getElementById("modalText").textContent = text;
    var continueButton = document.createElement("button");
    continueButton.textContent = "Vẫn nộp bài";
    continueButton.onclick = function() {
        modal.style.display = "none";
        callback();
    };
    var backButton = document.createElement("button");
    backButton.textContent = "Quay lại";
    backButton.onclick = function() {
        modal.style.display = "none";
    };
    modalContent.innerHTML = "";
    modalContent.appendChild(continueButton);
    modalContent.appendChild(backButton);
    modal.style.display = "block";
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function showConfirmModal(text, callback) {
    var modal = document.getElementById("myModal");
    var modalContent = document.getElementById("modalContent");
    document.getElementById("modalText").textContent = text;
    var submitButton = document.createElement("button");
    submitButton.textContent = "Nộp bài";
    submitButton.onclick = function() {
        modal.style.display = "none";
        callback();
    };
    var backButton = document.createElement("button");
    backButton.textContent = "Quay lại";
    backButton.onclick = function() {
        modal.style.display = "none";
    };
    modalContent.innerHTML = "";
    modalContent.appendChild(submitButton);
    modalContent.appendChild(backButton);
    modal.style.display = "block";
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
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
                answer = j;
                break;
            }
        }
        if (answer === null) {
            showWarningModal("Còn câu hỏi chưa được trả lời! Bạn có muốn vẫn nộp bài?", function() {
                // Nộp bài dù có câu chưa trả lời
                console.log("Nộp bài dù có câu chưa trả lời");
                localStorage.setItem('myUniqueKey', JSON.stringify({ result: result, score: score }));
                window.location.href = 'result.html'; // Thay thế hàm showModal
            });
            return;
        }
        if (answer == question.correctAnswer) {
            score++;
        }
        result.push({
            question: question.question,
            correctAnswer: question.answers[question.correctAnswer],
            userAnswer: answer !== null ? question.answers[answer] : null
        });
    }
    showConfirmModal("Bạn đã hoàn thành tất cả câu hỏi. Bạn có chắc chắn muốn nộp bài?", function() {
        // Nộp bài
        console.log("Nộp bài");
        localStorage.setItem('myUniqueKey', JSON.stringify({ result: result, score: score }));
        window.location.href = 'result.html'; // Thay thế hàm showModal
    });
}
