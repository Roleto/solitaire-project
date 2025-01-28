import { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import Player from './components/Player';
import Log from './components/Log';
import GameOver from './components/GameOver';
import Player from './components/Player';

const IS_LOG_ENABLED = false;
let playerPoints = {};
let activePlayer = 'C';

const initialGameBoard = [
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
];

function deriveActivePlayer(gameTurns) {
  let curPlayer = 'C';
  if (gameTurns.length > 0) {
    if (gameTurns[0].player === 'C') {
      curPlayer = 'M';
    }
    if (gameTurns[0].player === 'M') {
      curPlayer = 'T';
    }
    if (gameTurns[0].player === 'T') {
      curPlayer = 'C';
    }
  }

  return curPlayer;
}
function InitilizePoints() {
  playerPoints['C'] = 0;
  playerPoints['M'] = 0;
  playerPoints['T'] = 0;
}
function switchColor(symbol) {
  if (symbol == 'C') {
    return 'green';
  } else if (symbol == 'M') {
    return 'blue';
  } else {
    return 'red';
  }
}
function checkForAlign(rowIndex, colIndex, symbol, gameBoard) {
  let curDirectionIndex = 0;
  let isPositiveDir = true;
  let foundedIndexes = [];
  let outputIndexes = [];

  const directions = [
    { rowDir: -1, colDir: -1 },
    { rowDir: -1, colDir: 0 },
    { rowDir: -1, colDir: 1 },
    { rowDir: 0, colDir: -1 },
  ];
  let currentIndex = {
    rowIndex: rowIndex,
    colIndex: colIndex,
  };
  let nextIndex = {};
  do {
    if (isPositiveDir) {
      nextIndex = {
        rowIndex: currentIndex.rowIndex + directions[curDirectionIndex].rowDir,
        colIndex: currentIndex.colIndex + directions[curDirectionIndex].colDir,
      };
    } else {
      nextIndex = {
        rowIndex: currentIndex.rowIndex - directions[curDirectionIndex].rowDir,
        colIndex: currentIndex.colIndex - directions[curDirectionIndex].colDir,
      };
    }
    if (
      nextIndex.rowIndex < 0 ||
      nextIndex.rowIndex > gameBoard.length - 1 ||
      nextIndex.colIndex < 0 ||
      nextIndex.colIndex > gameBoard[0].length - 1
    ) {
      currentIndex = {
        rowIndex: rowIndex,
        colIndex: colIndex,
      };
      if (isPositiveDir) {
        isPositiveDir = false;
      } else if (foundedIndexes.length >= 2) {
        outputIndexes = [...outputIndexes, ...foundedIndexes];
        isPositiveDir = true;
        curDirectionIndex++;
        foundedIndexes = [];
      } else {
        isPositiveDir = true;
        curDirectionIndex++;
        foundedIndexes = [];
      }
    } else {
      const nextBoard = gameBoard[nextIndex.rowIndex][nextIndex.colIndex];

      if (nextBoard && nextBoard.symbol === symbol) {
        foundedIndexes = [{ row: nextIndex.rowIndex, col: nextIndex.colIndex }, ...foundedIndexes];
        currentIndex = { ...nextIndex };
      } else {
        currentIndex = {
          rowIndex: rowIndex,
          colIndex: colIndex,
        };
        if (isPositiveDir) {
          isPositiveDir = false;
        } else if (foundedIndexes.length >= 2) {
          outputIndexes = [...outputIndexes, ...foundedIndexes];
          isPositiveDir = true;
          curDirectionIndex++;
          foundedIndexes = [];
        } else {
          isPositiveDir = true;
          curDirectionIndex++;
          foundedIndexes = [];
        }
      }
    }
  } while (curDirectionIndex < directions.length);
  if (outputIndexes.length < 2) {
    return { square: { row: rowIndex, col: colIndex, color: 'default' }, founIndexes: [] };
  } else {
    return {
      square: { row: rowIndex, col: colIndex, color: switchColor(symbol) },
      founIndexes: outputIndexes,
    };
  }
}

function App() {
  const [gameTurnState, setGameTurnState] = useState([]);
  const [winner, setWinner] = useState(null);
  useEffect(() => {
    InitilizePoints();
  }, []);

  useEffect(() => {
    activePlayer = deriveActivePlayer(gameTurnState);
  }, [gameTurnState]);

  let gameBoard = [...initialGameBoard.map((innerArray) => [...innerArray])];
  for (const turn of gameTurnState) {
    const { square, player } = turn;
    const { row, col, color } = square;

    gameBoard[row][col] = { symbol: player, color: color };
  }
  const hasEnd = gameTurnState.length == 25;

  function changePrevTurns(prevTurns, indexes = [], newColor) {
    let curPlayer;
    let winnerSymbol = null;
    let output = [];
    for (let i = 0; i < prevTurns.length; i++) {
      const turn = prevTurns[i];
      // for (turn of prevTurns) {
      const findItem = indexes.find((index) => index.row == turn.square.row && index.col == turn.square.col);
      if (findItem) {
        curPlayer = turn.player;
        output = [
          ...output,
          {
            square: { row: findItem.row, col: findItem.col, color: newColor },
            player: turn.player,
          },
        ];
      } else {
        output = [...output, turn];
      }
    }
    if (indexes.length == 2) {
      PlayerPoints[curPlayer]++;
      if (PlayerPoints[curPlayer] == 3) {
        winnerSymbol = curPlayer;
      }
    }
    return { newLastTurns: output, winner: winnerSymbol };
  }
  // function hasWinner(winner) {
  //   winner = winner;
  // }
  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurnState((prevTurns) => {
      const curPlayer = deriveActivePlayer(prevTurns);
      const { square, founIndexes: foundIndexes } = checkForAlign(rowIndex, colIndex, curPlayer, gameBoard);
      let { newLastTurns, winner } = changePrevTurns([...prevTurns], foundIndexes, square.color);
      if (winner) {
        setWinner(winner);
      }
      const copyTurn = [
        {
          square: square,
          player: curPlayer,
        },
        ...newLastTurns,
      ];
      return copyTurn;
    });
  }
  function handleRestart() {
    InitilizePoints();
    setGameTurnState([]);
    winner = null;
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
            turns={gameTurnState}
          />
          <button
            id="restart-button"
            onClick={handleRestart}
          >
            Restart
          </button>
        </div>
        {IS_LOG_ENABLED && <Log logs={gameTurnState} />}
      </main>
    </>
  );
}

export default App;
