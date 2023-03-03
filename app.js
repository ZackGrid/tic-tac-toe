
const boardContainer = document.querySelector('.container');
const scoreBoard = document.querySelector('.score-board');
const chooseContainer = document.querySelector('.choose');
const chooseButtons = document.querySelectorAll('.choice');
const parent = document.querySelector('.parent-container');
const footerBtns = document.querySelector('.footer-buttons');
const footerBtnsList = document.querySelectorAll('.footer');
const scoreBoardContent = document.querySelectorAll('.li');
const scoreBoardTurn = document.querySelector('.turn');

// Tic tac toe game module
const GameBoard = (() => {

  // array for the board
  const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];


  // Create and populate the board
  // using the array above as the base

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const btn = document.createElement('button');
      btn.id = `${i}${j}`;
      btn.className = 'btn';
      btn.textContent = '';
      boardContainer.appendChild(btn);

    }
  }



  // Create variables to be used in the module
  const resultData = document.createElement('div');
  resultData.classList.add('result-data');
  let x = 0;
  let o = 0;
  let result = '';
  let value = '';
  let aiCount = 0;

  const check = (n1, n2, n3) => {
    if (n1 === '') return;
    if (n1 === n2 && n2 === n3) {
      value = n1;
    }
  }

  const checkResult = () => {
    value = '';
    // Check all possible win scenarios
    check(board[0][0], board[0][1], board[0][2]);
    check(board[1][0], board[1][1], board[1][2]);
    check(board[2][0], board[2][1], board[2][2]);
    check(board[0][0], board[1][0], board[2][0]);
    check(board[0][1], board[1][1], board[2][1]);
    check(board[0][2], board[1][2], board[2][2]);
    check(board[0][0], board[1][1], board[2][2]);
    check(board[0][2], board[1][1], board[2][0]);
    if (value === 'X') {
      return -10;
    } else if (value === 'O') {
      return 10;
    }
  }

  const checkWinner = () => {

    value = '';

    checkResult();

    if (value != '') {
      result = value;
    }

    // Holds the amount of turns passed
    let turns = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] !== '') {
          turns += 1;
        }
      }
    }

    // Decide the result and shows on screen
    if (turns >= 9 && !result) {

      result = 'Draw';
      resultData.textContent = `The result is a Draw`;
      scoreBoard.appendChild(resultData);

    } else if (result !== '') {

      resultData.textContent = `The Winner is ${result}`;
      scoreBoard.appendChild(resultData);
    }
  };

  // Keep tracks of wins for each player
  const checkWhoWon = () => {
    if (result === 'X') {
      x += 1;
    } else if (result === 'O') {
      o += 1;
    }
  }

  // Reset the game and all values
  const resetBoard = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[i][j] = '';
      }
    }
    current = 'X';
    result = '';
    turns = 0;
    aiCount = 0;
    scoreBoardTurn.textContent = 'X';
    if (resultData.hasChildNodes()) {
      resultData.textContent = '';
    }
  }

  // This is used to increase every time the AI makes a move
  const updateAiCount = () => {
    aiCount += 1;
  }

  // Return how many times the AI has moved
  const getAiCount = () => {
    return aiCount;
  }

  // Update the array with the current move
  const updateBoard = (array, xO) => {
    board[array[0]][array[1]] = xO;
  }

  // Return the result of the game
  const getResult = () => {
    return result;
  }

  // Return how many times X won
  const getXwins = () => {
    return x.toString();
  }

  // Return how many times O won
  const getOwins = () => {
    return o.toString();
  }

  return { updateBoard, checkWinner, getResult, resetBoard, getXwins, getOwins, getAiCount, updateAiCount, checkWhoWon, checkResult, board };

})();

// Factory function to create player obj
const Player = (xO) => {
  getXo = () => xO;
  return { getXo };
};

// Factory function to create AI obj
const randomAi = (xO) => {
  getXo = () => xO;
  const RandomMove = () => Math.floor(Math.random() * 9);
  return { getXo, RandomMove };
}

// Create players, and get the buttons that are used
// in the tic tac toe game board 
const buttons = document.querySelectorAll('.btn');
const playerX = Player('X');
const playerO = Player('O');
const pc = randomAi('O');

// current will be used to alternate turns between 
// players
let current = 'X';

// Alternate to show current player turn on score board
function playerTurn() {
  if (scoreBoardTurn.textContent === 'O') {
    scoreBoardTurn.textContent = 'X';
  } else if (scoreBoardTurn.textContent === 'X') {
    scoreBoardTurn.textContent = 'O';
  }
}


// Each click will check if there's a winner and 
// update the board. For human vs human.
// also it cycles between players with each click
const playHuman = () => {
  buttons.forEach(button => button.addEventListener('click', () => {

    playerTurn();

    // Check if game has ended
    if (!!button.textContent || !!GameBoard.getResult()) {
      return;
    }

    // Check whos turn is to play
    if (current === 'X') {
      button.textContent = playerX.getXo();
      GameBoard.updateBoard(button.id.split(''), playerX.getXo());
      current = 'O';
    } else if (current === 'O') {
      button.textContent = playerO.getXo();
      GameBoard.updateBoard(button.id.split(''), playerO.getXo());
      current = 'X';
    }
    GameBoard.checkWinner();
  }));
}

// Listen to wich mode the player will choose
// AI or Human. Then remove the greeting and show
// the game board
chooseButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    scoreBoardTurn.textContent = 'X';
    if (btn.className.includes('player')) {

      parent.classList.remove('display');
      footerBtns.classList.remove('display');

      setTimeout(() => {
        parent.classList.remove('visually-hidden');
        footerBtns.classList.remove('visually-hidden');
      }, 10);

      playHuman();

    } else if (btn.className.includes('ai')) {

      parent.classList.remove('display');
      footerBtns.classList.remove('display');

      setTimeout(() => {
        parent.classList.remove('visually-hidden');
        footerBtns.classList.remove('visually-hidden');
      }, 10);

      playAi();

    }

    chooseContainer.classList.add('display');

  })
})

// Listens to the footer buttons, and act accordingly
footerBtnsList.forEach(btn => btn.addEventListener('click', () => {

  // Reloads so it goes back to the home greeting 
  // leting player choose a mode and reseting all
  if (btn.className.includes('choose-mode')) {

    location.reload();
  }

  // Reset game will reset a ongoing game
  if (btn.className.includes('reset-game')) {
    if (GameBoard.getResult() === '') {

      GameBoard.resetBoard();
      buttons.forEach(btn => btn.textContent = '');
    }
  }

  // Rematch will reset the board, but keep track of
  // victories and begin a new game
  if (btn.className.includes('rematch')) {

    GameBoard.checkWhoWon();
    GameBoard.resetBoard();
    buttons.forEach(btn => btn.textContent = '');
    scoreBoardContent.forEach(li => {
      if (li.className.includes('x-vic')) {

        li.textContent = GameBoard.getXwins();
      } else if (li.className.includes('o-vic')) {

        li.textContent = GameBoard.getOwins();
      }
    })
  }

}))


const playAi = () => {
  buttons.forEach(button => button.addEventListener('click', () => {

    // Check if game has ended
    if (!!button.textContent || !!GameBoard.getResult()) {
      return;
    }

    button.textContent = playerX.getXo();
    GameBoard.updateBoard(button.id.split(''), playerX.getXo());



    // Checks if AI can still play
    if (GameBoard.getAiCount() < 4) {

      GameBoard.checkWinner();

      if (GameBoard.getResult() !== '') {
        return;
      }

      let index = findBestMove(GameBoard.board)

      let indexConcat = index.i.toString() + index.j;
      //console.log(indexConcat);


      setTimeout(() => {
        buttons.forEach(btn => {
          if (btn.id === indexConcat) {
            btn.textContent = pc.getXo();
          }
        })
        // buttons[indexConcat].textContent = pc.getXo();
      }, 200)

      GameBoard.updateBoard(Object.values(index), pc.getXo());
      GameBoard.updateAiCount();

      GameBoard.checkWinner();
    }
    GameBoard.checkWinner();
  }));
}

// AI - minimax
// -----------------------------------------------------


function findBestMove(board) {

  let bestMove = {};
  let bestVal = -Infinity;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {

      if (board[i][j] === '') {

        board[i][j] = 'O';

        let moveVal = minimax(board, 0, false);

        board[i][j] = '';

        if (moveVal > bestVal) {

          bestVal = moveVal;
          bestMove = { i, j };

        }
      }
    }
  }

  return bestMove;
}

function minimax(board, depth, maxPlayer) {

  let score = GameBoard.checkResult();

  if (!!score) {

    return score;

  }

  if (depth > 3) {

    return 0;

  }

  if (!isMovesLeft(board)) {

    return 0;

  }

  if (maxPlayer) {

    let maxEval = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {

        if (board[i][j] === '') {

          board[i][j] = 'O';

          let eval = minimax(board, depth + 1, false);

          board[i][j] = '';

          maxEval = Math.max(maxEval, eval);

        }
      }
    }

    return maxEval;

  } else {

    let minEval = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {

        if (board[i][j] === '') {

          board[i][j] = 'X';

          let eval = minimax(board, depth + 1, true);

          board[i][j] = '';

          minEval = Math.min(minEval, eval);

        }
      }
    }
    return minEval;

  }
}

function isMovesLeft(board) {

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {

      if (board[i][j] === '') {
        return true;

      }
    }
  }

  return false;
}

// -----------------------------------------------------
