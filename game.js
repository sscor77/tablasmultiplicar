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
      this.ranking = [];
      this.saveRanking();
      this.displayRanking();
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

// Añade el evento para resetear el ranking
document.addEventListener('DOMContentLoaded', () => {
  const resetRankingBtn = document.getElementById('resetRankingBtn');
  
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
