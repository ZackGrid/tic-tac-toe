
const boardContainer = document.querySelector('.container');
const scoreBoard = document.querySelector('.score-board');
const chooseContainer = document.querySelector('.choose');
const chooseButtons = document.querySelectorAll('.choice');
const parent = document.querySelector('.parent-container');
const footerBtns = document.querySelector('.footer-buttons');
const footerBtnsList = document.querySelectorAll('.footer');
const scoreBoardContent = document.querySelectorAll('.li');
const scoreBoardTurn = document.querySelector('.turn');

// const reset = document.querySelector('.reset');

// Tic tac toe game module
const GameBoard = (() => {

  // array for board values
  const board = [
    '', '', '',
    '', '', '',
    '', '', ''
  ];

  let i = 0;
  // Create and populate the board
  // using the array above as the base
  board.forEach(element => {
    const btn = document.createElement('button');
    btn.id = `${i}`;
    btn.className = 'btn';
    btn.textContent = element;
    boardContainer.appendChild(btn);
    i += 1;
  })

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

    check(board[0], board[1], board[2]);
    check(board[3], board[4], board[5]);
    check(board[6], board[7], board[8]);
    check(board[0], board[3], board[6]);
    check(board[1], board[4], board[7]);
    check(board[2], board[5], board[8]);
    check(board[0], board[4], board[8]);
    check(board[2], board[4], board[6]);

    let turns = 0;

    board.forEach(house => {
      if (house != '') {
        turns += 1;
      }
    })

    if (turns >= 9 && !result) {
      result = 'Draw';
      resultData.textContent = `The result is a Draw`;
      scoreBoard.appendChild(resultData);
    } else if (result) {
      resultData.textContent = `The Winner is ${result}`;
      scoreBoard.appendChild(resultData);
    }
  };

  const checkWhoWon = () => {
    if (result === 'X') {
      x += 1;
    } else if (result === 'O') {
      o += 1;
    }
  }

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++ ) {
      board[i] = '';
    }
    result = '';
    turns = 0;
    aiCount = 0;
    scoreBoardTurn.textContent = 'X';
  }
  const updateAiCount = () => {
    aiCount += 1;
  }

  const getAiCount = () => {
    return aiCount;
  } 

  const updateBoard = (house, xO) => {
    board[house] = xO;
  }

  const getResult = () => {
    return result;
  }

  const getXwins = () => {
    return x.toString();
  }

  const getOwins = () => {
    return o.toString();
  }

  return { updateBoard, checkWinner, getResult, resetBoard, getXwins, getOwins, getAiCount, updateAiCount, checkWhoWon, board};

})();

const Player = (xO) => {
  getXo = () => xO;
  return { getXo };
};

const randomAi = (xO) => {
  getXo = () => xO;
  const RandomMove = () => Math.floor(Math.random() * 9);
  return { getXo, RandomMove };
}

const buttons = document.querySelectorAll('.btn');
const playerX = Player('X');
const playerO = Player('O');
const pc = randomAi('O');
let current = 'X';

// Each click will check if there's a winner and update the board
// also it cycles between players with each click
const playHuman = () => {
  buttons.forEach(button => button.addEventListener('click', () => {

    if (scoreBoardTurn.textContent === 'O') {
      scoreBoardTurn.textContent = 'X';
    } else if(scoreBoardTurn.textContent === 'X') {
      scoreBoardTurn.textContent = 'O';
    }

    if (!!button.textContent || !!GameBoard.getResult()) {
      return;
    }

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

const playAi = () => {
  buttons.forEach(button => button.addEventListener('click', () => {

    if (!!button.textContent || !!GameBoard.getResult()) {
      return;
    }
    
    button.textContent = playerX.getXo();
    GameBoard.updateBoard(button.id, playerX.getXo());
    
    
    if (GameBoard.getAiCount() < 4) {
      GameBoard.checkWinner();
      if (GameBoard.getResult() != '') {
        return;
      }
      while (true) {
        let index = pc.RandomMove();
        if (!buttons[index].textContent) {
          
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

footerBtnsList.forEach(btn => btn.addEventListener('click', () => {

  if (btn.className.includes('choose-mode')) {

    location.reload();
  }

  if (btn.className.includes('reset-game')) {
    if (GameBoard.getResult() === '') {

      GameBoard.resetBoard();
      buttons.forEach(btn => btn.textContent = '');
    }
  }

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

// chooseButtons.forEach(btn => {
//   btn.addEventListener('click', () => {
//     if (btn.className.includes('player')) {

//       boardContainer.classList.remove('display');
//       parent.classList.remove('display');
//       playHuman();

//     } else if (btn.className.includes('ai')) {
      
//       boardContainer.classList.remove('display');
//       parent.classList.remove('display');
//       playAi();

//     }
//     chooseContainer.classList.add('display');
//   })
// })

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

// const playAi = () => {

  //   if (current === 'X') {
  
  //     buttons.forEach(button => button.addEventListener('click', () => {
  
  //       if (!!button.textContent || !!GameBoard.getResult()) {
  //         return;
  //       }
  
  //       button.textContent = playerX.getXo();
  //       GameBoard.updateBoard(button.id, playerX.getXo());
  //       current = 'O';
  //       console.log(current);
  //       let ai = GameBoard.AI();
  //       while (!!buttons[ai]) {
  //         buttons[ai].textContent = playerO.getXo();
  //         GameBoard.updateBoard(ai, playerO.getXo());
  //       }
  //       current = 'X';
  //       return;
  //     }))
  //   } else if (current === 'O') {
  //     console.log(current + 'ai');
  //     let ai = GameBoard.AI();
  //     while (buttons[ai].textContent === '') {
  //       buttons[ai].textContent = playerO.getXo();
  //       GameBoard.updateBoard(ai, playerO.getXo());
  //     }
  //     current = 'X';
  //   }
  
  //   GameBoard.checkWinner();
  // }