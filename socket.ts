import { reactive } from "vue";
import { io } from "socket.io-client";
import { useLetterStore } from "./store";


export const state = reactive({
    connected: false,
    fooEvents: [],
    barEvents: []
});
const letterStore = useLetterStore();


// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === "production" ? undefined : "http://localhost:3001";

export const socket = io('http://localhost:3001', {
    autoConnect: false
});

socket.on("connect", () => {
    if (socket.recovered) {
        // recovery was successful: socket.id, socket.rooms and socket.data were restored
        console.log('The state was just recovered for socket', { id: socket.id });
    }
    state.connected = true;
    console.log('Socket ID -> ', socket.id); // ojIckSD2jqNzOqIrAGzL
    socket.emit("establish-connection");
});

socket.on("disconnect", () => {
    state.connected = false;
});

socket.on("hello from server", (args) => {
    console.log(args);
});

socket.on('waiting-for-player-b', (args) => {
    console.log('waiting for player b');

    // currentState.value = args
});

socket.on('player-b', (args) => {
    console.log('I AM PLAYER B');
    letterStore.setMyLetter('b');
});


socket.on('player-a', (args) => {
    console.log('I AM PLAYER A');
    letterStore.setMyLetter('a');
});


// socket.on('next-move', (args) => {
//     console.log('I AM PLAYER A');

//     // currentState.value = args
// });



// socket.on("foo", (...args) => {
//     state.fooEvents.push(args);
// });

// socket.on("bar", (...args) => {
//     state.barEvents.push(args);
// });