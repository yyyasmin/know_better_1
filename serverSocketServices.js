const { initRoomsFunc } = require("./helpers/init");
const { pppRooms, pppRoom } = require("./helpers/ppp.js");
const isEmpty = require("./helpers/isEmpty");
let activeRooms = [];

async function initActiveRooms() {
  try {
    const rooms = await initRoomsFunc();
    activeRooms = rooms.flatMap((room) =>  { 
	  const existingRoom = activeRooms.find(activeRoom => activeRoom.id === room.id);
	  return existingRoom ? existingRoom : { ...room };
    });
	pppRooms("\nIN serverSocketServices -- activeRooms:", activeRooms, 5)
	return activeRooms;
  } catch (error) {
    console.error("Error initializing rooms:", error);
  }
}

// Function to emit UPDATED_CURRENT_ROOM event to all players in a room
const emitMsgToRoomPlayers = (io, msgType, updatedRoom) => {
  updatedRoom.currentPlayers.forEach((player) => {
	pppRoom("EMITING TO PLAYER "+player.name + " " + msgType, updatedRoom)
    io.to(player.socketId).emit(msgType, updatedRoom);
  });
};

const emitMsgToRoomPlayers2 = (io, msgType, updatedRoom, updatedObj2) => {
  updatedRoom.currentPlayers.forEach((player) => {
    io.to(player.socketId).emit(msgType, updatedRoom, updatedObj2);
  });
};

const emitMsgToRoomPlayers3 = (io, msgType, updatedRoom, updatedObj2, updatedObj3) => {
  updatedRoom.currentPlayers.forEach((player) => {
    io.to(player.socketId).emit(msgType, updatedObj2, updatedObj3);
  });
};

const getRoomFromActiveRoomsById = (roomId) => {
  const existingRoomIndex = activeRooms.findIndex((room) => room.id === roomId);
  if (existingRoomIndex !== -1) {
	  return activeRooms[existingRoomIndex]
  } else {
    console.log("REQUEST ROOM NUM: ", roomId, " TO UPDATE IS MISSNG IN activateRooms")
	return -1
  }
}

const getRoomFromActiveRoomsByRoomURL = (roomRoomURL) => {
  const existingRoomIndex = activeRooms.findIndex((room) => room.roomURL === roomRoomURL);
  if (existingRoomIndex !== -1) {
    console.log("ROOM roomURL: ", roomRoomURL, " Is FOUND IN ActiveRooms IN IDX:", existingRoomIndex)
    console.log("")
	  return activeRooms[existingRoomIndex]
  } else {
    console.log("REQUEST ROOM URL: ", roomRoomURL, " TO UPDATE IS MISSNG IN activateRooms")
	return -1
  }
}

const getRoomIdxFromActiveRoomsByRoomURL = (roomURL) => {
  return activeRooms.findIndex((room) => room.roomURL === roomURL);
}

const getRoomIdxFromActiveRoomsByID = (roomID) => {
  return activeRooms.findIndex((room) => room.id === roomID);
}

const updateActiveRoomsWithUpdatedRoom = (roomWithNewData) => {
  console.log("IN updateActiveRoomsWithUpdatedRoom  ")
  console.log("BEFORE UPDATE:")
  pppRoom('222 - roomWithNewData', roomWithNewData)

  if (isEmpty(roomWithNewData)) {
    console.log("RQUESTED ROOM TO UPDATE IS EEEEEEEEEEEEEEEEEEE -- EMPTY:", roomWithNewData)
    console.log("")
    return -1
  }
  const roomURL = roomWithNewData.roomURL
  const roomID = roomWithNewData.id
  console.log("roomID;", roomID)
  const updatingIdx = getRoomIdxFromActiveRoomsByID(roomID)
  if (updatingIdx === -1)  {
    console.log("TRYING TO UPDATE -- REQUSETED ROOM:", roomURL, " IS MISSINF IN activeRooms")
    console.log("")
    return -1
  }  
  let roomToUpdate = activeRooms[updatingIdx]
  console.log("\n\nroomToUpdate", roomToUpdate.id, "IN idx ",  updatingIdx)
  pppRoom("roomToUpdate:", roomToUpdate)
  activeRooms[updatingIdx] = {...roomWithNewData};
  pppRoom("\n\nactiveRooms-updatingIdx:", activeRooms[updatingIdx])

  return activeRooms[updatingIdx]
}


const setAvailableRoomInActiveRooms = (requesedRoom) => {

  if ( isEmpty(requesedRoom) )  {
    console.log("REQUESTING EMPTY ROOM:", requesedRoom.roomURL, "TO SET FOR PLAYER ")
    return -1
  }

  console.log("ÏN setAvailableRoomInActiveRooms -- requesedRoom-roomURL", requesedRoom.roomURL)

  const setRoomIndex = activeRooms.findIndex((r) => r.roomURL == requesedRoom.roomURL);

    console.log("setRoomIndex: ", setRoomIndex)

    if (setRoomIndex !== -1) {  // FOUND THE AVAILABLE ROOM IN activeRooms FOR THE NEW PLAYER
      console.log("FOUND AVAILABLE ROOM NUM: ", activeRooms[setRoomIndex].id, " FOR NEW PLAYER IN INDEX:", setRoomIndex)
      return activeRooms[setRoomIndex]
    }

    else {
	  conosle.log("NO ROOM IN activeRooms with roomURL:", requesedRoom.roomURL)
	  return -1;
	}
      updatedRoomNewCopy.cardsData.map((card, index) => {
      // Reset all game cards to be on their back side when a new player joins to start the game from the beginning
       card.faceType = "back";
      });
      activeRooms[setRoomIndex] = {...updatedRoomNewCopy}
      console.log("ROOM ", activeRooms[setRoomIndex].id, "ASSIGNED")
      //pppRooms(activeRooms)
      return activeRooms[setRoomIndex]
}



// Function to move player to the end
const movePlayerToEnd = (currentPlayers, playerName) => {
  const playerIndex = currentPlayers.findIndex((player) => player.name === playerName);
  if (playerIndex !== -1) {
    const playerToMove = currentPlayers.splice(playerIndex, 1)[0];
    currentPlayers.push(playerToMove);
    currentPlayers.forEach((player) => {
      player.isActive = false;
    });
    currentPlayers[0].isActive = true; // The first player to join goes first
  }
  return currentPlayers;
}


const addPlayerToRoom = (roomToAddPlayer, playerName, socketId) => {
    let updatedPlayers;
    let roomToAddPlayerNewCopy;

    newPlayer = {
      socketId: socketId,
      name: playerName,
      email: "",
      isWinner: false,
      isActive: false,
      flippCount: 0,
    };

    let availableRoomIdx = getRoomIdxFromActiveRoomsByRoomURL(roomToAddPlayer.roomURL)
    let availableRoom = activeRooms[availableRoomIdx]

    let currentPlayersNewCopy = [...availableRoom.currentPlayers]
    currentPlayersNewCopy.push(newPlayer)

    console.log("NEW PLAYERS WIH ADDITION PLAYER:", playerName, "IS: ", currentPlayersNewCopy)
    console.log()

    roomToAddPlayerNewCopy = { ...availableRoom, currentPlayers:currentPlayersNewCopy };
	pppRoom('\n\n\nroomToAddPlayerNewCopy:', roomToAddPlayerNewCopy)
    if (roomToAddPlayerNewCopy.currentPlayers.length === roomToAddPlayerNewCopy.maxMembers) {
      roomToAddPlayerNewCopy.currentPlayers.forEach((player) => {
        player.isActive = false;
      });
      roomToAddPlayerNewCopy.currentPlayers[0].isActive = true;
      roomToAddPlayerNewCopy.startGame = true;
    }
	pppRoom("\n111 - roomToAddPlayerNewCopy:", roomToAddPlayerNewCopy)
    return updateActiveRoomsWithUpdatedRoom(roomToAddPlayerNewCopy);
 }


const removeRoomFromActiveRooms = (roomId) => {
  const roomIndex = activeRooms.findIndex((r) => r.id === roomId);
  if (roomIndex !== -1) {
    activeRooms.splice(roomIndex, 1);
	  ////console.log("REQUESTED ROOM:",roomId, " HAS REMOVED FRM activeRooms")
	  ////console.log("")

  }
  else {
	  ////console.log("REQUESTED ROOM:",roomId, " IS MISSIF GROM activeRooms")
	  ////console.log("")
	  return -1
  }
};

// SOCKET SERVICES
const HEART_BEAT_INTERVAL = 60000; // 1 minute
const INACTIVE_TIMEOUT = 3600000; // 1 hour
const playerLastActive = {};

// Function to handle HEART_BEAT signal from client
function handleHeartBeat(playerName) {
  playerLastActive[playerName] = Date.now();
}

// Function to check for inactive players and remove them
function checkInactivePlayers(io) {
  const currentTime = Date.now();
  for (const playerName in playerLastActive) {
    if (currentTime - playerLastActive[playerName] > INACTIVE_TIMEOUT) {
      //////console.log(`${playerName} has been inactive and will be removed.`);
      delete playerLastActive[playerName];
      io.emit("PLAYER_LEFT_ROOM", playerName);
    }
  }
}

// Start a timer to check for inactive players periodically
setInterval(() => {
  checkInactivePlayers();
}, HEART_BEAT_INTERVAL);

// Socket.io event handling
const serverSocketServices = (io) => {
	
  io.on("connection", (socket) => {
	  
    // Listen for HEART_BEAT signal from client
    socket.on("HEART_BEAT", (playerName) => {
      handleHeartBeat(playerName);
    });

    socket.on("CREATE_ROOM_AND_ADD_PLAYER", ( {chosenRoom, playerName} ) => {
            
      let updatedRoom = { ...setAvailableRoomInActiveRooms(chosenRoom) };
    
	console.log("IN CREATE_ROOM_AND_ADD_PLAYER updatedRoom.id", updatedRoom.id)
    console.log("IN CREATE_ROOM_AND_ADD_PLAYER playerName", playerName)
   
      if (updatedRoom === -1)  {
        console.log("CAN NOT SET AVAILABLE ROOM FOR REQUESTED ROOOM NUM:", chosenRoom.roomURL, " AND PLAYER:", playerName)

      }  else {
        updatedRoom = { ...addPlayerToRoom(updatedRoom, playerName, socket.id) } ;
      }

      emitMsgToRoomPlayers(io, "UPDATED_CURRENT_ROOM", updatedRoom);
    })


    socket.on("REMOVE_PLAYER_FROM_ROOM", ( {requestedRoom, playerName} ) => {

      if ( isEmpty(requestedRoom) )  {
        console.log("IN REMOVE_PLAYER_FROM_ROOM -- REQUESTED ROOM IS EMPTY -- playerName, requestedRoom:", playerName, requestedRoom.id)
        return -1
      }
      let existingRoom, updatedRoom;
      let existingPlayer = {};
      existingRoom = getRoomFromActiveRoomsById(requestedRoom);
      
      if (existingRoom === -1) {
        return { playerName, requestedRoom };
      } else {
        updatedRoom = existingRoom;
      }
        
      requestedPlayer = !isEmpty(updatedRoom.currentPlayers) && 
                updatedRoom.currentPlayers.find((player) => player.name === playerName);

      if (existingPlayer) {
        let PlayersToSendMsg =
        [...updatedRoom.currentPlayers.filter((player) => player.name !== playerName)];
        if (PlayersToSendMsg.length === 1) {
          updatedPlayers[0].isActive = true;
        }
        updatedRoom = {
          ...updatedRoom,
          currentPlayers: PlayersToSendMsg,
        };
        if (PlayersToSendMsg.length == 0) {
          updatedRoom = {
            ...updatedRoom,
            currentPlayers: PlayersToSendMsg,
            startGame: false,
            endGame: false,
          };
        }
      }
      emitMsgToRoomPlayers(io, "PLAYER_LEFT_ROOM", updatedRoom)
      emitMsgToRoomPlayers(io, "UPDATED_CURRENT_ROOM", updatedRoom)
    }) // END REMOVE_PLAYER_FROM_ROOM


    socket.on("REMOVE_ROOM_FROM_ACTIVE_ROOMS", (roomId) => {
      removeRoomFromActiveRooms(roomId);
    });

    socket.on("CURENT_ROOM_CHANGED", (updatedRoom) => {
      pppRoom("\n333 - CURENT_ROOM_CHANGED -- updatedRoom:", updatedRoom)
	  updateActiveRoomsWithUpdatedRoom(updatedRoom);
      emitMsgToRoomPlayers(io, "UPDATED_CURRENT_ROOM", updatedRoom);
    });

    // socket.on("MATCHED_CARDS_CHANGED", (updatedRoom, matchedCards) => {
    //   emitMsgToRoomPlayers2(io, "UPDATED_MATCHED_CARDS", updatedRoom, matchedCards);
    // });

    socket.on("IS_MATCHED_CHANGED", (cr, isMatched, last2FlippedCards, have_has_word_idx) => {
      ////console.log("IN ON-IS_MATCHED_CHANGED -- cr:", cr)
      ////console.log("IN ON-IS_MATCHED_CHANGED -- last2FlippedCards:", last2FlippedCards)
      emitMsgToRoomPlayers3(io, "UPDATED_IS_MATCHED", cr, isMatched, last2FlippedCards);
    });
    socket.on("START_GAME", (cr) => {
      emitMsgToRoomPlayers(io, "UPDATED_START_GAME", cr);
    });

    socket.on("END_GAME", (cr) => {
      emitMsgToRoomPlayers(io, "UPDATED_END_GAME", cr);
    });
	
  });
	
};

module.exports = {initActiveRooms, activeRooms, getRoomFromActiveRoomsByRoomURL, serverSocketServices};
