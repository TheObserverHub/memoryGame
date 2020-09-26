const gameContainer = document.getElementById("game");
const yourScore = document.getElementById("your-score");
const bestScore = document.getElementById("best-score");
const startButton = document.getElementById("start-button");
const newGameButton = document.getElementById("new-game");
const newGameButtonContainer = document.getElementById("new-game-button-container");
const startButtonContainer = document.getElementById("start-button-container");
const bestScoreContainer = document.getElementById("best-score-container");
const yourScoreContainer = document.getElementById("your-score-container");
let noClick = 0
let noOfGuesses = 0
let start = false
let clickedDiv = {
  clickedID1: null,
  clickedID2: null
}


const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  let index = 1
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    newDiv.dataset.id = index
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
    index++
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  let clickedColor = event.target.className
  let ID = event.target.dataset.id
  if (!start){
    event.preventDefault()
    return
  }
  //already clicked
  if (Object.values(clickedDiv).includes(ID)) {
    console.log('Already Clicked')
    event.preventDefault()
    return
  }
  //already matched
  if ( event.target.classList.contains('done')) {
    console.log('Already matched')
    event.preventDefault()
    return
  }
  noClick++
  if (noClick === 1) {
    clickedDiv.clickedID1 = ID
    // event.target.dataset.clicked = 'true'
    event.target.style.backgroundColor = clickedColor
  }

  if (noClick === 2) {
    clickedDiv.clickedID2 = ID
    // event.target.dataset.clicked = 'true'
    event.target.style.backgroundColor = clickedColor
    }

  if (noClick > 2) {
    event.preventDefault()
    return
  }

  if (noClick === 2) {
    if (isMatch(clickedDiv)) {
      document.querySelector(`div[data-id='${clickedDiv.clickedID1}']`).classList.add('done')
      document.querySelector(`div[data-id='${clickedDiv.clickedID2}']`).classList.add('done')
      resetClicks()
      noOfGuesses++
      updatePlayerScore(noOfGuesses)
      if (isGameComplete()) {
        endGame()
      }
    } else {
      setTimeout(function (){
        document.querySelector(`div[data-id='${clickedDiv.clickedID1}']`).style.backgroundColor = ''
        document.querySelector(`div[data-id='${clickedDiv.clickedID2}']`).style.backgroundColor = ''
        resetClicks()
        noOfGuesses++
        updatePlayerScore(noOfGuesses)
      }, 1000);
    }
  }

  // you can use event.target to see which element was clicked
  // console.log("No of clicks", ID);
  // console.log("you just clicked", event.target);
}

function resetClicks() {
  noClick = 0
  Object.keys(clickedDiv).forEach(key => {
    clickedDiv[key] = null
  });
}

function isMatch(clickedDiv) {
  const div1 = document.querySelector(`div[data-id='${clickedDiv.clickedID1}']`).className
  const div2 = document.querySelector(`div[data-id='${clickedDiv.clickedID2}']`).className
  console.log('in isMatched')
  if(div1 && div2) {
    return div1 === div2
  }
  
}

function isGameComplete() {
  return document.querySelectorAll('.done').length === COLORS.length
}

function endGame() {
  newGameButtonContainer.style.display = ''
  updateBestScore(bestScore.innerText, noOfGuesses)
  yourScore.innerText = 0
  noOfGuesses = 0
}

function updatePlayerScore(playerScore){
  yourScore.innerText = playerScore
}

function updateBestScore(lastScore, noOfGuesses){
  if (parseInt(lastScore) >  noOfGuesses || parseInt(lastScore) === 0) {
    //You got the best score
    bestScore.innerText = yourScore.innerText
  }
}

function clearCards() {
  let cards = gameContainer.children
  const allCards = cards.length
  for (let card = 0; card < allCards; card++) {
    cards[0].remove()
  }
}
function startGame() {
  start = true
  startButtonContainer.style.display = 'none'
  newGameButtonContainer.style.display = 'none'
}
startButtonContainer.addEventListener('click', function name(params) {
  startGame()
})

newGameButton.addEventListener('click', function name(params) {
   var divs = document.querySelectorAll('.done')
  // for (let div = 0; div < divs.length; div++) {
  //   divs[div].classList.remove('done')
  //   divs[div].style.backgroundColor = ''
  // }
  clearCards()
  startGame()
  let shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  newGameButtonContainer.style.display = 'none'
})
// when the DOM loads
document.addEventListener('DOMContentLoaded', function name(params) {
  createDivsForColors(shuffledColors);
  newGameButtonContainer.style.display = 'none'
})
//restart Game

//implement random colors using hex?
//Implement number of cards to display. Even and minimum of 10
//save score best score in localStorage
