import joi from "joi";
import OwnError from "../../services/Error";
import UserModel from "../../database/models/User";
import Jwt from "../../services/Jwt";

const createUser = async (req, res, next) => {
  const data = req.body;
  const bodySchema = joi.object({
    displayName: joi.string().required(),
    email: joi.string().email(),
    photoURL: joi.string().required(),
    isAnonymous: joi.boolean().required(),
    emailVerified: joi.boolean().required(),
  });
  const { error } = bodySchema.validate(data);

  if (error) {
    return next(OwnError.invalidDataError());
  }

  if (data.isAnonymous || !data.emailVerified) {
    return next(OwnError.unAuthorizedError("User is not verified"));
  }

  const isExist = await UserModel.findOne({ email: data.email });
  let id;
  if (!isExist) {
    try {
      const newData = new UserModel({
        name: data.displayName,
        email: data.email,
        photoURL: data.photoURL,
        isVerified: true,
        refreshtoken: "",
      });
      const { _id } = await newData.save();
      id = _id.toString();
    } catch (error) {
      next();
    }
  } else {
    id = isExist._id.toString();
  }

  const refreshkey = Jwt.sign({ id }, "90d");
  await UserModel.findByIdAndUpdate(id, { refreshtoken: refreshkey });

  const date = new Date();
  date.setMonth(date.getMonth() + 3);
  res
    .cookie("refreshtoken", refreshkey, { expires: date })
    .status(200)
    .json({ message: "Joined successfully" });
};

export default createUser;
