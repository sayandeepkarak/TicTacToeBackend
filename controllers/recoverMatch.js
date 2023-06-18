import RoomModel from "../database/models/Room";

export const recovermatch = async (req, res, next) => {
  try {
    const data = await RoomModel.findOne({ players: { $in: [req.userId] } });
    if (data) {
      res.status(200).json({ matchId: data._id, players: data.players });
    } else {
      res.status(404).json({ message: "Not exist" });
    }
  } catch (error) {
    next();
  }
};
