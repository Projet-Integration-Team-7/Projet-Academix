import io from 'socket.io-client';

let socket;

export const initializeSocket = () => {
  if (!socket) {
    console.log("Trying to connect to " +'https://academixbackend-b7d3e8ece074.herokuapp.com/' )
    socket = io('https://academixbackend-b7d3e8ece074.herokuapp.com/', {autoConnect:false,transports: ['websocket']});
}
  socket.on('connect', () => {
    console.log("Connected to socket")
  })
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket.removeAllListeners(); // Remove all listeners to prevent memory leaks
    socket = null;
  }
};
