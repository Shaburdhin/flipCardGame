const state = {
    hasFlippedCard: false,
    lockBoard: false,
    firstCard: null,
    secondCard: null,
    moves: 0,
    score: 0,
    matchedPairs: 0,
    totalPairs: 0,
    timer: null,
    seconds: 0,
    isGameStarted: false,
    currentDifficulty: 'easy'
};

const difficulties = {
    easy: { pairs: 3, gridCols: 3 },
    medium: { pairs: 6, gridCols: 4},
    hard: { pairs: 8, gridCols: 4 }
};

const emojis = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺', '🎷', '🎹', '🎼', '🎧'];

function setDifficulty(difficulty) {
    state.currentDifficulty = difficulty;
    resetGame();
    initializeGame();
}
                        
function initializeGame() {
    const { pairs, gridCols } = difficulties[state.currentDifficulty];
    state.totalPairs = pairs;
    
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;

    const selectedEmojis = emojis.slice(0, pairs);
    const cardPairs = [...selectedEmojis, ...selectedEmojis];
    const shuffledCards = shuffleArray(cardPairs);

    gameContainer.innerHTML = '';
    shuffledCards.forEach((emoji, index) => {
        gameContainer.appendChild(createCard(emoji, index));
    });
}

function createCard(emoji, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = emoji;
    
    card.innerHTML = `
        <div class="back">?</div>
        <div class="front">${emoji}</div>
    `;
    
    card.addEventListener('click', flipCard);
    return card;
}

function flipCard() {
    if (state.lockBoard || this === state.firstCard) return;

    this.classList.add('flip');

    if (!state.isGameStarted) {
        startTimer();
        state.isGameStarted = true;
    }

    if (!state.hasFlippedCard) {
        state.hasFlippedCard = true;
        state.firstCard = this;
        return;
    }

    state.secondCard = this;
    state.moves++;
    document.getElementById('moves').textContent = state.moves;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = state.firstCard.dataset.value === state.secondCard.dataset.value;

    if (isMatch) {
        disableCards();
        state.score += 10;
        state.matchedPairs++;
        
        if (state.matchedPairs === state.totalPairs) {
            setTimeout(endGame, 500);
        }
    } else {
        unflipCards();
        state.score = Math.max(0, state.score - 2);
    }
    
    document.getElementById('score').textContent = state.score;
}

function disableCards() {
    state.firstCard.removeEventListener('click', flipCard);
    state.secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    state.lockBoard = true;
    setTimeout(() => {
        state.firstCard.classList.remove('flip');
        state.secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    state.hasFlippedCard = false;
    state.lockBoard = false;
    state.firstCard = null;
    state.secondCard = null;
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startTimer() {
    state.timer = setInterval(() => {
        state.seconds++;
        const minutes = Math.floor(state.seconds / 60);
        const remainingSeconds = state.seconds % 60;
        document.getElementById('timer').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }, 1000);
}

function endGame() {
    clearInterval(state.timer);
    const minutes = Math.floor(state.seconds / 60);
    const remainingSeconds = state.seconds % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    
    document.getElementById('finalScore').textContent = `Final Score: ${state.score}`;
    document.getElementById('finalTime').textContent = `Time: ${timeString}`;
    document.getElementById('gameOverModal').style.display = 'flex';
}

function resetGame() {
    clearInterval(state.timer);
    Object.assign(state, {
        hasFlippedCard: false,
        lockBoard: false,
        firstCard: null,
        secondCard: null,
        moves: 0,
        score: 0,
        matchedPairs: 0,
        seconds: 0,
        isGameStarted: false
    });
    
    document.getElementById('timer').textContent = '00:00';
    document.getElementById('moves').textContent = '0';
    document.getElementById('score').textContent = '0';
    document.getElementById('gameOverModal').style.display = 'none';
}

function restartGame() {
    resetGame();
    initializeGame();
}

// Start the game
initializeGame();