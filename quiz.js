(function() {
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
    var currentQuestion = 0;

    function displayQuiz() {
        var quizDiv = document.getElementById("quiz");
        var questionTable = document.getElementById("questionTable");
        quizDiv.innerHTML = "";
        questionTable.innerHTML = "";
        var question = currentQuiz[currentQuestion];
        var questionDiv = document.createElement("div");
        questionDiv.textContent = question.question;
        if (question.type === "multiple_choice") {
            for (var j = 0; j < question.answers.length; j++) {
                var answer = question.answers[j];
                var answerInput = document.createElement("input");
                answerInput.type = "radio";
                answerInput.name = "question" + currentQuestion;
                answerInput.value = j;
                var answerLabel = document.createElement("label");
                answerLabel.textContent = answer;
                questionDiv.appendChild(answerInput);
                questionDiv.appendChild(answerLabel);
            }
        } else if (question.type === "fill_in") {
            var answerInput = document.createElement("input");
            answerInput.type = "text";
            answerInput.name = "question" + currentQuestion;
            questionDiv.appendChild(answerInput);
        }
        quizDiv.appendChild(questionDiv);

        for (var i = 0; i < currentQuiz.length; i++) {
            var questionButton = document.createElement("button");
            questionButton.textContent = "Câu hỏi " + (i + 1);
            questionButton.onclick = (function(index) {
                return function() {
                    currentQuestion = index;
                    displayQuiz();
                };
            })(i);
            questionTable.appendChild(questionButton);
        }

        questionTable.children[currentQuestion].style.backgroundColor = "gray";
    }

    function showConfirmModal(message, confirmCallback) {
        var modal = document.getElementById("confirmModal");
        var span = document.getElementsByClassName("close")[0];
        var yesButton = document.getElementById("confirmModalYes");
        var noButton = document.getElementById("confirmModalNo");
        document.getElementById("confirmModalText").innerText = message;
        modal.style.display = "block";
        yesButton.onclick = function() {
            confirmCallback();
            modal.style.display = "none";
        }
        noButton.onclick = function() {
            modal.style.display = "none";
        }
    }

    function showWarningModal(message, confirmCallback) {
        var modal = document.getElementById("warningModal");
        var span = document.getElementsByClassName("close")[1];
        var yesButton = document.getElementById("warningModalYes");
        var noButton = document.getElementById("warningModalNo");
        document.getElementById("warningModalText").innerText = message;
        modal.style.display = "block";
        yesButton.onclick = function() {
            confirmCallback();
            modal.style.display = "none";
        }
        noButton.onclick = function() {
            modal.style.display = "none";
        }
    }

    function submitQuiz() {
        var score = 0;
        var result = [];
        var unanswered = false;
        for (var i = 0; i < currentQuiz.length; i++) {
            var question = currentQuiz[i];
            var answerInputs = document.getElementsByName("question" + i);
            var answer = null;
            if (question.type === "multiple_choice") {
                for (var j = 0; j < answerInputs.length; j++) {
                    if (answerInputs[j].checked) {
                        answer = j;
                        break;
                    }
                }
            } else if (question.type === "fill_in") {
                answer = answerInputs[0].value;
            }
            if (answer === null || answer === "") {
                unanswered = true;
                console.log("Câu hỏi " + (i + 1) + " chưa được trả lời.");
            }
            if (answer == question.correctAnswer) {
                score++;
            }
            result.push({
                question: question.question,
                correctAnswer: question.correctAnswer,
                userAnswer: answer !== null ? answer : null
            });
        }

        if (unanswered) {
            showWarningModal("Còn câu hỏi chưa được trả lời! Bạn có muốn vẫn nộp bài?", function() {
                // Nộp bài dù có câu chưa trả lời
                console.log("Nộp bài dù có câu chưa trả lời");
                localStorage.setItem('myUniqueKey', JSON.stringify({ result: result, score: score }));
                window.location.href = 'result.html'; // Thay thế hàm showModal
            });
        } else {
            showConfirmModal("Bạn đã hoàn thành tất cả câu hỏi. Bạn có chắc chắn muốn nộp bài?", function() {
                // Nộp bài
                console.log("Nộp bài");
                localStorage.setItem('myUniqueKey', JSON.stringify({ result: result, score: score }));
                window.location.href = 'result.html'; // Thay thế hàm showModal
            });
        }
    }
    document.getElementById("prevQuestion").addEventListener("click", function() {
        if (currentQuestion > 0) {
            currentQuestion--;
            displayQuiz();
        }
    });
    
    document.getElementById("nextQuestion").addEventListener("click", function() {
        if (currentQuestion < currentQuiz.length - 1) {
            currentQuestion++;
            displayQuiz();
        }
    });
    
    var urlParams = new URLSearchParams(window.location.search);
    var quizId = urlParams.get('quiz');
    if (quizId && quizzes[quizId]) {
        currentQuiz = quizzes[quizId];
        displayQuiz();
    }

    // Expose the functions to the global scope
    window.displayQuiz = displayQuiz;
    window.submitQuiz = submitQuiz;
})();
