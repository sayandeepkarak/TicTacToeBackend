export const cancleMatch = (waitListPlayers, userId) => {
  waitListPlayers.splice(waitListPlayers.indexOf(userId));
  console.log(waitListPlayers);
};
