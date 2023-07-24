window.onload = function() {
    var data = JSON.parse(localStorage.getItem('myUniqueKey'));
    var result = data.result;
    var score = data.score;
    var resultDiv = document.getElementById("result");
    var scoreText = document.createElement("p");
    scoreText.textContent = "Điểm của bạn: " + score;
    resultDiv.appendChild(scoreText);
    for (var i = 0; i < 3; i++) {
        var resultText = document.createElement("p");
        if (result[i]) {
            resultText.textContent = "Câu " + (i + 1) + ": Đáp án đúng là " + result[i].correctAnswer + ", bạn đã chọn " + result[i].userAnswer;
        } else {
            resultText.textContent = "Câu " + (i + 1) + ": Bạn không chọn đáp án.";
        }
        resultDiv.appendChild(resultText);
    }
};
