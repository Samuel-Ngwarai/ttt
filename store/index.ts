import { defineStore } from "pinia"

export const useLetterStore = defineStore('counter', () => {
    const nextLetter = ref('X')
    const myLetter: Ref<'X' | 'O'> = ref('X');
    const gameOver = ref(false);
    const winner = ref('');
    let filledPositions = 0;

    const board = [
        ['-', '-', '-'],
        ['-', '-', '-'],
        ['-', '-', '-'],
    ];

    const currentLetter = () => {
        const temp = nextLetter.value;
        nextLetter.value = nextLetter.value === 'X' ? 'O' : 'X';
        return temp;
    }

    const isWin = (first: string, second: string, third: string, letter: string) => {
        return first === letter && second === letter && third === letter;
    }

    const checkForWin = (x: number, y: number, letter: string): boolean => {
        // check horizontal and vertical
        if (isWin(board[0][y], board[1][y], board[2][y], letter)
            || isWin(board[x][0], board[x][1], board[x][2], letter)) return true;

        // check diagonal
        const notOnDiagonals = ['1:0', '0:1', '2:1', '1:2'];
        if (notOnDiagonals.indexOf(`${x}:${y}`) !== -1) return false;

        // forward diagonal
        if (x === y && isWin(board[0][0], board[1][1], board[2][2], letter)) return true;

        if ((x !== y || x === 1) && isWin(board[2][0], board[1][1], board[0][2], letter)) return true

        return false;

    }

    const updateBoard = (x: number, y: number, letter: string) => {
        filledPositions++;
        if (board[x][y] !== '-') throw new Error('Position already filled');

        board[x][y] = letter;

        if (checkForWin(x, y, letter)) {
            gameOver.value = true;
            winner.value = letter;
            return;
        }

        if (filledPositions === 9) {
            gameOver.value = true;
            winner.value = 'draw'
        }

    };

    const setMyLetter = (player: string) => {
       myLetter.value = player === 'a' ? 'X' : 'O';
    }

    return { currentLetter, updateBoard, gameOver, winner, setMyLetter, myLetter }
})