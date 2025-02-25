import isEmpty from "./isEmpty";

const getInitialGallerySize = () => {
  const TITLE_SIZE = 2.5; // Title size in rem

  //const screenRemWidth = window.innerWidth / 16 
  const screenRemHeight = window.innerHeight / 16

  const cardsContainerHeightRem =screenRemHeight - TITLE_SIZE
  const cardsContainerWidthRem = cardsContainerHeightRem 

  return { cardsContainerWidthRem, cardsContainerHeightRem };  // make cards area squred ratio  - height=width
};

export const calculateCardSize = (cardsNum) => {
  ////console.log("cardsNum: ", cardsNum)
  const { cardsContainerWidthRem, cardsContainerHeightRem } = getInitialGallerySize();
  //console.log("1111 -- cardsContainerWidthRem: ", cardsContainerWidthRem)

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

  //console.log("cardsContainerHeightRem: ", cardsContainerHeightRem)
  //console.log("cardsContainerWidthRem: ", cardsContainerWidthRem)


  if (cardsContainerHeightRem > cardsContainerWidthRem)  {
    // [cols, rows] = [rows, cols];  // TRY THIS ONCE IT WORKS
    // SWAP ROWS AND COLS TO FIT THE SCREEN RATIO 
    let tmpCols = cols
    cols = rows
    rows = tmpCols 
  }

  //console.log("cardsNum: ", cardsNum)

  //console.log("ROWS: ", rows)
  //console.log("cardsContainerHeightRem: ", cardsContainerHeightRem)
  //console.log("COLS: ", cols)
  //console.log("cardsContainerWidthRem: ", cardsContainerWidthRem)

  let cardAndGapHeight = cardsContainerHeightRem / (rows*1.1)
  let cardHeight = cardAndGapHeight * 0.95
  const gapHeight = cardAndGapHeight*0.1
  const gapWidth = gapHeight

  const cardWidth = cardHeight;
  // keep the gaps in the same ration as the screen ratio
  //console.log("xxx -- cardsContainerWidthRem: ", cardsContainerWidthRem)
  //console.log("xxx -- cardWidth: ", cardWidth)
  //console.log("xxx -- cols: ", cols)
  //console.log("xxx -- gapWidth: ", gapWidth)


  //console.log ("gapWidth: ", gapWidth)

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

  //console.log("rows: ", rows)
  //console.log("cols: ", cols)
  //console.log("cardSize: ", cardSize)

  return cardSize
};