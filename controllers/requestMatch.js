import RoomModel from "../database/models/Room";

export const requestMatch = async (waitListPlayers, socket, io, userId) => {
  if (waitListPlayers.length > 0) {
    const users = [userId, waitListPlayers[0]];
    try {
      const newRoom = new RoomModel({
        players: users,
      });
      const { _id } = await newRoom.save();

      socket.emit("successMatchMaking", _id, users);
      io.to(users[1]).emit("successMatchMaking", _id, users);

      waitListPlayers.splice(0, 1);
    } catch (error) {
      console.log(error);
      console.log("Room creation failed");
    }
  } else {
    waitListPlayers.push(userId);
    socket.join(userId);
  }
  console.log(waitListPlayers);
};
