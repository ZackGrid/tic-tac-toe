
const boardContainer = document.querySelector('.container');
const scoreBoard = document.querySelector('.score-board');
const chooseContainer = document.querySelector('.choose');
const chooseButtons = document.querySelectorAll('.choice');
const parent = document.querySelector('.parent-container');

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

  const updateBoard = (house, xO) => {
    board[house] = xO;
  }

  const resultData = document.createElement('div');
  let turns = 0;
  let result = '';

  const checkWinner = () => {

    function check(n1, n2, n3) {
      if (!n1) return;
      if (n1 === n2 && n2 === n3) result = n1;
    }

    check(board[0], board[1], board[2]);
    check(board[3], board[4], board[5]);
    check(board[6], board[7], board[8]);
    check(board[0], board[3], board[6]);
    check(board[1], board[4], board[7]);
    check(board[2], board[5], board[8]);
    check(board[0], board[4], board[8]);
    check(board[2], board[4], board[6]);

    turns += 1;

    if (turns >= 9 && !result) {
      result = 'Draw';
      resultData.textContent = `The result is a Draw`;
      scoreBoard.appendChild(resultData);
    } else if (result) {
      resultData.textContent = `The Winner is ${result}`;
      scoreBoard.appendChild(resultData);
    }
  };

  function getResult() {
    return result;
  }

  return { updateBoard, checkWinner, getResult};

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
let aiCount = 0;

// Each click will check if there's a winner and update the board
// also it cycles between players with each click
const playHuman = () => {
  buttons.forEach(button => button.addEventListener('click', () => {

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
    
    
    if (aiCount < 4) {
      while (true) {
        let index = pc.RandomMove();
        if (!buttons[index].textContent) {
          
          setTimeout(() => {
            buttons[index].textContent = pc.getXo();
          }, 200)
          
          GameBoard.updateBoard(buttons[index].id, pc.getXo());
          aiCount += 1;
          GameBoard.checkWinner();
          break;
        }
      }
   }
    
   
    // let index = pc.RandomMove();
    // console.log(index);
    // while (!buttons[index].textContent) {
    //   buttons[index].textContent = pc.getxO();
    //   console.log(index);
    //   break
    // }    

    GameBoard.checkWinner();
  }));
}

chooseButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.className.includes('player')) {

      boardContainer.classList.remove('display');
      parent.classList.remove('display');
      setTimeout(() => {
        boardContainer.classList.remove('visually-hidden');
        parent.classList.remove('visually-hidden');
      }, 10);
      
      playHuman();
      

    } else if (btn.className.includes('ai')) {
      
      boardContainer.classList.remove('display');
      parent.classList.remove('display');
      setTimeout(() => {
        boardContainer.classList.remove('visually-hidden');
        parent.classList.remove('visually-hidden');
      }, 10);
      playAi();

    }
    chooseContainer.classList.add('display');
  })
})


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