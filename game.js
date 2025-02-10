class Ranking {
  constructor() {
      this.rankingKey = 'multiplicationGameRanking';
      this.ranking = this.getRanking();
  }

  getRanking() {
      const ranking = localStorage.getItem(this.rankingKey);
      return ranking ? JSON.parse(ranking) : [];
  }

  saveRanking() {
      localStorage.setItem(this.rankingKey, JSON.stringify(this.ranking));
  }

  addScore(name, table, correctAnswers) {
      const score = correctAnswers * (2 + (table - 2) * 0.1); // Fórmula para calcular la puntuación
      const newEntry = { name, table, score };

      this.ranking.push(newEntry);
      this.ranking.sort((a, b) => b.score - a.score); // Ordenar de mayor a menor
      this.ranking = this.ranking.slice(0, 10); // Mantener solo las 10 mejores

      this.saveRanking();
  }

  resetRanking() {
      this.ranking = []; // Vacía el ranking
      this.saveRanking(); // Guarda el ranking vacío en localStorage
      this.displayRanking(); // Actualiza la visualización del ranking
  }

  displayRanking() {
      const rankingContainer = document.getElementById('rankingList');
      rankingContainer.innerHTML = '';

      const list = document.createElement('ol');
      this.ranking.forEach((entry, index) => {
          const listItem = document.createElement('li');
          listItem.textContent = `${index + 1}. ${entry.name} - Tabla del ${entry.table} - Puntuación: ${entry.score.toFixed(1)}`;
          list.appendChild(listItem);
      });

      rankingContainer.appendChild(list);
      document.getElementById('rankingScreen').style.display = 'block';
  }
}

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

      // Cargar sonidos
      this.correctSound = new Audio('correct.mp3');
      this.incorrectSound = new Audio('incorrect.mp3');
      this.timeoutSound = new Audio('timeout.mp3');

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

      // Remove existing event listeners
      this.optionButtons.forEach(btn => {
          btn.removeEventListener('click', this.checkAnswer);
      });

      // Re-add event listeners
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

      // Reproducir sonido de tiempo agotado
      this.timeoutSound.play();

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

          // Reproducir sonido de acierto
          this.correctSound.play();
      } else {
          selectedButton.classList.add('incorrect');
          this.incorrectScore++;
          this.incorrectScoreEl.textContent = this.incorrectScore;
          this.showMessage('¡Incorrecto!', 'red');

          // Reproducir sonido de error
          this.incorrectSound.play();
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

      // Mostrar el ranking
      const ranking = new Ranking();
      const playerName = prompt('¡Juego terminado! Ingresa tu nombre para guardar tu puntuación:');
      if (playerName) {
          ranking.addScore(playerName, this.selectedTable, this.correctScore);
          ranking.displayRanking();
      }
  }

  resetGame() {
      this.resetGameState(this.selectedTable);
      this.generateQuestion();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('startScreen');
  const gameScreen = document.getElementById('gameScreen');
  const rankingScreen = document.getElementById('rankingScreen');
  const backToStartBtn = document.getElementById('backToStartBtn');
  const resetRankingBtn = document.getElementById('resetRankingBtn');
  
  // Evento para seleccionar una tabla y comenzar el juego
  document.querySelectorAll('.table-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
          const selectedTable = parseInt(e.target.dataset.table);
          if (!selectedTable) {
              alert('Por favor, selecciona una tabla para comenzar.');
              return;
          }
          startScreen.style.display = 'none';
          gameScreen.style.display = 'block';
          
          // Asegurarse de que cualquier juego anterior esté limpio
          const existingGame = window.currentGame;
          if (existingGame && existingGame.timer) {
              clearInterval(existingGame.timer);
          }
          
          // Crear una nueva instancia del juego y almacenarla globalmente
          window.currentGame = new MultiplicationGame(selectedTable);
      });
  });

  // Evento para volver al inicio desde la pantalla de ranking
  backToStartBtn.addEventListener('click', () => {
      rankingScreen.style.display = 'none';
      startScreen.style.display = 'block';
  });

  // Evento para resetear el ranking con contraseña
  resetRankingBtn.addEventListener('click', () => {
      const password = prompt('Introduce la contraseña para resetear el ranking:');
      if (password === 'Santi2019') {
          const ranking = new Ranking();
          ranking.resetRanking();
          alert('El ranking ha sido reseteado.');
      } else {
          alert('Contraseña incorrecta. No se ha reseteado el ranking.');
      }
  });
});
