// Define an array of card values. Each card value appears twice (matching pairs).
const cards = ['A', 'A', 'B', 'B', 'C', 'C'];

// Initialize game-related variables.
let score = 0;             // Player's score
let flippedCards = [];     // Array to store the flipped (selected) cards
let canFlip = false;       // Flag to control whether cards can be flipped
let timer;                 // Timer variable to track the remaining time
let timeLeft = 15;         // Initial time limit for the game
let matchedPairs = 0;      // Counter for the number of matched card pairs
const scoreboard = [];     // Array to store player scores

// Get references to HTML elements using querySelector.
const gameBoard = document.querySelector('.game-board');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time-left');
const playerNameInput = document.querySelector('#player-name');
const startButton = document.querySelector('#start-button');
const submitScoreButton = document.querySelector('#submit-score');
//const cardContainer = document.querySelector('.card-container');

function shuffleArray(array) { /// Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
// making a timer to make things challenging
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            timeDisplay.textContent = 'Time: 0s';
            gameBoard.innerHTML = ' '; // clear the board
            // create the game over text and place it after the timer div
            let gameOverText = document.createElement("div");
            gameOverText.classList.add("game-over");
            gameOverText.textContent = "Game Over!";
            timeDisplay.after(gameOverText);
            // insert the form which the player can enter name
            const playerNameLabel = document.createElement('label');
            playerNameLabel.textContent = 'Enter your name: ';
            playerNameInput.style.display = 'inline';
            submitScoreButton.style.display = 'inline';
            gameBoard.appendChild(playerNameLabel);
            gameBoard.appendChild(playerNameInput);
            gameBoard.appendChild(submitScoreButton);

        }
    }, 1000); // Update the timer every second.
}

function createCard(cardType) {
    //need to create card container to store front/back for animation
    const cardContainer = document.createElement('div');
    cardContainer.classList.add("card-container");
    // Create a card element (<div class="card">A</div>)
    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = cardType; // Set the card's content (A, B, C, etc.)
    // attach carc to the container
    cardContainer.append(card);
    return cardContainer;
}
function generateCards() {
    // creating two decks of the same card (for future to maybe mix decks of different types)
    const shuffledCards = [...cards, ...cards];
    // calling shuffle function on the new array of cards
    shuffleArray(shuffledCards);
    // new cards being lopped through
    shuffledCards.forEach((cardType) => {
        // A card now going to be thrown into the createCard function
        let cardContainer = createCard(cardType);
        // now the A which is now a html element is being appended to board. POW!
        gameBoard.appendChild(cardContainer);
    });
}
function flipCard(cardContainer) {
    const card = cardContainer.querySelector('.card');
    // if canFlip is false OR has flipped class OR there are two cards now flipped
    // need to make logic for once there are 2 cards clicked we start to check match
    if (!canFlip || card.classList.contains('flipped') || flippedCards.length >= 2) return;

    card.classList.toggle('flipped');

    flippedCards.push(card);

    if (flippedCards.length === 2) {
        canFlip = false;
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    // call the matched pair array
    const [card1, card2] = flippedCards;

    if (card1.textContent === card2.textContent) {
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
        flippedCards = [];

        matchedPairs++;

    } else {
        score -= 1;
        scoreDisplay.textContent = `Score: ${score}`;
        setTimeout(() => {
            card1.classList.add("face-down");
            card2.classList.add("face-down");
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            flippedCards = [];
        }, 300);
    }

    canFlip = true;
}
if (matchedPairs === shuffledCards.length / 2) {
    gameBoard.textContent = "YOU WON";
    const playerNameLabel = document.createElement('label');
    playerNameLabel.textContent = 'Enter your name: ';
    playerNameInput.style.display = 'inline';
    submitScoreButton.style.display = 'inline';
    gameBoard.appendChild(playerNameLabel);
    gameBoard.appendChild(playerNameInput);
    gameBoard.appendChild(submitScoreButton)
}


// Add an event listener to each card container to handle the card flipping.
gameBoard.addEventListener('click', (event) => {
    const clickedCard = event.target.closest('.card-container');
    if (clickedCard) {
        flipCard(clickedCard);
    }
});

// making a onClick function so the cards appear after its clicked
startButton.addEventListener("click", function () {
    score = 0;
    flippedCards = [];
    canFlip = true;
    timeLeft = 15;
    generateCards();
    //startTimer();
});



