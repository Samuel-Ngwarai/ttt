import { Socket, io } from "socket.io-client";

let socketIoClient: Socket;

export const initializeSocketIoClient = () => {
  const config = useNuxtApp().$config;

  socketIoClient = io(config.public.tttServerUrl, {
    autoConnect: false,
  });
};

export const getSocketIoClient = () => {
  return socketIoClient;
};
