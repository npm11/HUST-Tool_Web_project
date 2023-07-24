window.onload = function() {
    var data = JSON.parse(localStorage.getItem('myUniqueKey'));
    if (data === null) {
        document.getElementById("result").textContent = "Bạn chưa tham gia thi.";
        return;
    }
    var result = data.result;
    var score = data.score;
    var resultDiv = document.getElementById("result");
    var scoreText = document.createElement("p");
    scoreText.textContent = "Điểm của bạn: " + score;
    resultDiv.appendChild(scoreText);
    for (var i = 0; i < result.length; i++) {
        var resultText = document.createElement("p");
        if (result[i].userAnswer !== null) {
            resultText.textContent = result[i].question + ": Đáp án đúng là " + result[i].correctAnswer + ", bạn đã chọn " + result[i].userAnswer;
        } else {
            resultText.textContent = result[i].question + ": Bạn không chọn đáp án.";
        }
        resultDiv.appendChild(resultText);
    }
    localStorage.removeItem('myUniqueKey'); // Xóa dữ liệu từ localStorage
};
