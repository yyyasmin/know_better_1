const isEmpty = require("./helpers/isEmpty");

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
	if isEmpty(room) {
	  consoel.log ("ROOM ", room, IS EMPTY)
	}
	else {
	  console.log("id:", room.id);
	  console.log("roomURL:", room.roomURL);
	  console.log("currentPlayers:", room.currentPlayers);
	}
}

module.exports = {pppRooms, pppRoom};