import RoomModel from "../database/models/Room";
import UserModel from "../database/models/User";

const finishMatch = async (matchId, userDetails, io) => {
  try {
    const { players } = await RoomModel.findById(matchId).select("players");
    const [winnerId] = players.filter((e) => e !== userDetails.userId);
    const { points } = await UserModel.findById(winnerId).select("points");
    io.to(matchId).emit("forceFinish", winnerId);
    await UserModel.findByIdAndUpdate(winnerId, {
      $set: { points: points + 5 },
    });
    await RoomModel.findByIdAndDelete(matchId);
  } catch (error) {}
};

export default finishMatch;
