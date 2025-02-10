document.addEventListener("DOMContentLoaded", () => {
    const startScreen = document.getElementById("startScreen");
    const gameScreen = document.getElementById("gameScreen");
    const rankingScreen = document.getElementById("rankingScreen");
    const tableButtons = document.querySelectorAll(".table-btn");
    const questionDisplay = document.getElementById("multiplicationProblem");
    const optionButtons = document.querySelectorAll(".option-btn");
    const correctScoreDisplay = document.getElementById("correctScore");
    const incorrectScoreDisplay = document.getElementById("incorrectScore");
    const questionCountDisplay = document.getElementById("questionCount");
    const messageBox = document.getElementById("messageBox");
    const restartBtn = document.getElementById("restartBtn");
    const backBtn = document.getElementById("backBtn");
    const rankingList = document.getElementById("rankingList");
    const backToStartBtn = document.getElementById("backToStartBtn");
    const resetRankingBtn = document.getElementById("resetRankingBtn");
    let currentTable = 2;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let questionCount = 0;
    let timeLeft = 5;
    let timer;

    tableButtons.forEach(button => {
        button.addEventListener("click", () => {
            currentTable = parseInt(button.dataset.table);
            document.getElementById("tableTitle").textContent = `Tabla del ${currentTable}`;
            startGame();
        });
    });

    function startGame() {
        startScreen.style.display = "none";
        gameScreen.style.display = "block";
        correctAnswers = 0;
        incorrectAnswers = 0;
        questionCount = 0;
        correctScoreDisplay.textContent = "0";
        incorrectScoreDisplay.textContent = "0";
        questionCountDisplay.textContent = "0/10";
        messageBox.textContent = "";
        nextQuestion();
    }

    function nextQuestion() {
        if (questionCount >= 10) {
            endGame();
            return;
        }

        let num = Math.floor(Math.random() * 10);
        let correctAnswer = currentTable * num;
        questionDisplay.textContent = `${currentTable} × ${num} = ?`;
        let answers = generateAnswers(correctAnswer);
        
        optionButtons.forEach((btn, index) => {
            btn.textContent = answers[index];
            btn.classList.remove("correct", "incorrect");
            btn.disabled = false;
            btn.onclick = () => checkAnswer(btn, correctAnswer);
        });

        questionCount++;
        questionCountDisplay.textContent = `${questionCount}/10`;
    }

    function generateAnswers(correctAnswer) {
        let answers = new Set([correctAnswer]);
        while (answers.size < 3) {
            let wrongAnswer = correctAnswer + Math.floor(Math.random() * 5) - 2;
            if (wrongAnswer >= 0) answers.add(wrongAnswer);
        }
        return Array.from(answers).sort(() => Math.random() - 0.5);
    }

    function checkAnswer(button, correctAnswer) {
        let selectedAnswer = parseInt(button.textContent);
        if (selectedAnswer === correctAnswer) {
            button.classList.add("correct");
            correctAnswers++;
            correctScoreDisplay.textContent = correctAnswers;
            messageBox.textContent = "¡Correcto!";
        } else {
            button.classList.add("incorrect");
            incorrectAnswers++;
            incorrectScoreDisplay.textContent = incorrectAnswers;
            messageBox.textContent = "Incorrecto";
        }
        optionButtons.forEach(btn => btn.disabled = true);
        setTimeout(nextQuestion, 1000);
    }

    function endGame() {
        setTimeout(() => {
            gameScreen.style.display = "none";
            rankingScreen.style.display = "block";
            updateRanking(correctAnswers);
        }, 1000);
    }

    function updateRanking(score) {
        let scores = JSON.parse(localStorage.getItem("ranking")) || [];
        scores.push(score);
        scores.sort((a, b) => b - a);
        scores = scores.slice(0, 10);
        localStorage.setItem("ranking", JSON.stringify(scores));
        rankingList.innerHTML = scores.map((s, i) => `<p>${i + 1}. ${s} puntos</p>`).join(" ");
    }

    restartBtn.addEventListener("click", () => {
        gameScreen.style.display = "none";
        startScreen.style.display = "block";
    });

    backBtn.addEventListener("click", () => {
        gameScreen.style.display = "none";
        startScreen.style.display = "block";
    });

    backToStartBtn.addEventListener("click", () => {
        rankingScreen.style.display = "none";
        startScreen.style.display = "block";
    });

    resetRankingBtn.addEventListener("click", () => {
        localStorage.removeItem("ranking");
        rankingList.innerHTML = "";
    });
});
