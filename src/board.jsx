import { useEffect, useState } from "react";
import "./styles.css";

const solutions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

const useStateWithLocalStorage = (key, defaultValue) => {
  const [state, setState] = useState(
    () => JSON.parse(window.localStorage.getItem(key)) || defaultValue
  );

  const cleanLocalStorage = () => {
    window.localStorage.removeItem(key)
  }

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state))
  }, state)

  return [state, setState, cleanLocalStorage]
};

const emptyBoard = Array(9).fill(null);

function Board() {
  const [board, setBoard, cleanLocalStorage] = useStateWithLocalStorage('tictactoe', emptyBoard)

  const [turnX, setTurnX] = useState(true);
  const [gameEnd, setGameEnd] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    solutions.forEach((solution) => {
      if (
        board[solution[0]] === "X" &&
        board[solution[1]] === "X" &&
        board[solution[2]] === "X"
      ) {
        setGameEnd(true);
        setWinner("X");
        return;
      }

      if (
        board[solution[0]] === "O" &&
        board[solution[1]] === "O" &&
        board[solution[2]] === "O"
      ) {
        console.log("O", solution);
        setGameEnd(true);
        setWinner("O");
        return;
      }
    });
  }, [board]);

  const getMark = () => (turnX ? "X" : "O");
  const handleCheck = (e) => {
    if (gameEnd || board[+e.target.id]) {
      return;
    }

    setBoard((prev) =>
      prev.map((c, idx) => (idx === +e.target.id ? getMark() : c))
    );

    setTurnX((p) => !p);
  };

  const reset = () => {
    setBoard(emptyBoard);
    setWinner(null);
    setGameEnd(false);
    setTurnX(true);
  };

  const renderBoard = () => {
    return (
      <>
        {board.map((cell, index) => (
          <div key={index} id={index} className="box" onClick={handleCheck}>
            {cell}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="App">
      <div className="container">{renderBoard()}</div>
      {gameEnd && <h4>Game ended. Winner is {winner}</h4>}
      <button onClick={reset}>Restart</button>
      <button onClick={cleanLocalStorage}>
        Clear local storage
      </button>
    </div>
  );
}

export default Board;
