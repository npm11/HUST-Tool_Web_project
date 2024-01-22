(function () {
  var quizzes = {
    ktmt: [
      // các câu hỏi hiện tại...
      {
        type: "multiple_choice",
        question:
          "Thanh ghi nào có giá trị cố định, không thay đổi trong khi chạy chương trình?",
        answers: ["$at", "$zero", "$sp", "hi", "pc"],
        correctAnswer: 2,
      },
      {
        type: "multiple_choice_multiple_answers",
        question:
          "Trong ứng dụng Mars, khi dịch từ mã nguồn sang mã cơ bản, những công việc nào sau đây sẽ được thực hiện? (có thể chọn nhiều đáp án)",
        answers: [
          "Chuyển các nhãn thành địa chỉ",
          "Chuyển các thanh ghi từ tên sang số hiệu",
          "Chuyển các hằng số từ hệ thập phân sang hệ thập lục phân",
          "Thay thế giả lệnh bằng các lệnh cơ bản",
        ],
        correctAnswer: [0, 1, 3], // Giả sử tất cả các đáp án đều đúng
      },
      {
        type: "fill_in",
        question:
          "Giá trị của thanh ghi $a0 sau khi đoạn chương trình dưới được thực hiện là bao nhiêu? (điền số ở hệ thập phân).\n.text\n\tli $a0, 0\n\tli $a1, 0\n\tli $a2, 5\nl1:\n\tbeq $a1, $a2, end\n\tadd $at, $a1, $s1\n\tadd $a0, $a0, $at\n\taddi $ai, $ai, 1\n\tj l1\nend:",
        correctAnswer: "(?)", // Thay "Đáp án" bằng đáp án thực tế của bạn
      },
      {
        type: "fill_in",
        question:
          "Đoạn chương trình sau in chuỗi ký tự gì ra màn hình Run I/O?\n.text\n\tli $a1, 0\n\tli $a2, 5\n\tli $v0, 11\nl1:\n\tbeq $a1, $a2, end\n\taddi $a0, $a1, 49\n\tsyscall \n\taddi $a1, $a1, 1\n\tj li\nend:",
        correctAnswer: "(?)", // Thay "Đáp án" bằng đáp án thực tế của bạn
      },
      {
        type: "fill_in",
        question:
          "Dịch lệnh sau sang mã máy (viết dưới dạng số hexa có tiền tố 0x đứng trước)\naddi $a1, $a1, 1",
        correctAnswer: "KTMT", // Thay "Đáp án" bằng đáp án thực tế của bạn
      },
      {
        type: "fill_in",
        question: "TEst Q\naddi $a1, $a1, 1",
        correctAnswer: "KTMt", // Thay "Đáp án" bằng đáp án thực tế của bạn
      },
      // thêm thêm câu hỏi...
    ],
  };
  var currentQuestionIndex = 0;
  var userAnswers = null;
  var currentQuiz = null;

  var urlParams = new URLSearchParams(window.location.search);
  var quizId = urlParams.get("quiz");
  if (quizId && quizzes[quizId]) {
    currentQuiz = quizzes[quizId];
    userAnswers = new Array(currentQuiz.length).fill(null); // Khởi tạo userAnswers sau khi currentQuiz đã được khởi tạo
    displayQuiz();
  }
  var time = 120 * 60;

  function startCountdown() {
    var countdownElement = document.getElementById("countdown");

    var interval = setInterval(function () {
      var hours = Math.floor(time / 3600);
      var minutes = Math.floor((time % 3600) / 60);
      var seconds = time % 60;

      countdownElement.textContent =
        (hours < 10 ? "0" + hours : hours) +
        ":" +
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds);

      time--;

      if (time < 0) {
        clearInterval(interval);
        // Thực hiện hành động khi hết thời gian, ví dụ: tự động nộp bài
        // submitQuiz();
      }
    }, 1000);
  }

  // Bắt đầu đếm ngược khi trang web tải xong
  window.onload = startCountdown;
  // Kết thúc đoạn mã đếm ngược thời gian
  function displayQuiz() {
    var quizDiv = document.getElementById("quiz");
    quizDiv.innerHTML = "";
    var question = currentQuiz[currentQuestionIndex];
    var questionDiv = document.createElement("div");
    questionDiv.style.marginBottom = "20px"; // Tạo khoảng cách giữa các cụm câu hỏi-đáp án
    var questionText = document.createElement("p");
    questionText.textContent =
      currentQuestionIndex + 1 + ". " + question.question.split("\n")[0]; // Thêm số thứ tự cho câu hỏi
    questionText.style.fontWeight = "bold"; // Làm cho câu hỏi in đậm
    questionDiv.appendChild(questionText);
    if (question.question.includes("\n")) {
      var codeBlock = document.createElement("pre");
      var code = document.createElement("code");
      code.textContent = question.question.split("\n").slice(1).join("\n");
      codeBlock.appendChild(code);
      questionDiv.appendChild(codeBlock);
    }
    if (question.type === "multiple_choice") {
      for (var j = 0; j < question.answers.length; j++) {
        var answer = question.answers[j];
        var answerInput = document.createElement("input");
        answerInput.type = "radio";
        answerInput.name = "question" + currentQuestionIndex;
        answerInput.value = j;
        if (userAnswers[currentQuestionIndex] == j) {
          answerInput.checked = true;
        }
        var answerLabelPrefix = document.createElement("label");
        answerLabelPrefix.textContent = String.fromCharCode(65 + j) + "."; // Thêm dấu cách sau dấu chấm
        answerLabelPrefix.className = "answer-prefix";
        var answerLabel = document.createElement("label");
        answerLabel.textContent = answer;
        questionDiv.appendChild(answerInput);
        questionDiv.appendChild(answerLabelPrefix);
        questionDiv.appendChild(answerLabel);
        questionDiv.appendChild(document.createElement("br")); // Thêm một dòng mới sau mỗi đáp án
      }
    } else if (question.type === "multiple_choice_multiple_answers") {
      for (var j = 0; j < question.answers.length; j++) {
        var answer = question.answers[j];
        var answerInput = document.createElement("input");
        answerInput.type = "checkbox";
        answerInput.name = "question" + currentQuestionIndex;
        answerInput.value = j;
        if (
          userAnswers[currentQuestionIndex] &&
          userAnswers[currentQuestionIndex].includes(j)
        ) {
          answerInput.checked = true;
        }
        var answerLabelPrefix = document.createElement("label");
        answerLabelPrefix.textContent = String.fromCharCode(65 + j) + "."; // Thêm dấu cách sau dấu chấm
        answerLabelPrefix.className = "answer-prefix";
        var answerLabel = document.createElement("label");
        answerLabel.textContent = answer;
        questionDiv.appendChild(answerInput);
        questionDiv.appendChild(answerLabelPrefix);
        questionDiv.appendChild(answerLabel);
        questionDiv.appendChild(document.createElement("br")); // Thêm một dòng mới sau mỗi đáp án
      }
    } else if (question.type === "fill_in") {
      var answerInput = document.createElement("input");
      answerInput.type = "text";
      answerInput.name = "question" + currentQuestionIndex;
      answerInput.value = userAnswers[currentQuestionIndex] || "";
      questionDiv.appendChild(answerInput);
    }
    quizDiv.appendChild(questionDiv);

    // Thêm danh sách câu hỏi ở bên trái
    var questionListDiv = document.getElementById("questionList");
    questionListDiv.innerHTML = "";
    questionListDiv.style.border = "3px solid #007BFF"; // Thay đổi màu viền
    questionListDiv.style.padding = "10px"; // Thêm padding cho khung
    questionListDiv.style.height = "330px"; // Đặt chiều cao cố định
    questionListDiv.style.overflow = "auto"; // Hiển thị thanh cuộn nếu cần
    questionListDiv.style.borderRadius = "20px"; // Bo góc của khung
    questionListDiv.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)"; // Thêm hiệu ứng đổ bóng
    for (var i = 0; i < currentQuiz.length; i++) {
      var questionButton = document.createElement("button");
      questionButton.textContent = (i + 1).toString(); // Hiển thị chỉ số câu hỏi thay vì "Câu " + (i + 1)
      questionButton.className = "btn btn-primary m-1";
      questionButton.onclick = (function (index) {
        return function () {
          saveAnswer(currentQuestionIndex);
          currentQuestionIndex = index;
          displayQuiz();
        };
      })(i);
      questionListDiv.appendChild(questionButton);
    }
  }
  function saveAnswer(index) {
    var answerInputs = document.getElementsByName("question" + index);
    if (currentQuiz[index].type === "multiple_choice") {
      for (var j = 0; j < answerInputs.length; j++) {
        if (answerInputs[j].checked) {
          userAnswers[index] = j;
          break;
        }
      }
    } else if (currentQuiz[index].type === "multiple_choice_multiple_answers") {
      userAnswers[index] = [];
      for (var j = 0; j < answerInputs.length; j++) {
        if (answerInputs[j].checked) {
          userAnswers[index].push(j);
        }
      }
    } else if (currentQuiz[index].type === "fill_in") {
      userAnswers[index] = answerInputs[0].value;
    }
  }
  function showConfirmModal(message, confirmCallback) {
    var modal = document.getElementById("confirmModal");
    var span = document.getElementsByClassName("close")[0];
    var yesButton = document.getElementById("confirmModalYes");
    var noButton = document.getElementById("confirmModalNo");
    document.getElementById("confirmModalText").innerText = message;
    modal.style.display = "block";
    yesButton.onclick = function () {
      confirmCallback();
      modal.style.display = "none";
    };
    noButton.onclick = function () {
      modal.style.display = "none";
    };
  }

  function showWarningModal(message, confirmCallback) {
    var modal = document.getElementById("warningModal");
    var span = document.getElementsByClassName("close")[1];
    var yesButton = document.getElementById("warningModalYes");
    var noButton = document.getElementById("warningModalNo");
    document.getElementById("warningModalText").innerText = message;
    modal.style.display = "block";
    yesButton.onclick = function () {
      confirmCallback();
      modal.style.display = "none";
    };
    noButton.onclick = function () {
      modal.style.display = "none";
    };
  }
  function submitQuiz() {
    saveAnswer(currentQuestionIndex); // Lưu câu trả lời cuối cùng

    var score = 0;
    var result = [];
    var unanswered = false;
    for (var i = 0; i < currentQuiz.length; i++) {
      var question = currentQuiz[i];
      var answer = userAnswers[i];
      if (
        answer === null ||
        answer === "" ||
        (Array.isArray(answer) && answer.length === 0)
      ) {
        unanswered = true;
        console.log("Câu hỏi " + (i + 1) + " chưa được trả lời.");
      }
      if (Array.isArray(answer) && Array.isArray(question.correctAnswer)) {
        if (
          answer.length === question.correctAnswer.length &&
          answer.every((v, k) => question.correctAnswer.includes(v))
        ) {
          score++;
        }
      } else if (answer === question.correctAnswer) {
        // Sử dụng toán tử === thay vì ==
        score++;
      }
      result.push({
        question: question.question,
        correctAnswer: question.correctAnswer,
        userAnswer: answer !== null ? answer : null,
      });
    }

    if (unanswered) {
      showWarningModal(
        "Còn câu hỏi chưa được trả lời! Bạn vẫn muốn nộp bài?",
        function () {
          // Nộp bài dù có câu chưa trả lời
          console.log("Nộp bài dù có câu chưa trả lời");
          localStorage.setItem(
            "myUniqueKey",
            JSON.stringify({ result: result, score: score })
          );
          window.location.href = "src/html/result.html"; // Thay thế hàm showModal
        }
      );
    } else {
      showConfirmModal(
        "Bạn đã hoàn thành tất cả câu hỏi. Bạn có chắc chắn muốn nộp bài?",
        function () {
          // Nộp bài
          console.log("Nộp bài");
          localStorage.setItem(
            "myUniqueKey",
            JSON.stringify({ result: result, score: score })
          );
          window.location.href = "src/html/result.html"; // Thay thế hàm showModal
        }
      );
    }
  }

  var urlParams = new URLSearchParams(window.location.search);
  var quizId = urlParams.get("quiz");
  if (quizId && quizzes[quizId]) {
    currentQuiz = quizzes[quizId];
    displayQuiz();
  }

  // Expose the functions to the global scope
  window.displayQuiz = displayQuiz;
  window.submitQuiz = submitQuiz;
})();
