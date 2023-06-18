import UserModel from "../database/models/User";

const getAllPlayers = async (req, res, next) => {
  try {
    const data = await UserModel.find()
      .select("name photoURL points")
      .sort({ points: -1 });
    res.status(200).json({ data });
  } catch (error) {
    next();
  }
};

export default getAllPlayers;
