import { Server } from "socket.io";
import RoomModel from "../database/models/Room";

const wins = [
  [0, 1, 2],
  [0, 3, 6],
  [6, 7, 8],
  [2, 5, 8],
  [3, 4, 5],
  [1, 4, 7],
  [0, 4, 8],
  [2, 4, 6],
];

const createSocketServer = (server) => {
  const io = new Server(server, { cors: ["http://localhost:5173/"] });

  const waitListPlayers = [];

  io.on("connection", (socket) => {
    const { name } = socket.handshake.query;
    if (name) {
      io.sockets.emit("newConnection");
      console.log(`${name} connected`);
    }

    socket.on("getPlayers", async () => {
      const users = await io.sockets.fetchSockets();
      socket.emit("recieveAllPlayer", users.length);
    });

    socket.on("cancelMatchMaking", () => {
      waitListPlayers.splice(waitListPlayers.indexOf(socket.id));
      console.log(waitListPlayers);
    });

    socket.on("requestMatch", async () => {
      if (waitListPlayers.length > 0) {
        console.log(waitListPlayers.length);

        const users = [socket.id, waitListPlayers[0]];
        try {
          const newRoom = new RoomModel({
            players: users,
            simulation: Array(9).fill(""),
          });
          const { _id } = await newRoom.save();

          socket.emit("successMatchMaking", _id, users);
          io.to(users[1]).emit("successMatchMaking", _id, users);

          waitListPlayers.splice(0, 1);
        } catch (error) {
          console.log(error);
          console.log("Room creation failed");
        }
      } else {
        waitListPlayers.push(socket.id);
        socket.join(socket.id);
      }
      console.log(waitListPlayers);
    });

    socket.on("updateSimulation", async (matchId) => {
      try {
        const data = await RoomModel.findById(matchId).select("simulations");
        socket.emit("recieveSimlations", data);
      } catch (err) {
        console.log("Simlations find failed");
      }
    });

    socket.on("disconnect", () => {
      io.sockets.emit("userLeft");
    });
  });
};

export default createSocketServer;
