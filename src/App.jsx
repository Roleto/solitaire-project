import { useState, useEffect } from 'react';
import GameBoard from './components/gameBoard';
import Player from './components/player';
import Log from './components/Log';
import GameOver from './components/GameOver';

const IS_LOG_ENABLED = false;
let PlayerPoints = {};
let Winner = null;

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
function InitilizePoints() {
  PlayerPoints['C'] = 0;
  PlayerPoints['M'] = 0;
  PlayerPoints['T'] = 0;
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
  let curentIndex = {
    rowIndex: rowIndex,
    colIndex: colIndex,
  };
  let nextIndex = {};
  do {
    if (isPositiveDir) {
      nextIndex = {
        rowIndex: curentIndex.rowIndex + directions[curDirectionIndex].rowDir,
        colIndex: curentIndex.colIndex + directions[curDirectionIndex].colDir,
      };
    } else {
      nextIndex = {
        rowIndex: curentIndex.rowIndex - directions[curDirectionIndex].rowDir,
        colIndex: curentIndex.colIndex - directions[curDirectionIndex].colDir,
      };
    }
    if (
      nextIndex.rowIndex < 0 ||
      nextIndex.rowIndex > gameBoard.length - 1 ||
      nextIndex.colIndex < 0 ||
      nextIndex.colIndex > gameBoard[0].length - 1
    ) {
      curentIndex = {
        rowIndex: rowIndex,
        colIndex: colIndex,
      };
      if (isPositiveDir) {
        isPositiveDir = false;
      } else {
        isPositiveDir = true;
        curDirectionIndex++;
        foundedIndexes = [];
      }
    } else {
      const nextBoard = gameBoard[nextIndex.rowIndex][nextIndex.colIndex];
      if (nextBoard && nextBoard.symbol === symbol) {
        foundedIndexes = [{ row: nextIndex.rowIndex, col: nextIndex.colIndex }, ...foundedIndexes];
        curentIndex = { ...nextIndex };
      } else {
        curentIndex = {
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
  const [gameTurns, setGameTurns] = useState([]);
  let activePlayer = deriveActivePlayer(gameTurns);
  useEffect(() => {
    InitilizePoints();
  }, []);

  let gameBoard = [...initialGameBoard.map((innerArray) => [...innerArray])];
  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col, color } = square;

    gameBoard[row][col] = { symbol: player, color: color };
  }
  const hasEnd = gameTurns.length == 25;

  function changePrevTurns(prevTurns, indexes = [], newColor) {
    let curPlayyer;
    let winner = null;
    let output = [];
    for (let i = 0; i < prevTurns.length; i++) {
      const turn = prevTurns[i];
      // for (turn of prevTurns) {
      const findItem = indexes.find((index) => index.row == turn.square.row && index.col == turn.square.col);
      if (findItem) {
        curPlayyer = turn.player;
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
      PlayerPoints[curPlayyer]++;
      if (PlayerPoints[curPlayyer] == 3) {
        winner = curPlayyer;
      }
    }
    return { newLastTurns: output, winner: winner };
  }
  function hasWinner(winner) {
    Winner = winner;
  }
  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const curPlayer = deriveActivePlayer(prevTurns);
      const { square, founIndexes } = checkForAlign(rowIndex, colIndex, curPlayer, gameBoard);
      let { newLastTurns, winner } = changePrevTurns([...prevTurns], founIndexes, square.color);
      // console.log(winner);
      if (winner) {
        hasWinner(winner);
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
    setGameTurns([]);
    Winner = null;
  }
  function winCondition() {}
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
          {(Winner || hasEnd) && (
            <GameOver
              winner={Winner}
              onRestart={handleRestart}
            />
          )}
          <GameBoard
            onSelectSquare={handleSelectSquare}
            activePlayerSymbol={activePlayer}
            board={gameBoard}
            turns={gameTurns}
          />
        </div>
        {IS_LOG_ENABLED && <Log logs={gameTurns} />}
      </main>
    </>
  );
}

export default App;
