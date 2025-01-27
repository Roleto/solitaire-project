import { useState } from 'react';
import GameBoard from './components/gameBoard';
import Player from './components/player';
import Log from './components/Log';
import GameOver from './components/GameOver';

const IS_LOG_ENABLED = false;

const initialGameBoard = [
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
];

function deriveActivePlayer(gameTurns) {
  let curPlayer = 'C';
  if (gameTurns.length > 0 && gameTurns[0].player === 'C') {
    curPlayer = 'M';
  }
  if (gameTurns.length > 0 && gameTurns[0].player === 'M') {
    curPlayer = 'T';
  }
  if (gameTurns.length > 0 && gameTurns[0].player === 'T') {
    curPlayer = 'C';
  }

  return curPlayer;
}

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  let activePlayer = deriveActivePlayer(gameTurns);

  let gameBoard = [...initialGameBoard.map((innerArray) => [...innerArray])];
  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }
  let winner = undefined;
  // for (const combination of WINNING_COMBINATIONS) {
  //   const firstSquare = gameBoard[combination[0].row][combination[0].column];
  //   const secondSquare = gameBoard[combination[1].row][combination[1].column];
  //   const thirdSquare = gameBoard[combination[2].row][combination[2].column];

  //   if (
  //     firstSquare &&
  //     firstSquare === secondSquare &&
  //     firstSquare === thirdSquare
  //   ) {
  //     winner = firstSquare;
  //   }
  // }

  // const hasDraw = gameTurns.length == 25 && !winner;
  const hasEnd = gameTurns.length == 25;

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const curPlayer = deriveActivePlayer(prevTurns);
      const copyTurn = [
        { square: { row: rowIndex, col: colIndex }, player: curPlayer },
        ...prevTurns,
      ];
      return copyTurn;
    });
  }
  function handleRestart() {
    setGameTurns([]);
  }
  return (
    <>
      <main>
        <div id="game-container">
          <ol
            id="players"
            className="highlight-player"
          >
            <Player
              name="Player1"
              symbol="C"
              isActive={activePlayer === 'C'}
            />
            <Player
              name="Player2"
              symbol="M"
              isActive={activePlayer === 'M'}
            />
            <Player
              name="Player3"
              symbol="T"
              isActive={activePlayer === 'T'}
            />
          </ol>
          {(winner || hasEnd) && (
            <GameOver
              winner={winner}
              onRestart={handleRestart}
            />
          )}
          <GameBoard
            onSelectSquare={handleSelectSquare}
            activePlayerSymbol={activePlayer}
            board={gameBoard}
          />
        </div>
        {IS_LOG_ENABLED && <Log logs={gameTurns} />}
      </main>
    </>
  );
}

export default App;
