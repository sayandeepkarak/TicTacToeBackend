import { SECRET_ACCESS_KEY } from "../../config";
import OwnError from "../../services/Error";
import Jwt from "../../services/Jwt";
import UserModel from "../../database/models/User";

const generatetoken = async (req, res, next) => {
  const { refreshtoken } = req.cookies;
  if (!refreshtoken) {
    return next(OwnError.unAuthorizedError());
  }
  try {
    let data = await UserModel.findOne({ refreshtoken });
    if (!data) {
      return next(OwnError.unAuthorizedError("Invalid refresh token"));
    }

    let userId;
    try {
      const { id } = Jwt.verify(refreshtoken);
      userId = id;
    } catch (error) {
      await UserModel.findByIdAndUpdate(data._id, { refreshtoken: "" });
      return next(OwnError.unAuthorizedError("Invalid refresh token"));
    }

    data = await UserModel.findOne({ _id: userId });
    if (!data) {
      return next(OwnError.notFoundError("User not found"));
    }

    const newRefreshToken = Jwt.sign({ id: userId }, "90d");
    const newAccessToken = Jwt.sign({ id: userId }, "1m", SECRET_ACCESS_KEY);

    await UserModel.findByIdAndUpdate(data._id, {
      $set: { refreshtoken: newRefreshToken },
    });

    const d1 = new Date();
    const d2 = new Date();
    d1.setMonth(d1.getMonth() + 3);
    d2.setMinutes(d2.getMinutes() + 1);

    res
      .cookie("refreshtoken", newRefreshToken, { expires: d1 })
      .cookie("accesstoken", newAccessToken, { expires: d2 })
      .status(200)
      .json({ message: "Token created successfully" });
  } catch (error) {
    console.log(error);
    next();
  }
};

export default generatetoken;
