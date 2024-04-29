import { YoungKids_1, roomSelectionBackgroundImage } from "./GameCards/YoungKids_1.js";
import { CHOSEN_PROXY_URL } from "./ServerRoutes.js";
import { pickRandom6cards, shuffle } from "./shuffle";
import isEmpty from "./isEmpty";

const TITLE_SIZE = 2.5; // 2.5rem
let cardsGaleryHeight = 10.0

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
  const vwToRem = (window.innerWidth) / 16; // Convert vh to rem
  const vhToRem = (window.innerHeight - TITLE_SIZE * 16) / 16; // Convert vh to rem
  return {
    width:  `${vwToRem}rem`,
    height: `${vhToRem}rem`
  };
};

export const getCardsContainerHeight = () => {
  return cardsGaleryHeight
};

export const calculateCardSize = (cardsNum) => {
  const initialSize = getInitialGallerySize();
  console.log("initialSize: ", initialSize)
  
  const containerWidth = parseFloat(initialSize.width);
  const containerHeight = parseFloat(initialSize.height);

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

  if (containerHeight > containerWidth) {
    let tmpCols = cols;
    cols = rows;
    rows = tmpCols;
  }

  let totalGapWidth = containerWidth * 0.02; // 2% of container width
  let totalGapHeight = containerHeight * 0.02; // 2% of container height

  let gapWidth = totalGapWidth / (cols + 1);
  let gapHeight = totalGapHeight / (rows + 1);

  // let cardWidth = (containerWidth - (totalGapWidth * (cols + 1))) / cols;
  // cardWidth = Math.min(0.4 * containerWidth, cardWidth);

  let cardHeight = (containerHeight - (totalGapHeight * (rows + 1))) / rows;
  cardHeight = Math.min(containerHeight * 0.6, cardHeight * 0.8);

  let cardWidth = cardHeight
  console.log("GAPWITH - BEFORE: ", gapWidth)
  gapWidth = (containerWidth / (cardWidth+gapWidth)) / (cols-2)
  console.log("GAPWITH - AFTER: ", gapWidth)


  const cardSize = {
    containerWidth: containerWidth, 
    containerHeight: containerHeight, 

    card: {
      width: `${cardWidth}rem`,
      height: `${cardHeight}rem`,
    },

    gap: {
      width: `${gapWidth}rem`,
      height: `${gapHeight}rem`,
    },

  };
  console.log("CRAD SIZE: ", cardSize)

  return cardSize;
};

const initCardsInRoomsFromJson = async (rooms) => {
  for (const room of rooms) {
    const jsonURL = `${CHOSEN_PROXY_URL}/database/GameCards/${room.gameName}.json`;
    const cardsData = await fetchDataFromJSON(jsonURL);

    if (cardsData) {
      let gameCards = cardsData.gameCards || [];
      let arraysObj = pickRandom6cards(gameCards, YoungKids_1.slice(1));

      gameCards = arraysObj.shuffledcardsArr.slice(0, 6);
      
      const importArr = {
        YoungKids_1: arraysObj.shuffledimportPathArr.slice(0, 6)
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
