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

function showModal(text) {
    var modal = document.getElementById("myModal");
    var modalContent = document.getElementById("modalContent");
    document.getElementById("modalText").textContent = text;
    var yesButton = document.createElement("button");
    yesButton.textContent = "Yes";
    yesButton.onclick = function() {
        modal.style.display = "none";
        if (text === "Bạn có chắc chắn muốn nộp bài không?") {
            localStorage.setItem('myUniqueKey', JSON.stringify({ result: result, score: score }));
            showModal("Bạn đã trả lời đúng " + score + " câu hỏi!");
        }
    };
    var noButton = document.createElement("button");
    noButton.textContent = "No";
    noButton.onclick = function() {
        modal.style.display = "none";
    };
    modalContent.innerHTML = "";
    modalContent.appendChild(yesButton);
    modalContent.appendChild(noButton);
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
            showModal("Bạn chưa trả lời tất cả các câu hỏi!");
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
    showModal("Bạn có chắc chắn muốn nộp bài không?");
    var modal = document.getElementById("myModal");
    modal.onclick = function() {
        modal.style.display = "none";
        localStorage.setItem('myUniqueKey', JSON.stringify({ result: result, score: score }));
        showModal("Bạn đã trả lời đúng " + score + " câu hỏi!");
    }
}
