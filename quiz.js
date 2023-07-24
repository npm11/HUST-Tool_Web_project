var quizzes = {
    ktmt: [
        {
            type: "multiple_choice",
            question: "Câu hỏi 1",
            answers: ["A", "B", "C", "D"],
            correctAnswer: 0
        },
        {
            type: "multiple_choice",
            question: "Câu hỏi 2",
            answers: ["A", "B", "C", "D"],
            correctAnswer: 1
        },
        {
            type: "fill_in",
            question: "Câu hỏi 3",
            correctAnswer: "Đáp án"
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

var quizzes = {
    ktmt: [
        {
            type: "multiple_choice",
            question: "Câu hỏi 1",
            answers: ["A", "B", "C", "D"],
            correctAnswer: 0
        },
        {
            type: "multiple_choice",
            question: "Câu hỏi 2",
            answers: ["A", "B", "C", "D"],
            correctAnswer: 1
        },
        {
            type: "fill_in",
            question: "Câu hỏi 3",
            correctAnswer: "Đáp án"
        },
    ],
};


