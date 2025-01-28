import { useState, useEffect } from 'react';
import GameBoard from './components/gameBoard';
import Player from './components/player';
import Log from './components/Log';
import GameOver from './components/GameOver';

const IS_LOG_ENABLED = true;
let PlayerPoints = {};

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
    // console.log(curentIndex);
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
      nextIndex.rowIndex > gameBoard.length ||
      nextIndex.colIndex < 0 ||
      nextIndex.colIndex > gameBoard[0].length
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
        curentIndex = { ...nextIndex };
        foundedIndexes = [{ row: nextIndex.rowIndex, col: nextIndex.rowIndex }, ...foundedIndexes];
      } else {
        curentIndex = {
          rowIndex: rowIndex,
          colIndex: colIndex,
        };
        // console.log(foundedIndexes.length);
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
    // console.log(gameBoard[rowIndex][colIndex].symbol);
    // const valami = {
    //   square: { row: rowIndex, col: colIndex, color: switchColor(symbol) },
    //   founIndexes: outputIndexes,
    // };
    // console.log(valami);
    return {
      square: { row: rowIndex, col: colIndex, color: switchColor(symbol) },
      founIndexes: outputIndexes,
    };
  }
}
// function checkForAlign2(gameBoard) {
//   let tulfutgatlo = 0;
//   const directions = [
//     { rowDir: -1, colDir: -1 },
//     { rowDir: -1, colDir: 0 },
//     { rowDir: -1, colDir: 1 },
//     { rowDir: 0, colDir: -1 },
//   ];
//   for (let i = 0; i < gameBoard.length; i++) {
//     for (let y = 0; y < gameBoard[0].length; y++) {
//       let counter = 0;
//       dolog = [];
//       dologN = 0;
//       if (gameBoard[i][y] == null || gameBoard[i][y].color != 'default') {
//         continue;
//       }
//       let currentPos = { row: i, col: y };

//       for (let index = 0; index < directions.length; index++) {
//         const { rowDir, colDir } = directions[index];
//         do {
//           tulfutgatlo++;
//           if (
//             currentPos.row + rowDir < 0 ||
//             currentPos.row + rowDir > 4 ||
//             currentPos.col + colDir < 0 ||
//             currentPos.col + colDir > 4
//           ) {
//             break;
//           }
//           let nextSymbolPos = { row: currentPos.row + rowDir, col: currentPos.col + colDir };
//           if (
//             gameBoard[nextSymbolPos.row][nextSymbolPos.col] &&
//             gameBoard[nextSymbolPos.row][nextSymbolPos.col].symbol === gameBoard[i][y].symbol
//           ) {
//             currentPos = { row: nextSymbolPos.row, col: nextSymbolPos.col };
//             dologN++;
//             counter++;
//           } else {
//             break;
//           }
//         } while (tulfutgatlo < 30 && counter < 3);
//         if (counter > 2) {
//           switchColor(gameBoard);
//           break;
//         }
//         currentPos = { row: i, col: y };
//         tulfutgatlo = 0;
//         do {
//           tulfutgatlo++;
//           if (
//             currentPos.row - rowDir < 0 ||
//             currentPos.row - rowDir > 4 ||
//             currentPos.col - colDir < 0 ||
//             currentPos.col - colDir > 4
//           ) {
//             break;
//           }
//           let nextSymbolPos = { row: currentPos.row - rowDir, col: currentPos.col - colDir };
//           if (
//             gameBoard[nextSymbolPos.row][nextSymbolPos.col] &&
//             gameBoard[nextSymbolPos.row][nextSymbolPos.col].symbol === gameBoard[i][y].symbol
//           ) {
//             currentPos = { row: nextSymbolPos.row, col: nextSymbolPos.col };
//             dolog[dologN] = gameBoard[nextSymbolPos.row][nextSymbolPos.col];
//             dologN++;
//             counter++;
//           } else {
//             break;
//           }
//         } while (tulfutgatlo < 30 && counter < 3);

//         if (counter > 2) {
//           switchColor(gameBoard);
//         }
//       }
//     }
//   }
// }

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
    let output = [];
    for (let i = 0; i < prevTurns.length; i++) {
      // for (turn of prevTurns) {
      const turn = prevTurns[i];
      const findItem = indexes.find((index) => index.row == turn.square.row && index.col == turn.square.col);
      if (findItem) {
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
    return output;
  }

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((prevTurns) => {
      const curPlayer = deriveActivePlayer(prevTurns);
      const { square, founIndexes } = checkForAlign(rowIndex, colIndex, curPlayer, gameBoard);
      let newLastTurns = changePrevTurns([...prevTurns], founIndexes, square.color);
      // if (founIndexes.length >= 2) {
      //   console.log(newLastTurns);
      // }
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
  }
  let winner = false;
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
            turns={gameTurns}
          />
        </div>
        {IS_LOG_ENABLED && <Log logs={gameTurns} />}
      </main>
    </>
  );
}

export default App;
