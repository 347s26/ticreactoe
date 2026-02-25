import { useState } from "react";

export function Game() {
  // const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  // const currentSquares = history[history.length - 1];
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;


  function handlePlay(nextSquares) {
    // setHistory([...history, nextSquares])
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    // setXIsNext(!xIsNext)
  }

  function jumpTo(nextMove) {
    // TODO
    return () => {
      console.log('jump to', nextMove);
      setCurrentMove(nextMove);
      // setXIsNext(nextMove % 2 === 0);
    }
  }

  const moves = history.map((squares, move) => {
    let description = 'Go to game start';
    if (move > 0) {
      description = `Go to move #${move}`
    }
    return (
      <li key={move}>
        <button onClick={jumpTo(move)}>{description}</button>
      </li>
    )
  })

  console.log('currentSquares', currentSquares)
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

export function Board({ xIsNext, squares, onPlay }) {
  // const [xIsNext, setXIsNext] = useState(true);
  // const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    return (ev) => {
      console.log('clicked')
      if (!squares || squares[i] || calculateWinner(squares)) return;
      const nextSquares = squares.slice();
      if (xIsNext) {
        nextSquares[i] = "X";
      } else {
        nextSquares[i] = "O";
      }
      onPlay(nextSquares)
      // setSquares(nextSquares)
      // setXIsNext(!xIsNext)
    }
  }


  console.log('squares', squares);
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }



  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={handleClick(0)} />
        <Square value={squares[1]} onSquareClick={handleClick(1)} />
        <Square value={squares[2]} onSquareClick={handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={handleClick(3)} />
        <Square value={squares[4]} onSquareClick={handleClick(4)} />
        <Square value={squares[5]} onSquareClick={handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={handleClick(6)} />
        <Square value={squares[7]} onSquareClick={handleClick(7)} />
        <Square value={squares[8]} onSquareClick={handleClick(8)} />
      </div>
    </>
  );
}

export function Square({ value, onSquareClick }) {
  // const [value, setValue] = useState(null)
  // function handleClick() {
  //   console.log('clicked')
  // }
  return <button className="square" onClick={onSquareClick}>{value}</button>
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}