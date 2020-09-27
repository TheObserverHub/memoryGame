const gameContainer = document.getElementById("game");
const yourScore = document.getElementById("your-score");
const bestScore = document.getElementById("best-score");
const startButton = document.getElementById("start-button");
const newGameButton = document.getElementById("new-game");
const newGameButtonContainer = document.getElementById("new-game-button-container");
const startButtonContainer = document.getElementById("start-button-container");
const bestScoreContainer = document.getElementById("best-score-container");
const yourScoreContainer = document.getElementById("your-score-container");
const numberOfcardsContainer = document.getElementById("number-of-cards-container");
const numberOfcards = document.getElementById("number-of-cards");
let pickedImg
let noClick = 0
let noOfGuesses = 0
let start = false
let clickedDiv = {
  clickedID1: null,
  clickedID2: null
}

//color pool or image pool
let imgPool = []
let noImg = 32
for (let imgNo = 0; imgNo < noImg; imgNo++) {
  imgPool.push(`img/img (${imgNo + 1}).jpeg`)

}

function selectRandomElementsFromArray(numElements, sourceArray) {
  let shuffledArray = shuffle(sourceArray)
  return shuffledArray.slice(0, numElements)
}

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

function createDivsForImgs(imgArray) {
  let index = 1
  for (let color of imgArray) {
    // create a new div
    const newDiv = document.createElement("div");
    const newImg = document.createElement("img");
    newDiv.dataset.id = index
    newDiv.dataset.img = imgArray[index-1]
    newDiv.append(newImg)
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
    index++
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
 // let clickedColor = event.target.className
  let parentDiv = event.target.parentNode
  let clickedImg = parentDiv.dataset.img
  let ID = parentDiv.dataset.id
 // console.log('Clicked', event.target)
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
  if ( parentDiv.classList.contains('done')) {
    console.log('Already matched')
    event.preventDefault()
    return
  }
  //Now count click
  noClick++
  if (noClick === 1) {
    clickedDiv.clickedID1 = ID
    event.target.setAttribute('src', clickedImg)
  }

  if (noClick === 2) {
    clickedDiv.clickedID2 = ID
    event.target.setAttribute('src', clickedImg)
  }

  if (noClick > 2) {
    event.preventDefault()
    return
  }

  if (noClick === 2) {
    let divHolder1 = document.querySelector(`div[data-id='${clickedDiv.clickedID1}']`)
    let divHolder2 = document.querySelector(`div[data-id='${clickedDiv.clickedID2}']`)
    if (isMatch(clickedDiv)) {
        divHolder1.classList.add('done')
        divHolder2.classList.add('done')
      resetClicks()
      noOfGuesses++
      updatePlayerScore(noOfGuesses)
      if (isGameComplete(pickedImg)) {
        updateBestScore(bestScore.innerText, noOfGuesses)
        endGame()
      }
    } else {
      setTimeout(function (){
        divHolder1.firstElementChild.setAttribute('src', 'img/blank.jpg')
        divHolder2.firstElementChild.setAttribute('src', 'img/blank.jpg')
        resetClicks()
        noOfGuesses++
        updatePlayerScore(noOfGuesses)
      }, 1000);
    }
  }
}

function resetClicks() {
  noClick = 0
  Object.keys(clickedDiv).forEach(key => {
    clickedDiv[key] = null
  });
}

function startGame(firstLoad) {
    if (firstLoad) {
        newGameButtonContainer.style.display = 'none'
    } else {
        start = true
        startButtonContainer.style.display = 'none'
        newGameButtonContainer.style.display = 'none'
        numberOfcardsContainer.style.display = 'none'
    }
   
    yourScore.innerText = 0
    let noCards = parseInt(numberOfcards.value)
    localStorage.setItem('lastDifficulty', noCards)
    pickedImg = selectRandomElementsFromArray(noCards, imgPool)
    let shuffledCards = shuffle(pickedImg);
    createDivsForImgs(shuffledCards);
    let storedScore = JSON.parse(localStorage.getItem('bestScore'))
    if (storedScore[noCards]) {
        bestScore.innerText = storedScore[noCards].bestScore
    } else {
        let currentScore = {
            noCards: noCards,
            bestScore: 'Not Available',
        }
        storedScore[noCards] = currentScore
        localStorage.setItem('bestScore', JSON.stringify(storedScore))
        bestScore.innerText = currentScore.bestScore
    }
 }

function endGame() {
  newGameButtonContainer.style.display = ''
  numberOfcardsContainer.style.display = ''
  noOfGuesses = 0
  start = false
}
  
function isGameComplete(cards) {
return document.querySelectorAll('.done').length === cards.length
}

function isMatch(clickedDiv) {
    const div1 = document.querySelector(`div[data-id='${clickedDiv.clickedID1}']`).dataset.img
    const div2 = document.querySelector(`div[data-id='${clickedDiv.clickedID2}']`).dataset.img
    console.log('in isMatched')
    if(div1 && div2) {
      return div1 === div2
    }
    
  }

function clearCards() {
  let cards = gameContainer.children
  const allCards = cards.length
  for (let card = 0; card < allCards; card++) {
    cards[0].remove()
  }
}

function updatePlayerScore(playerScore){
    yourScore.innerText = playerScore
  }
  
function updateBestScore(lastScore, noOfGuesses){
    if (parseInt(lastScore) >  noOfGuesses || parseInt(lastScore) === 0 || lastScore === 'Not Available') {
        //You got the best score
        bestScore.innerText = yourScore.innerText

        let noCards = parseInt(numberOfcards.value)
        let currentScore = {
            noCards: noCards,
            bestScore: noOfGuesses,
        }
        let storedScore = JSON.parse(localStorage.getItem('bestScore'))
        storedScore[noCards] = currentScore
        localStorage.setItem('bestScore', JSON.stringify(storedScore))
    }
}

//Create local storage if it doesnt exist.
if (!localStorage.getItem('lastDifficulty')) {
    localStorage.setItem('lastDifficulty', '10')
}

let storedScore = JSON.parse(localStorage.getItem('bestScore'))
if (!Array.isArray(storedScore)) {
    storedScore = []
    localStorage.setItem('bestScore', JSON.stringify(storedScore))
}

startButtonContainer.addEventListener('click', function name(params) {
  clearCards()
  startGame()
})

newGameButton.addEventListener('click', function name(params) {
  clearCards()
  startGame()
})

// when the DOM loads
document.addEventListener('DOMContentLoaded', function name(params) {
    startGame(true)
})