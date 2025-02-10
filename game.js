class MultiplicationGame {
  constructor(selectedTable) {
    this.selectedTable = selectedTable;
    this.questionDisplay = document.getElementById('questionDisplay');
    this.problemDisplay = document.getElementById('multiplicationProblem');
    this.optionButtons = [
      document.getElementById('option1'),
      document.getElementById('option2'),
      document.getElementById('option3')
    ];
    this.correctScoreEl = document.getElementById('correctScore');
    this.incorrectScoreEl = document.getElementById('incorrectScore');
    this.questionCountEl = document.getElementById('questionCount');
    this.messageBox = document.getElementById('messageBox');
    this.restartBtn = document.getElementById('restartBtn');
    this.backBtn = document.getElementById('backBtn');
    this.timerDisplay = document.getElementById('timerDisplay');
    this.tableTitle = document.getElementById('tableTitle');

    this.resetGameState(selectedTable);
    this.initGame();
  }

  resetGameState(selectedTable) {
    this.currentMultiplier = selectedTable;
    this.currentMultiplicand = 0;
    this.correctScore = 0;
    this.incorrectScore = 0;
    this.questionCount = 0;
    this.timer = null;
    this.previousMultiplicand = -1;

    // Reset UI elements
    this.correctScoreEl.textContent = '0';
    this.incorrectScoreEl.textContent = '0';
    this.questionCountEl.textContent = '0';
    this.messageBox.textContent = '';

    // Show/hide elements
    this.optionButtons.forEach(btn => {
      btn.style.display = 'block';
      btn.classList.remove('correct', 'incorrect');
      btn.disabled = false;
    });
    this.timerDisplay.style.display = 'block';
    this.timerDisplay.textContent = '5';
    this.restartBtn.style.display = 'none';
    this.backBtn.style.display = 'none';
  }

  initGame() {
    this.tableTitle.textContent = `Tabla del ${this.currentMultiplier}`;

    // Remove any existing event listeners to prevent multiple bindings
    this.optionButtons.forEach(btn => {
      // Clone the button to remove all event listeners
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
    });

    // Re-add event listeners
    this.optionButtons = [
      document.getElementById('option1'),
      document.getElementById('option2'),
      document.getElementById('option3')
    ];
    this.optionButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.checkAnswer(e.target));
    });

    this.restartBtn.onclick = () => this.resetGame();
    this.backBtn.onclick = () => this.backToTableSelection();

    this.generateQuestion();
  }

  backToTableSelection() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    document.getElementById('startScreen').style.display = 'block';
    document.getElementById('gameScreen').style.display = 'none';
  }

  generateQuestion() {
    if (this.questionCount >= 10) {
      this.endGame();
      return;
    }

    this.currentMultiplier = this.selectedTable;
    
    do {
      this.currentMultiplicand = Math.floor(Math.random() * 11);  
    } while (this.currentMultiplicand === this.previousMultiplicand);
    
    this.previousMultiplicand = this.currentMultiplicand;
    
    this.problemDisplay.textContent = `${this.currentMultiplier} × ${this.currentMultiplicand} = `;
    
    const correctAnswer = this.currentMultiplier * this.currentMultiplicand;
    const options = this.generateOptions(correctAnswer);

    this.optionButtons.forEach((btn, index) => {
      btn.textContent = options[index];
      btn.classList.remove('correct', 'incorrect');
      btn.disabled = false;
    });

    this.questionCount++;
    this.questionCountEl.textContent = this.questionCount;

    this.startTimer();
  }

  startTimer() {
    let timeLeft = 5;  
    this.timerDisplay.textContent = timeLeft;
    
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      timeLeft--;
      this.timerDisplay.textContent = timeLeft;

      if (timeLeft === 0) {
        this.handleTimeOut();
      }
    }, 1000);
  }

  handleTimeOut() {
    clearInterval(this.timer);

    this.incorrectScore++;
    this.incorrectScoreEl.textContent = this.incorrectScore;
    this.showMessage('¡Tiempo agotado!', 'red');

    this.optionButtons.forEach(btn => btn.disabled = true);

    setTimeout(() => this.generateQuestion(), 1000);
  }

  generateOptions(correctAnswer) {
    const options = [correctAnswer];
    
    while (options.length < 3) {
      const randomOption = Math.floor(Math.random() * 121);  
      if (!options.includes(randomOption)) {
        options.push(randomOption);
      }
    }

    return options.sort(() => Math.random() - 0.5);
  }

  checkAnswer(selectedButton) {
    clearInterval(this.timer);

    const userAnswer = parseInt(selectedButton.textContent);
    const correctAnswer = this.currentMultiplier * this.currentMultiplicand;

    if (userAnswer === correctAnswer) {
      selectedButton.classList.add('correct');
      this.correctScore++;
      this.correctScoreEl.textContent = this.correctScore;
      this.showMessage('¡Correcto!', 'green');
    } else {
      selectedButton.classList.add('incorrect');
      this.incorrectScore++;
      this.incorrectScoreEl.textContent = this.incorrectScore;
      this.showMessage('¡Incorrecto!', 'red');
    }

    this.optionButtons.forEach(btn => btn.disabled = true);

    setTimeout(() => this.generateQuestion(), 1000);
  }

  showMessage(message, color) {
    this.messageBox.textContent = message;
    this.messageBox.style.color = color;
  }

  endGame() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.questionDisplay.textContent = 'Juego Terminado';
    this.problemDisplay.textContent = '';
    
    this.optionButtons.forEach(btn => {
      btn.style.display = 'none';
    });

    this.timerDisplay.style.display = 'none';

    this.restartBtn.style.display = 'block';
    this.backBtn.style.display = 'block';
    this.messageBox.textContent = ''; 
  }

  resetGame() {
    this.resetGameState(this.selectedTable);
    this.generateQuestion();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('startScreen');
  const gameScreen = document.getElementById('gameScreen');
  
  document.querySelectorAll('.table-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedTable = parseInt(e.target.dataset.table);
      startScreen.style.display = 'none';
      gameScreen.style.display = 'block';
      
      // Ensure any previous game is properly cleaned up
      const existingGame = window.currentGame;
      if (existingGame && existingGame.timer) {
        clearInterval(existingGame.timer);
      }
      
      // Create a new game instance and store it globally
      window.currentGame = new MultiplicationGame(selectedTable);
    });
  });
});
