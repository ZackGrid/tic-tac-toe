
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
    '', '', '',
    '', '', '',
    '', '', ''
  ];


  // Create and populate the board
  // using the array above as the base
  let i = 0;
  board.forEach(element => {
    const btn = document.createElement('button');
    btn.id = `${i}`;
    btn.className = 'btn';
    btn.textContent = element;
    boardContainer.appendChild(btn);
    i += 1;
  })

  // Create variables to be used in the module
  const resultData = document.createElement('div');
  resultData.classList.add('result-data');
  let x = 0;
  let o = 0;
  let result = '';
  let aiCount = 0;

  const checkWinner = () => {

    function check(n1, n2, n3) {
      if (!n1) return;
      if (n1 === n2 && n2 === n3) {
        result = n1;
      }

    }

    // Check all possible win scenarios
    check(board[0], board[1], board[2]);
    check(board[3], board[4], board[5]);
    check(board[6], board[7], board[8]);
    check(board[0], board[3], board[6]);
    check(board[1], board[4], board[7]);
    check(board[2], board[5], board[8]);
    check(board[0], board[4], board[8]);
    check(board[2], board[4], board[6]);

    // Holds the amount of turns passed
    let turns = 0;
    board.forEach(house => {
      if (house != '') {
        turns += 1;
      }
    })

    // Decide the result and shows on screen
    if (turns >= 9 && !result) {
      result = 'Draw';
      resultData.textContent = `The result is a Draw`;
      scoreBoard.appendChild(resultData);
    } else if (result) {
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
    for (let i = 0; i < board.length; i++) {
      board[i] = '';
    }
    result = '';
    turns = 0;
    aiCount = 0;
    scoreBoardTurn.textContent = 'X';
    scoreBoard.removeChild(resultData);
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
  const updateBoard = (house, xO) => {
    board[house] = xO;
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

  return { updateBoard, checkWinner, getResult, resetBoard, getXwins, getOwins, getAiCount, updateAiCount, checkWhoWon };

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
      GameBoard.updateBoard(button.id, playerX.getXo());
      current = 'O';
    } else if (current === 'O') {
      button.textContent = playerO.getXo();
      GameBoard.updateBoard(button.id, playerO.getXo());
      current = 'X';
    }
    GameBoard.checkWinner();
  }));
}

// Human vs AI. Waits for human to play, then call AI
const playAi = () => {
  buttons.forEach(button => button.addEventListener('click', () => {

    // Check if game has ended
    if (!!button.textContent || !!GameBoard.getResult()) {
      return;
    }

    button.textContent = playerX.getXo();
    GameBoard.updateBoard(button.id, playerX.getXo());

    // Checks if AI can still play
    if (GameBoard.getAiCount() < 4) {
      GameBoard.checkWinner();
      if (GameBoard.getResult() != '') {
        return;
      }
      // Choose a random empty space to play
      while (true) {
        let index = pc.RandomMove();
        if (!buttons[index].textContent) {

          // delay the AI so it's not instantaneous right
          // after human played
          setTimeout(() => {
            buttons[index].textContent = pc.getXo();
          }, 200)

          GameBoard.updateBoard(buttons[index].id, pc.getXo());
          GameBoard.updateAiCount();
          GameBoard.checkWinner();
          break;
        }
      }
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

// -----------------------------------------------------

function bestMove() {
  let bestScore = -Infinity;
  forEach(position => {
    if (position.textContent === '') {
      let score = minimax(board);
      if (score > bestScore) {
        bestScore = score;
        optimalMove = position;
      }
    }
  })
}

// -----------------------------------------------------
