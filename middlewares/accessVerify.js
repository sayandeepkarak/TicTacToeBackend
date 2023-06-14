import { SECRET_ACCESS_KEY } from "../config";
import OwnError from "../services/Error";
import Jwt from "../services/Jwt";

const verifytoken = (req, res, next) => {
  const { accesstoken } = req.cookies;
  if (!accesstoken) {
    return next(OwnError.unAuthorizedError());
  }
  try {
    const { id } = Jwt.verify(accesstoken, SECRET_ACCESS_KEY);
    req.userId = id;
    next();
  } catch (error) {
    console.log(error);
    next(OwnError.unAuthorizedError("Invalid access token"));
  }
};

export default verifytoken;
