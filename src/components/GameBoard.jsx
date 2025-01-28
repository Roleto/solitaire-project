export default function GameBoard({ onSelectSquare, board }) {
  return (
    <ol id="game-board">
      {board.map((row, rowIndex) => (
        <li key={rowIndex}>
          <ol>
            {row.map((something, colIndex, boardItems) => (
              <li key={colIndex}>
                <button
                  style={{
                    color: boardItems[colIndex] ? boardItems[colIndex].color : 'black',
                  }}
                  onClick={() => onSelectSquare(rowIndex, colIndex)}
                  disabled={boardItems[colIndex] != null}
                >
                  {boardItems[colIndex] ? boardItems[colIndex].symbol : null}
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
