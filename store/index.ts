import { defineStore } from "pinia";

export const useLetterStore = defineStore("counter", () => {
  const myLetter: Ref<"X" | "O"> = ref("X");
  const alternativeLetter: Ref<"X" | "O"> = ref("O");
  const sessionId = ref("");
  const currentState = ref("initial-state");
  const connectionState = ref("Disconnected");

  const socketsState = reactive({
    connected: false,
    fooEvents: [],
    barEvents: [],
  });

  let board = reactive([
    ["-", "-", "-"],
    ["-", "-", "-"],
    ["-", "-", "-"],
  ]);

  const resetBoard = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[i][j] = '-';
      }
    }
  }

  const updateBoard = (x: number, y: number, letter?: "X" | "O") => {
    if (board[x][y] !== "-") {
      throw new Error("Position already filled");
    }

    board[x][y] = letter ?? myLetter.value;
  };

  const setMyLetter = (playerLetter: "X" | "O") => {
    myLetter.value = playerLetter;
    alternativeLetter.value = playerLetter === "X" ? "O" : "X";
  };

  return {
    updateBoard,
    setMyLetter,
    myLetter,
    currentState,
    alternativeLetter,
    sessionId,
    board,
    connectionState,
    socketsState,
    resetBoard
  };
});
