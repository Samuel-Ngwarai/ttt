import { Socket, io } from "socket.io-client";

const localUrl = "http://localhost:3001";

let socketIoClient: Socket;

export const initializeSocketIoClient = () => {
  const config = useNuxtApp().$config;

  const tttServerUrl =
    config.nodeEnv === "production" ? config.tttServerUrl : localUrl;

  socketIoClient = io(tttServerUrl, {
    autoConnect: false,
  });
};

export const getSocketIoClient = () => {
  return socketIoClient;
};
