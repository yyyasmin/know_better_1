
const pppRooms = (msg, rooms, maxIdx) => {
  console.log(msg);
  rooms.forEach((room, index) => {
	if (index< maxIdx) {
	  pppRoom(index, room);
	}
  });
};

const pppRoom = (msg, room) => {
	console.log("\n", msg)
	console.log("id:", room.id);
	console.log("roomURL:", room.roomURL);
	console.log("currentPlayers:", room.currentPlayers);
}

module.exports = {pppRooms, pppRoom};