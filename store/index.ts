import { defineStore } from "pinia";

export enum ConnectionStateEnum {
  Connected = 'Connected',
  Disconnected = 'Disconnected',
  Waiting = 'Waiting'
}

export enum CurrentGameStateEnum {
  InitialState = 'InitialState',
  Waiting = 'Waiting',
  Playing = 'Playing',
  EndDraw = 'EndDraw',
  EndWin = 'EndWin',
  EndLose = 'EndLose'
}

export const useLetterStore = defineStore("counter", () => {
  const myLetter: Ref<"X" | "O"> = ref("X");
  const alternativeLetter: Ref<"X" | "O"> = ref("O");
  const sessionId = ref("");
  const currentState = ref<CurrentGameStateEnum>(CurrentGameStateEnum.InitialState);
  const connectionState = ref<ConnectionStateEnum>(ConnectionStateEnum.Disconnected);

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
