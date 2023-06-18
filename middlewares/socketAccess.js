import { SECRET_ACCESS_KEY } from "../config";
import UserModel from "../database/models/User";
import Jwt from "../services/Jwt";

export const verifySocketAccess = async (userDetails, accesstoken, socket) => {
  try {
    const { id } = Jwt.verify(accesstoken, SECRET_ACCESS_KEY);
    userDetails.userId = id;
  } catch (error) {
    socket.emit("invalidUser");
  }

  try {
    const { _id, name, photoURL, points } = await UserModel.findById(
      userDetails.userId
    ).select("_id name photoURL points");
    userDetails.userName = name;
    const dataObj = {
      id: _id,
      name,
      photoURL,
      points,
    };
    socket.emit("connectionSuccess", dataObj);
  } catch (err) {
    socket.emit("invalidUser");
  }
};
