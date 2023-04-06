// Global Variables
var winningWord = '';
var currentRow = 1;
var guess = '';
var gamesPlayed = [];

// Query Selectors
var inputs = document.querySelectorAll('input');
var guessButton = document.querySelector('#guess-button');
var keyLetters = document.querySelectorAll('.keys');
var errorMessage = document.querySelector('#error-message');
var viewRulesButton = document.querySelector('#rules-button');
var viewGameButton = document.querySelector('#play-button');
var viewStatsButton = document.querySelector('#stats-button');
var gameBoard = document.querySelector('#game-section');
var letterKey = document.querySelector('#key-section');
var rules = document.querySelector('#rules-section');
var stats = document.querySelector('#stats-section');
var gameOverBox = document.querySelector('#game-over-section');
var gameOverGuessCount = document.querySelector('#game-over-guesses-count');
var gameOverGuessGrammar = document.querySelector('#game-over-guesses-plural');

// Event Listeners
window.addEventListener('load', setGame);
guessButton.addEventListener('click', submitGuess);
viewRulesButton.addEventListener('click', viewRules);
viewGameButton.addEventListener('click', viewGame);
viewStatsButton.addEventListener('click', viewStats);

// REFACTOR: For loops into functions ?
for (var i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener('keyup', function() { moveToNextInput(event) });
}

for (var i = 0; i < keyLetters.length; i++) {
  keyLetters[i].addEventListener('click', function() { clickLetter(event) });
}

// Functions
function setGame() {
  currentRow = 1;
  winningWord = getRandomWord();
  updateInputPermissions();
}

function getRandomWord() {
  var randomIndex = Math.floor(Math.random() * 2500);
  return words[randomIndex];
}

function updateInputPermissions() {
  for(var i = 0; i < inputs.length; i++) {
    if(!inputs[i].id.includes(`-${currentRow}-`)) {
      inputs[i].disabled = true;
    } else {
      inputs[i].disabled = false;
    }
  }

  inputs[0].focus();
}

// BUG: On page load, focus moves to cell-1-1 instead of starting at cell-1-0
function moveToNextInput(e) {
  // REFACTOR: keyCode and charCode are depreciated -> update to an alternative
  var key = e.keyCode || e.charCode;

  if( key !== 8 && key !== 46 ) {
    var indexOfNext = parseInt(e.target.id.split('-')[2]) + 1;
    inputs[indexOfNext].focus();
  }
}

function clickLetter(e) {
  var activeInput = null;
  var activeIndex = null;

  for (var i = 0; i < inputs.length; i++) {
    if(inputs[i].id.includes(`-${currentRow}-`) && !inputs[i].value && !activeInput) {
      activeInput = inputs[i];
      activeIndex = i;
    }
  }

  activeInput.value = e.target.innerText;
  inputs[activeIndex + 1].focus();
}

function submitGuess() {
  // REFACTOR: nested If statments
  if (checkIsWord()) {
    errorMessage.innerText = '';
    compareGuess();
    if (checkForWin()) {
      setTimeout(declareWinner, 1000);
    } else {
      changeRow();
    }
  } else {
    errorMessage.innerText = 'Not a valid word. Try again!';
  }
}

function checkIsWord() {
  guess = '';

  for(var i = 0; i < inputs.length; i++) {
    if(inputs[i].id.includes(`-${currentRow}-`)) {
      guess += inputs[i].value;
    }
  }

  return words.includes(guess);
}

function compareGuess() {
  var guessLetters = guess.split('');

  for (var i = 0; i < guessLetters.length; i++) {
    if (winningWord.includes(guessLetters[i]) && winningWord.split('')[i] !== guessLetters[i]) {
      updateBoxColor(i, 'wrong-location');
      updateKeyColor(guessLetters[i], 'wrong-location-key');
    } else if (winningWord.split('')[i] === guessLetters[i]) {
      updateBoxColor(i, 'correct-location');
      updateKeyColor(guessLetters[i], 'correct-location-key');
    } else {
      updateBoxColor(i, 'wrong');
      updateKeyColor(guessLetters[i], 'wrong-key');
    }
  }
}

function updateBoxColor(letterLocation, className) {
  var row = [];

  for (var i = 0; i < inputs.length; i++) {
    if(inputs[i].id.includes(`-${currentRow}-`)) {
      row.push(inputs[i]);
    }
  }

  addClass(row[letterLocation], className);
}

function updateKeyColor(letter, className) {
  var keyLetter = null;

  for (var i = 0; i < keyLetters.length; i++) {
    if (keyLetters[i].innerText === letter) {
      keyLetter = keyLetters[i];
    }
  }

  addClass(keyLetter, className);
}

function checkForWin() {
  return guess === winningWord;
}

function changeRow() {
  currentRow++;
  updateInputPermissions();
}

function declareWinner() {
  recordGameStats();
  changeGameOverText();
  viewGameOverMessage();
  setTimeout(startNewGame, 4000);
}

function recordGameStats() {
  gamesPlayed.push({ solved: true, guesses: currentRow });
}

function changeGameOverText() {
  gameOverGuessCount.innerText = currentRow;
  if (currentRow < 2) {
    addClass(gameOverGuessGrammar, 'collapsed');
  } else {
    removeClass(gameOverGuessGrammar, 'collapsed');
  }
}

function startNewGame() {
  clearGameBoard();
  clearKey();
  setGame();
  viewGame();
  inputs[0].focus();
}

function clearGameBoard() {
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].value = '';
    removeClass(inputs[i], 'correct-location');
    removeClass(inputs[i], 'wrong-location');
    removeClass(inputs[i], 'wrong');
  }
}

function clearKey() {
  for (var i = 0; i < keyLetters.length; i++) {
    removeClass(keyLetters[i], 'correct-location-key');
    removeClass(keyLetters[i], 'wrong-location-key');
    removeClass(keyLetters[i], 'wrong-key');
  }
}

// Change Page View Functions

function addClass(element, className) {
  element.classList.add(className);
}

function removeClass(element, className) {
  element.classList.remove(className);
}

function viewRules() {
  addClass(letterKey, 'hidden');
  addClass(gameBoard, 'collapsed');
  removeClass(rules, 'collapsed');
  addClass(stats, 'collapsed');
  removeClass(viewGameButton, 'active');
  addClass(viewRulesButton, 'active');
  removeClass(viewStatsButton, 'active');
}

function viewGame() {
  removeClass(letterKey, 'hidden');
  removeClass(gameBoard, 'collapsed');
  addClass(rules, 'collapsed');
  addClass(stats, 'collapsed');
  addClass(gameOverBox, 'collapsed');
  addClass(viewGameButton, 'active');
  removeClass(viewRulesButton, 'active');
  removeClass(viewStatsButton, 'active');
}

function viewStats() {
  addClass(letterKey, 'hidden');
  addClass(gameBoard, 'collapsed');
  addClass(rules, 'collapsed');
  removeClass(stats, 'collapsed');
  removeClass(viewGameButton, 'active');
  removeClass(viewRulesButton, 'active');
  addClass(viewStatsButton, 'active');
}

function viewGameOverMessage() {
  removeClass(gameOverBox, 'collapsed');
  addClass(letterKey, 'hidden');
  addClass(gameBoard, 'collapsed');
}
