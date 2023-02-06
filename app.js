
const boardContainer = document.querySelector('.container');
const scoreBoard = document.querySelector('.score-board');

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

    if (turns === 9 && !result) {
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

  return { updateBoard, checkWinner, getResult };

})();

const Player = (xo) => {
  getXo = () => xo;
  return { getXo };
};

const buttons = document.querySelectorAll('.btn');
const playerX = Player('X');
const playerO = Player('O');
let current = 'X';

// Each click will check if there's a winner and update the board
// also it cycles between players with each click
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


// reset.addEventListener('click', () => {
//   GameBoard.updateBoard();
// })

// const playGame = (xo, house) => {

// };

// const player = (xo, house) => {

//   const play = (xo, house) => {
//     gameBoard.board[house] = xo;
//   };
//   return { xo, play, house }
// };

// const zack = player('X', 0);

