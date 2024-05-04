import { Know_better_1, roomSelectionBackgroundImage } from "./GameCards/Know_better_1.js";
import { CHOSEN_PROXY_URL } from "./ServerRoutes.js";
import { pickRandom8cards, shuffle } from "./shuffle";
import isEmpty from "./isEmpty";

const TITLE_SIZE = 2.0;

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
  const TITLE_SIZE = 2.5; // Title size in rem

  const screenRemHeight = window.innerHeight / 16

  const cardsContainerHeightRem =screenRemHeight - TITLE_SIZE
  const cardsContainerWidthRem = cardsContainerHeightRem 

  return { cardsContainerWidthRem, cardsContainerHeightRem };  // make cards area squred ratio  - height=width
};

export const calculateCardSize = (cardsNum) => {
  console.log("cardsNum: ", cardsNum)
  const { cardsContainerWidthRem, cardsContainerHeightRem } = getInitialGallerySize();
  console.log("1111 -- cardsContainerWidthRem: ", cardsContainerWidthRem)

  // Determine number of rows and columns
  let cols, rows;
  switch (cardsNum) {

    case 2:  // matched cards
      cols = 2;
      rows = 1;
      break;

    case 16:  // squred board
      cols = 4;
      rows = 4;
      break;

    default:
      cols = 4;
      rows = 4;
  }

  console.log("cardsContainerHeightRem: ", cardsContainerHeightRem)
  console.log("cardsContainerWidthRem: ", cardsContainerWidthRem)


  if (cardsContainerHeightRem > cardsContainerWidthRem)  {
    // [cols, rows] = [rows, cols];  // TRY THIS ONCE IT WORKS
    // SWAP ROWS AND COLS TO FIT THE SCREEN RATIO 
    let tmpCols = cols
    cols = rows
    rows = tmpCols 
  }

  console.log("cardsNum: ", cardsNum)

  console.log("ROWS: ", rows)
  console.log("cardsContainerHeightRem: ", cardsContainerHeightRem)
  console.log("COLS: ", cols)
  console.log("cardsContainerWidthRem: ", cardsContainerWidthRem)

  let cardAndGapHeight = cardsContainerHeightRem / (rows*1.1)
  let cardHeight = cardAndGapHeight * 0.95
  const gapHeight = cardAndGapHeight*0.1
  const gapWidth = gapHeight

  const cardWidth = cardHeight;
  // keep the gaps in the same ration as the screen ratio
  console.log("xxx -- cardsContainerWidthRem: ", cardsContainerWidthRem)
  console.log("xxx -- cardWidth: ", cardWidth)
  console.log("xxx -- cols: ", cols)
  console.log("xxx -- gapWidth: ", gapWidth)


  console.log ("gapWidth: ", gapWidth)

  const cardSize =  {
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

  console.log("rows: ", rows)
  console.log("cols: ", cols)
  console.log("cardSize: ", cardSize)

  return cardSize
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
