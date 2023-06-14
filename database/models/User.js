import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      validate: () => {
        validator: (value) => /^([a-zA-Z0-9.-]+)@gmail.com$/.test(value);
        message: "Please provide a valid email";
      },
      required: true,
    },
    photoURL: { type: String, required: true },
    isVerified: { type: Boolean, required: true },
    isConnected: { type: Boolean, default: false },
    points: { type: Number, default: 0 },
    refreshtoken: { type: String },
  },
  { timestamps: true }
);

const UserModel = model("users", UserSchema);

export default UserModel;
