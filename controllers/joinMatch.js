import RoomModel from "../database/models/Room";
import UserModel from "../database/models/User";

export const joinMatch = async (matchId, userId, socket) => {
  try {
    const data = await RoomModel.findById(matchId);
    if (data && data.players.includes(userId)) {
      socket.join(matchId);
      const userOne = await UserModel.findById(data.players[0]).select(
        "_id name photoURL"
      );
      const userTwo = await UserModel.findById(data.players[1]).select(
        "_id name photoURL"
      );
      const roomPlayers = {
        users: {
          names: [userOne.name, userTwo.name],
          userId: [userOne._id, userTwo._id],
          images: [userOne.photoURL, userTwo.photoURL],
        },
      };
      const matchInfo = {
        simulations: data.simulation,
        round: data.round,
        points: data.points,
        turn: data.turn,
        step: data.step,
      };
      socket.emit("joinSuccess", roomPlayers);
      socket.emit("takeMatchInfo", matchInfo);
    } else {
      socket.emit("invalidRoom");
    }
  } catch (err) {
    setTimeout(() => {
      socket.emit("invalidRoom");
    }, 5000);
    console.log(err);
  }
};
