import RoomModel from "../database/models/Room";
import UserModel from "../database/models/User";

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

function checkMatch(allValues) {
  for (let i = 0; i < wins.length; i++) {
    const first = allValues[wins[i][0]];
    const second = allValues[wins[i][1]];
    const third = allValues[wins[i][2]];
    if (first === second && second === third && ["X", "O"].includes(third)) {
      return wins[i];
    }
  }
  return false;
}

export async function simulate(position, matchId, userDetails, socket) {
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
        const isFinish = Boolean(data.round === 3);
        if (result) {
          const matchInfo = await updateRoom(matchId, {
            simulation: Array(9).fill(""),
            turn: data.turn,
            step: 0,
            round: isFinish ? data.round : data.round + 1,
            points: data.turn
              ? [data.points[0], data.points[1] + 1]
              : [data.points[0] + 1, data.points[1]],
          });
          socket.emit("getRoundWin", result);
          socket.to(matchId).emit("getRoundWin", result);
          emitRoundFinish(socket, matchId, matchInfo, isFinish);
          await matchFinish(isFinish, points, data, matchId);
        } else if (step === 9 && !result) {
          const matchInfo = await updateRoom(matchId, {
            simulation: Array(9).fill(""),
            turn: Number(!data.turn),
            step: 0,
            round: isFinish ? data.round : data.round + 1,
          });
          emitRoundFinish(socket, matchId, matchInfo, isFinish);
          await matchFinish(isFinish, points, data, matchId);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function matchFinish(isFinish, points, data, matchId) {
  if (isFinish) {
    if (points[0] !== points[1]) {
      const winIndex = points[0] > points[1] ? 0 : 1;
      const winId = data.players[winIndex];
      const userData = await UserModel.findById(winId).select("points");
      await UserModel.findByIdAndUpdate(winId, {
        $set: { points: userData.points + 5 },
      });
    }
    await RoomModel.findByIdAndDelete(matchId);
  }
}

function emitRoundFinish(socket, matchId, matchInfo, isFinish) {
  setTimeout(() => {
    socket.to(matchId).emit("finishRound", matchInfo, isFinish);
    socket.emit("finishRound", matchInfo, isFinish);
  }, 2000);
}

async function updateRoom(matchId, newData) {
  const { simulation, round, points, turn, step } =
    await RoomModel.findByIdAndUpdate(matchId, newData, { new: true });
  return {
    simulations: simulation,
    round,
    points,
    turn,
    step,
  };
}
