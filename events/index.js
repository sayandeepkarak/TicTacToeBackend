import { Server } from "socket.io";
import { getPlayers } from "../controllers/getPlayers";
import { cancleMatch } from "../controllers/cancelMatch";
import { requestMatch } from "../controllers/requestMatch";
import { verifySocketAccess } from "../middlewares/socketAccess";
import { joinMatch } from "../controllers/joinMatch";
import { simulate } from "../controllers/updateSimulation";
import UserModel from "../database/models/User";
import RoomModel from "../database/models/Room";
import finishMatch from "../controllers/forceFinishMatch";

const createSocketServer = (server) => {
  const io = new Server(server, { cors: ["http://localhost:5173/"] });

  const waitListPlayers = [];

  io.on("connection", async (socket) => {
    let leftTimer = undefined;
    const { accesstoken, matchId } = socket.handshake.query;
    let userDetails = { userId: "", userName: "" };
    if (accesstoken) {
      await verifySocketAccess(userDetails, accesstoken, socket);
      const users = await io.sockets.fetchSockets();
      socket.emit("newConnection", users.length);
      console.log(`${userDetails.userName} connected`);

      if (matchId) {
        await joinMatch(matchId, userDetails.userId, socket);
        if (!leftTimer) {
          socket.to(matchId).emit("opponentReconnect");
        }
      }
      io.sockets.emit("newConnection", users.length);
    } else {
      socket.disconnect();
    }

    socket.on("getPlayers", () => {
      getPlayers(io, socket);
    });

    socket.on("cancelMatchMaking", () => {
      cancleMatch(waitListPlayers, userDetails.userId);
    });

    socket.on("requestMatch", async () => {
      requestMatch(waitListPlayers, socket, io, userDetails.userId);
    });

    socket.on("updateSimulation", async (position, matchId) => {
      simulate(position, matchId, userDetails, socket);
    });

    socket.on("getRoomMembers", async () => {
      if (matchId) {
        const members = await io.to(matchId).fetchSockets();
        socket.emit("takeRoomMembers", members.length);
      }
    });

    socket.on("disconnect", () => {
      io.sockets.emit("userLeft");
      if (matchId) {
        io.to(matchId).emit("opponentLeft");
        setTimeout(() => {
          finishMatch(matchId, userDetails, io);
        }, 59000);
      } else if (waitListPlayers.includes(userDetails.userId)) {
        waitListPlayers.splice(0, 1);
      }
      console.log(`${userDetails.userName} disconnected`);
    });
  });
};

export default createSocketServer;
