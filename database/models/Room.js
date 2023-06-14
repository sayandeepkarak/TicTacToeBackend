import { Schema, model } from "mongoose";

const RoomSchema = new Schema(
  {
    players: {
      type: [String],
      required: true,
    },
    simulation: {
      type: [String],
      default: ["", "", "", "", "", "", "", "", ""],
    },
    round: { type: Number, default: 1 },
    points: { type: [Number], default: [0, 0] },
    turn: { type: Number, default: 0 },
    step: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const RoomModel = model("rooms", RoomSchema);

export default RoomModel;
