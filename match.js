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

function shuffleArray(array) { /// Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function createCard(cardType) {
    // Create a card element (<div class="card">A</div>)
    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = cardType; // Set the card's content (A, B, C, etc.)
    return card;
}
function generateCards() {
    // creating two decks of the same card (for future to maybe mix decks of different types)
    const shuffledCards = [...cards, ...cards];
    // calling shuffle function on the new array of cards
    shuffleArray(shuffledCards);
    // new cards being lopped through
    shuffledCards.forEach((cardType) => {
        // A card now going to be thrown into the createCard function
        const card = createCard(cardType);
        // now the A which is now a html element is being appended to board. POW!
        gameBoard.appendChild(card);
    });
}

// making a onClick function so the cards appear after its clicked
startButton.addEventListener("click", function() {
    generateCards();
});

// Call the generateCards to generate and display the cards


