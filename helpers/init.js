const { Know_better_1, roomSelectionBackgroundImage } = require("./GameCards/Know_better_1.js");
const { CHOSEN_PROXY_URL } = require("./ServerRoutes.js");
const { pickRandom8cards, shuffle } = require("./shuffle");
const isEmpty = require("./isEmpty");
const { pppRooms, pppRoom } = require("./ppp.js");


const fetchDataFromJSON = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${filePath}:`, error);
    return null;
  }
};

const getInitialGallerySize = () => {
  const TITLE_SIZE = 2.5;

  const screenRemWidth = process.env.NODE_ENV === 'production' ? window.innerWidth / 16 : 16; // Mock for server
  const screenRemHeight = process.env.NODE_ENV === 'production' ? window.innerHeight / 16 : 16; // Mock for server

  const cardsContainerHeightRem = screenRemHeight - TITLE_SIZE;
  const cardsContainerWidthRem = cardsContainerHeightRem;

  return { cardsContainerWidthRem, cardsContainerHeightRem };
};

const calculateCardSize = (cardsNum) => {
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

  const cardSize = {
    containerWidth: `${cardsContainerHeightRem}rem`,
    containerHeight: `${cardsContainerHeightRem}rem`,
    card: {
      width: `${cardWidth}rem`,
      height: `${cardHeight}rem`,
    },
    gap: {
      width: `${gapWidth}rem`,
      height: `${gapHeight}rem`,
    },
  };

  return cardSize;
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
        Know_better_1: arraysObj.shuffledimportPathArr.slice(0, 8)
      };

      const backgroundImage = roomSelectionBackgroundImage || null;

      if (!isEmpty(importArr[room.gameName])) {
        const gameCards1 = gameCards.map((card, index) => {
          const importP1Card = importArr[room.gameName][index][0];
          return {
            ...card,
            imageImportName: importP1Card ? importP1Card : undefined,
          };
        });

        const gameCards2 = gameCards.map((card, index) => {
          const importP2Card = importArr[room.gameName][index][1];
          return {
            ...card,
            imageImportName: importP2Card ? importP2Card : undefined,
          };
        });

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
        const newRoom = {
          ...room,
          id: `${room.id}-${i}`,
          roomURL: `${CHOSEN_PROXY_URL}/room/${room.id}-${i}`,
          cardsData: [],
        };
        newRooms.push(newRoom);
      }
    });

    return newRooms;
  }
  return [];
};

module.exports.initRoomsFunc = async () => {
  let rooms = await initRoomsFromJson();
  rooms = await initCardsInRoomsFromJson(rooms);
  pppRooms('\nINIt - ROOMS:', rooms)
  return rooms;
};
