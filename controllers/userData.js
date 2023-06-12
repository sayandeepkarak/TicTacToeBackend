import UserModel from "../database/models/User";

const getUserData = async (req, res, next) => {
  try {
    const { _id, name, photoURL, points } = await UserModel.findById(
      req.userId
    ).select("_id name photoURL points");
    res.status(200).json({ id: _id, name, photoURL, points });
  } catch (error) {
    next();
  }
};

export default getUserData;
