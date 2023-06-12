import { Schema, model } from "mongoose";

const RoomSchema = new Schema(
  {
    players: {
      type: [String],
      required: true,
    },
    simulation: [String],
  },
  { timestamps: true }
);

const RoomModel = model("rooms", RoomSchema);

export default RoomModel;
