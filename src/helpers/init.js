import { Know_better_1, roomSelectionBackgroundImage } from "./GameCards/Know_better_1.js";
import { CHOSEN_PROXY_URL } from "./ServerRoutes.js";
import { pickRandom8cards, shuffle } from "./shuffle";
import isEmpty from "./isEmpty";

async function fetchActiveRooms(rooms) {
  const roomPlayersData = rooms.map((room) => ({
    id: room.id,
  }));

  try {
    const server_url = `${CHOSEN_PROXY_URL}/api/activeRooms`;
    console.log("IN client init -- server_url", server_url);
    console.log("IN fetchActiveRooms -- roomPlayersData:", roomPlayersData);

    // Sending the rooms (either oneRoom with a room or an empty array)
    const response = await fetch(server_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rooms: roomPlayersData })  // Send the array to the backend
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched active rooms:", data);

    // Update each room with currentPlayers from the fetched data based on matching IDs
    const roomFullData = rooms.map((room) => {
      // Find the corresponding room in the fetched data by matching IDs
      const matchingRoomData = data.find((roomData) => roomData.id===room.id);

      if (matchingRoomData) {
        return {
          ...room,
          currentPlayers: matchingRoomData.currentPlayers || [],  // Add currentPlayers if available
        };
      }

      // If no matching room data, just return the room with an empty currentPlayers array
      return {
        ...room,
        currentPlayers: [],
      };
    });

    return roomFullData;

  } catch (error) {
    console.error("Error fetching active rooms:", error);
    return null;
  }
}

const fetchDataFromJSON = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

const getInitialGallerySize = () => {
  const TITLE_SIZE = 2.5;
  const screenRemHeight = window.innerHeight / 16;
  const cardsContainerHeightRem = screenRemHeight - TITLE_SIZE;
  const cardsContainerWidthRem = cardsContainerHeightRem;

  return { cardsContainerWidthRem, cardsContainerHeightRem };
};

export const calculateCardSize = (cardsNum) => {
  const { cardsContainerWidthRem, cardsContainerHeightRem } = getInitialGallerySize();
  let cols, rows;

  switch (cardsNum) {
    case 2:
      cols = 2;
      rows = 1;
      break;
    case 16:
      cols = 4;
      rows = 4;
      break;
    default:
      cols = 4;
      rows = 4;
  }

  if (cardsContainerHeightRem > cardsContainerWidthRem) {
    let tmpCols = cols;
    cols = rows;
    rows = tmpCols;
  }

  let cardAndGapHeight = cardsContainerHeightRem / (rows * 1.1);
  let cardHeight = cardAndGapHeight * 0.95;
  const gapHeight = cardAndGapHeight * 0.1;
  const gapWidth = gapHeight;
  const cardWidth = cardHeight;

  return {
    containerWidth: `${cardsContainerHeightRem}rem`,
    containerHeight: `${cardsContainerHeightRem}rem`,
    card: { width: `${cardWidth}rem`, height: `${cardHeight}rem` },
    gap: { width: `${gapWidth}rem`, height: `${gapHeight}rem` },
  };
};

const initCardsInRoomsFromJson = async (rooms) => {
  for (const room of rooms) {
    const jsonURL = `${CHOSEN_PROXY_URL}/database/GameCards/${room.gameName}.json`;
    const cardsData = await fetchDataFromJSON(jsonURL);

    if (cardsData) {
      let gameCards = cardsData.gameCards || [];
      let arraysObj = pickRandom8cards(gameCards, Know_better_1.slice(1));
      gameCards = arraysObj.shuffledcardsArr.slice(0, 8);

      const importArr = {
        Know_better_1: arraysObj.shuffledimportPathArr.slice(0, 8),
      };

      const backgroundImage = roomSelectionBackgroundImage ? roomSelectionBackgroundImage : null;

      if (!isEmpty(importArr[room.gameName])) {
        const gameCards1 = gameCards.map((card, index) => ({
          ...card,
          imageImportName: importArr[room.gameName][index][0] || undefined,
        }));

        const gameCards2 = gameCards.map((card, index) => ({
          ...card,
          imageImportName: importArr[room.gameName][index][1] || undefined,
        }));

        const shuffledGameCards = shuffle(gameCards1.concat(gameCards2));
        room.cardsData = shuffledGameCards;
        room.cardSize = calculateCardSize(shuffledGameCards.length);
        room.MatchedCardSize = calculateCardSize(2);
        room.backgroundImage = backgroundImage;
      }
    }
  }
  return rooms;
};

const initRoomsFromJson = async () => {
  const jsonURL = `${CHOSEN_PROXY_URL}/database/rooms.json`;
  const roomsData = await fetchDataFromJSON(jsonURL);

  if (roomsData) {
    let newRooms = [];

    roomsData.forEach((room) => {
      for (let i = 1; i <= 10; i++) {
        newRooms.push({
          ...room,
          id: `${room.id}-${i}`,
          roomURL: `${CHOSEN_PROXY_URL}/room/${room.id}-${i}`,
          cardsData: [],
        });
      }
    });

    return newRooms;
  }
  return [];
};

export const initRoomsFunc = async () => {
  let rooms = await initRoomsFromJson();
  rooms = await initCardsInRoomsFromJson(rooms);

  const activeRooms = await fetchActiveRooms(rooms);

  const updatedRooms = rooms.map(room => {
	console.log("room.id:", room.id)
    const activeRoom = activeRooms.find(activeRoom => activeRoom.id === room.id);
	console.log("activeRoom-id", activeRoom && activeRoom.id)
    if (activeRoom) {
      return {
        ...room,
        currentPlayers: activeRoom.currentPlayers || [],
      };
    }

    return {
      ...room,
      currentPlayers: [],
    };
  });

  console.log("In initRoomsFunc -- AFTER UPDATE PLAYERS -- updatedRooms:", updatedRooms);

  return updatedRooms;  // Return the updated rooms with populated currentPlayers
};

