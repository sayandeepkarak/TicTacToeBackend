export const getPlayers = async (io, socket) => {
  const users = await io.sockets.fetchSockets();
  socket.emit("newConnection", users.length);
};
