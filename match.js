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
// creating two decks of the same card (for future to maybe mix decks of different types)
const shuffledCards = [...cards, ...cards];
const clickSound = new Audio("https://cdn.discordapp.com/attachments/1156675538283409478/1160298468850532372/button-pressed-38129.mp3?ex=65342728&is=6521b228&hm=942862e3c99dda7b5080248719e79aa259d85d33e38ce6b5524645cde9322523&");


// Get references to HTML elements using querySelector.
const gameBoard = document.querySelector('.game-board');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time-left');
const playerNameInput = document.querySelector('#player-name');
const startButton = document.querySelector('#start-button');
const submitScoreButton = document.querySelector('#submit-score');
const gameOverText = document.querySelector(".game-over");
const cardHolder = document.querySelector(".card-container");
const loseText = document.createElement("div");
const winText = document.createElement("div");
//const cardContainer = document.querySelector('.card-container');

gameOverText.style.display = "none";

function shuffleArray(array) { /// Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCard(cardType) {
    //need to create card container to store front/back for animation
    const cardContainer = document.createElement('div');
    cardContainer.classList.add("card-container");
    // Create a card element (<div class="card">A</div>)
    const card = document.createElement('div');
    card.classList.add("card", "back");
    card.textContent = cardType; // Set the card's content (A, B, C, etc.)
    // attach carc to the container
    cardContainer.append(card);

    return cardContainer;
}
function generateCards() {
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
    if (!canFlip || card.classList.contains('flipped') || flippedCards.length >= 2) return;
    card.classList.remove("back");
    card.classList.add("front");
    card.classList.toggle('flipped');
    flippedCards.push(card);
    if (flippedCards.length === 2) {
        canFlip = false;
        setTimeout(checkMatch, 600);
    }
}
// Add an event listener to each card container to handle the card flipping.
gameBoard.addEventListener('click', (event) => {

    const clickedCard = event.target.closest('.card-container');
    if (clickedCard) {
        clickSound.play();
        flipCard(clickedCard);
    }
});

function checkMatch() {
    //clickSound.pause();
    // call the matched pair array
    const [card1, card2] = flippedCards;
    // if they match we get pts yay...
    if (card1.textContent === card2.textContent) {
        score += 10;
        scoreDisplay.textContent = `Score: ${score}`;
        flippedCards = [];
        matchedPairs++;
    } else {
        // if not minus one and reflip them back down
        score -= 1;
        scoreDisplay.textContent = `Score: ${score}`;
        setTimeout(() => {
            clickSound.pause();
            card1.classList.add("back");
            card2.classList.add("back");
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            card1.classList.remove("front");
            card2.classList.remove("front");
            flippedCards = [];
        }, 600);
    }
    // let me flip the cards again once they are flipped back down
    canFlip = true;
    // win logic: just checking the match arr against the double deck arr
    if (matchedPairs === shuffledCards.length / 2) {
        // const winText = document.createElement("div");
        winText.classList.add("winText");
        winText.textContent = "YOU WON";
        gameOverText.append(winText);
        endGame();
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

            if (matchedPairs !== shuffledCards.length / 2) {

                loseText.classList.add("loseText");
                loseText.textContent = "YOU LOST!";
                gameOverText.append(loseText);
                endGame();
            }

        }
    }, 1000); // Update the timer every second.
}

function startGame() {
    gameBoard.textContent = " ";
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    timeLeft = 15;
    //timeDisplay.textContent = 'Time: 15s';
    playerNameInput.style.display = 'none';
    submitScoreButton.style.display = 'none';
    startButton.disabled = true;
    canFlip = true;
    flippedCards = [];
    matchedPairs = 0; // Reset matchedPairs

    generateCards();
    //startTimer();
}
// making a onClick function so the cards appear after its clicked
function endGame() {
    canFlip = false;
    //gameBoard.textContent = " ";
    // create the game over text and place it after the timer div
    gameOverText.style.display = "inline";
    // insert the form which the player can enter name
    const playerNameLabel = document.createElement('label');
    // playerNameLabel.textContent = 'Enter your name: ';
    playerNameInput.style.display = 'inline';
    submitScoreButton.style.display = 'inline';

    gameBoard.innerHTML = '';

    gameBoard.prepend(submitScoreButton);
    gameBoard.prepend(playerNameInput);
    gameBoard.prepend(playerNameLabel);

}


submitScoreButton.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    if (playerName === '') {
        alert('Please enter your name.');
        return;
    }

    // Create a new list item to display player's name and score
    const listItem = document.createElement('li');
    listItem.textContent = `${playerName}: ${score}`;

    // Append the list item to the scoreboard
    const scoreList = document.querySelector('#score-list');
    scoreList.appendChild(listItem);

    // Clear input and reset game
    playerNameInput.value = '';
    startButton.disabled = false;
    gameBoard.innerHTML = '';
    gameOverText.style.display = "none";
});

// making a onClick function so the cards appear after its clicked
startButton.addEventListener("click", function () {
    startGame();
});