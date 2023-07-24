window.onload = function() {
    var result = JSON.parse(localStorage.getItem('result'));
    var resultDiv = document.getElementById("result");
    for (var i = 0; i < result.length; i++) {
        var resultText = document.createElement("p");
        resultText.textContent = "Câu " + (i + 1) + ": Đáp án đúng là " + result[i].correctAnswer + ", bạn đã chọn " + result[i].userAnswer;
        resultDiv.appendChild(resultText);
    }
};
