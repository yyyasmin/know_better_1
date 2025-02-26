import { Know_better_1, roomSelectionBackgroundImage } from "./GameCards/Know_better_1.js";
import { CHOSEN_PROXY_URL } from "./ServerRoutes.js";
import { pickRandom6cards, shuffle } from "./shuffle";
import isEmpty from "./isEmpty";

const fetchDataFromJSON = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
};

export const getInitialGallerySize = () => {
  const cardsContainerWidthRem = window.innerWidth / 16; // Convert window width to rem
  const cardsContainerHeightRem = (window.innerHeight / 16) - TITLE_SIZE; // Convert window height to rem
  return { cardsContainerWidthRem, cardsContainerHeightRem };
};

export const calculateCardSize = (cardsNum) => {
  const { cardsContainerWidthRem, cardsContainerHeightRem } = getInitialGallerySize();

  // Determine number of rows and columns
  let cols, rows;
  switch (cardsNum) {
    case 2:
      cols = 2;
      rows = 1;
      break;
    case 8:
      cols = 4;
      rows = 2;
      break;
    case 10:
      cols = 5;
      rows = 2;
      break;
    case 12:
      cols = 4;
      rows = 3;
      break;
    case 16:
      cols = 4;
      rows = 4;
      break;
    case 18:
      cols = 6;
      rows = 3;
      break;
    case 20:
      cols = 5;
      rows = 4;
      break;
    case 24:
      cols = 6;
      rows = 4;
      break;
    default:
      cols = 4;
      rows = 4;
  }

  console.log("cardsContainerHeightRem: ", cardsContainerHeightRem);
  console.log("cardsContainerWidthRem: ", cardsContainerWidthRem);

  if (cardsContainerHeightRem > cardsContainerWidthRem) {
    // SWAP ROWS AND COLS TO FIT THE SCREEN RATIO
    let tmpCols = cols;
    cols = rows;
    rows = tmpCols;
  }

  console.log("cardsNum: ", cardsNum);
  console.log("ROWS: ", rows);
  console.log("cardsContainerHeightRem: ", cardsContainerHeightRem);
  console.log("COLS: ", cols);
  console.log("cardsContainerWidthRem: ", cardsContainerWidthRem);

  let cardAndGapHeight = cardsContainerHeightRem / (rows * 1.1);
  let cardHeight = cardAndGapHeight * 0.9;
  const gapHeight = cardAndGapHeight * 0.1;

  const cardWidth = cardHeight;
  // keep the gaps in the same ratio as the screen ratio
  let gapWidth = (cardsContainerWidthRem - cardWidth * cols) / (cols + 1);
  console.log("In init -- gapWidth: ", gapWidth, " cols:", cols, " rows:", rows )
  

  const cardSize = {
    containerWidth: `${cardsContainerWidthRem}rem`,
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

  console.log("cardSize: ", cardSize);
  return cardSize;
};

const initCardsInRoomsFromJson = async (rooms) => {
  for (const room of rooms) {
    const jsonURL = `${CHOSEN_PROXY_URL}/database/GameCards/${room.gameName}.json`;
    const cardsData = await fetchDataFromJSON(jsonURL);

    if (cardsData) {
      let gameCards = cardsData.gameCards || [];
      let arraysObj = pickRandom6cards(gameCards, Know_better_1.slice(1));

      gameCards = arraysObj.shuffledcardsArr.slice(0, 6);
      
      const importArr = {
        Know_better_1: arraysObj.shuffledimportPathArr.slice(0, 6),
      };

      const backgroundImage = roomSelectionBackgroundImage ? roomSelectionBackgroundImage : null;

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
        room.matchedPairsNumber = 0;
        room.allCardsMatched = false;
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
    return roomsData.map((room) => ({
      ...room,
      cardsData: [],
    }));
  }
  return [];
};

export const initRoomsFunc = async () => {
  let rooms = await initRoomsFromJson();
  rooms = await initCardsInRoomsFromJson(rooms);
  return rooms;
};
