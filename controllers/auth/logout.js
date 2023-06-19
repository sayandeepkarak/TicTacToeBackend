import UserModel from "../../database/models/User";

const logout = async (req, res, next) => {
  try {
    await UserModel.findByIdAndUpdate(req.userId, {
      $set: { refreshtoken: "" },
    });
    res.status(200).json({ message: "Successfully logout" });
  } catch (error) {
    next();
  }
};

export default logout;
