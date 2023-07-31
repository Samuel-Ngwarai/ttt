import { defineStore } from "pinia"

export const useLetterStore = defineStore('counter', () => {
    const myLetter: Ref<'X' | 'O'> = ref('X');
    const alternativeLetter: Ref<'X' | 'O'> = ref('O');
    const gameOver = ref(false);
    const sessionId = ref('');
    const currentState = ref('');
    const connectionState = ref('Disconnected');

    const socketsState = reactive({
        connected: false,
        fooEvents: [],
        barEvents: []
    });

    const board = reactive([
        ['-', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-'],
    ]);

    const updateBoard = (x: number, y: number, letter?: 'X' | 'O') => {
        if (board[x][y] !== '-') throw new Error('Position already filled');

        board[x][y] = letter ?? myLetter.value;
    };

    const setMyLetter = (playerLetter: 'X' | 'O') => {
        myLetter.value = playerLetter;
        alternativeLetter.value = playerLetter === 'X' ? 'O' : 'X';
    }

    return {
        updateBoard,
        gameOver,
        setMyLetter,
        myLetter,
        currentState,
        alternativeLetter,
        sessionId,
        board,
        connectionState,
        socketsState
    }
})