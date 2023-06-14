import { Server } from "socket.io";
import { getPlayers } from "../controllers/getPlayers";
import { cancleMatch } from "../controllers/cancelMatch";
import { requestMatch } from "../controllers/requestMatch";
import { verifySocketAccess } from "../middlewares/socketAccess";
import { joinMatch } from "../controllers/joinMatch";
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

const checkMatch = (allValues) => {
  for (let i = 0; i < wins.length; i++) {
    const first = allValues[wins[i][0]];
    const second = allValues[wins[i][1]];
    const third = allValues[wins[i][2]];
    if (first === second && second === third && ["X", "O"].includes(third)) {
      return wins[i];
    }
  }
  return false;
};

const createSocketServer = (server) => {
  const io = new Server(server, { cors: ["http://localhost:5173/"] });

  const waitListPlayers = [];

  io.on("connection", async (socket) => {
    const { accesstoken, matchId } = socket.handshake.query;

    let userDetails = { userId: "", userName: "" };
    if (accesstoken) {
      await verifySocketAccess(
        userDetails,
        accesstoken,
        socket,
        Boolean(matchId)
      );
      const users = await io.sockets.fetchSockets();
      socket.emit("newConnection", users.length);
      console.log(`${userDetails.userName} connected`);

      if (matchId) {
        await joinMatch(matchId, userDetails.userId, socket);
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
      try {
        const data = await RoomModel.findById(matchId);
        if (data.players[data.turn] === userDetails.userId) {
          let newData = [...data.simulation];
          newData[position] = data.turn ? "X" : "O";
          const { simulation, round, points, turn, step } =
            await RoomModel.findByIdAndUpdate(
              matchId,
              {
                simulation: newData,
                turn: data.turn ? 0 : 1,
                step: data.step + 1,
              },
              { new: true }
            );

          let matchInfo = {
            simulations: simulation,
            round,
            points,
            turn,
          };
          socket.to(matchId).emit("takeMatchInfo", matchInfo);
          socket.emit("takeMatchInfo", matchInfo);

          if (step > 4) {
            const result = checkMatch(simulation);
            if (result) {
              const { simulation, round, points, turn, step } =
                await RoomModel.findByIdAndUpdate(
                  matchId,
                  {
                    simulation: Array(9).fill(""),
                    turn: 0,
                    step: 0,
                    round: data.round + 1,
                    points: data.turn
                      ? [data.points[0], data.points[1] + 1]
                      : [data.points[0] + 1, data.points[1]],
                  },
                  { new: true }
                );
              matchInfo = {
                simulations: simulation,
                round,
                points,
                turn,
                step,
              };
              socket.emit("getRoundWin", result);
              socket.to(matchId).emit("getRoundWin", result);
              setTimeout(() => {
                socket.to(matchId).emit("finishRound", matchInfo);
                socket.emit("finishRound", matchInfo);
              }, 2000);
            } else if (step === 9 && !result) {
              const { simulation, round, points, turn, step } =
                await RoomModel.findByIdAndUpdate(
                  matchId,
                  {
                    simulation: Array(9).fill(""),
                    turn: 0,
                    step: 0,
                    round: data.round + 1,
                  },
                  { new: true }
                );
              matchInfo = {
                simulations: simulation,
                round,
                points,
                turn,
                step,
              };
              setTimeout(() => {
                socket.to(matchId).emit("finishRound", matchInfo);
                socket.emit("finishRound", matchInfo);
              }, 2000);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", () => {
      io.sockets.emit("userLeft");
      console.log(`${userDetails.userName} disconnected`);
    });
  });
};

export default createSocketServer;
