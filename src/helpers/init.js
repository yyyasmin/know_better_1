import { YoungKids_1 } from "./GameCards/YoungKids_1.js";
import { CHOSEN_PROXY_URL } from "./ServerRoutes.js";
import { shuffle } from "./shuffle";
import isEmpty from "./isEmpty";


const TITLE_SIZE = "2.5rem";

const fetchDataFromJSON = async (filePath) => {
  try {
    const response = await fetch(filePath);
    const data = await response.json();
    console.log("IN fetchDataFromJSON - data:", data)

    return data;
  } catch (error) {
    return null;
  }
};

const getInitialGallerySize = () => {
  let initialGallerySize = { 
    width: window.innerWidth,
    height: window.innerHeight - parseFloat(TITLE_SIZE)
  };
  return initialGallerySize;
};

export const calculateCardSize = (cardsNum) => {
  const initialSize = getInitialGallerySize();
  const containerWidth = initialSize.width;
  const containerHeight = initialSize.height;
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

    case 14:
      cols = 7;
      rows = 2;
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

    case 22:
      cols = 5;
      rows = 5;
      break;

    case 24:
      cols = 6;
      rows = 4;
      break;

    case 26:
      cols = 5;
      rows = 5;
      break;

    case 28:
      cols = 7;
      rows = 4;
      break;

    case 30:
      cols = 6;
      rows = 5;
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

  let totalGapWidth = containerWidth * 2 / 100;
  let totalGapHeight = containerHeight * 2 / 100;

  let gapWidth = totalGapWidth / (cols + 1);
  let gapHeight = totalGapHeight / (rows + 1);

  let cardWidth = (containerWidth - (totalGapWidth + 1)) / cols;
  cardWidth = Math.min(0.4 * containerWidth, cardWidth);

  let cardHeight = (containerHeight - (totalGapHeight + 1)) / rows;
  cardHeight = Math.min(containerHeight * 0.6, cardHeight * 0.8);

  const cardSize = {
    card: {
      width: cardWidth,
      height: cardHeight,
    },
    gap: {
      width: gapWidth,
      height: gapHeight,
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

      const importArr = {
        YoungKids_1: YoungKids_1
        // Add more gameName mappings as needed
      };


      const backgroundImage = importArr[room.gameName] ? importArr[room.gameName][0] : null;

      console.log("room.gameName:", room.gameName)
      console.log("importArr.length:",importArr.length)
      console.log("importArr[room.gameName]:", importArr[room.gameName])

      if ( !isEmpty(importArr[room.gameName]) ) {

        console.log("IN gameCards", gameCards)

        const gameCards1 = gameCards.map((card, index) => {
          const importArrValue = importArr[room.gameName][index];
          const importArrNextValue = importArr[room.gameName][index + 1];
          console.log("Index:", index);
          console.log("importArr[room.gameName][index]:", importArrValue);
          console.log("importArr[room.gameName][index+1]:", importArrNextValue);
          
          return {
            ...card,
            imageImportName: importArrNextValue ? importArrNextValue[0] : undefined,
          };
        });
        

        console.log("gameCards1:", gameCards1)

        const gameCards2 = gameCards.map((card, index) => ({
          ...card,
          imageImportName: importArr[room.gameName][index + 1][1],
        }));
        
        console.log("gameCards2:", gameCards2)

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
