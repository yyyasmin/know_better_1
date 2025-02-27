import React, { useState } from "react";
import styled from "styled-components";
import ReactCardFlip from "react-card-flip";
import yasminLogo from "../assets/textures/yasminLogo.PNG";

const computeBorderColor = (frameColor) => {
  return `border: 0.625rem solid ${frameColor};`; // Converted border width to rem
};


const CardContainer = styled.div`
  cursor: grab;
  position: relative;
  border-radius: 1.5625rem;
  width: ${({ cardSize }) => cardSize.card.width}; /* Set the width */
  height: ${({ cardSize }) => cardSize.card.height}; /* Set the height */
  ${({ frameColor }) => computeBorderColor(frameColor)}
  box-sizing: border-box;
`;


const CardImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 1.5625rem; // Converted border radius to rem
  object-fit: cover; /* Maintain aspect ratio and cover entire container */
  object-position: center; /* Ensure image is centered within container */
`;
console.log("IN NikeCard -- CardImage:", CardImage)
console.log("IN NikeCard -- yasminLogo:", yasminLogo)

const NikeCard = (props) => {
  const { card, cardSize, faceType, frameColor, toggleCardFlip } = props;

  ////console.log("IN NickCard --  cardSize: ", cardSize)

  const [yasminLogoSize, setYasminLogoSize] = useState({ width: 0, height: 0 });
  const [cardImageSize, setCardImageSize] = useState({ width: 0, height: 0 });
  
  // DUMMY CMDS - TO AVOID NOT USED VARS BUG
  //console.log("IN NickCard --  yasminLogoSize: ", yasminLogoSize)
  //console.log("IN NickCard --  cardImageSize: ", cardImageSize)

  const handleCardClick = () => {
    if (toggleCardFlip != null) {
      toggleCardFlip(card.id);
    }
  };

  const handleImageLoad = (e, type) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (type === "yasminLogo") {
      setYasminLogoSize({ width: naturalWidth, height: naturalHeight });
    } else {
      setCardImageSize({ width: naturalWidth, height: naturalHeight });
    }
  };

  return (
    <ReactCardFlip isFlipped={faceType === "back"}>
      <CardContainer cardSize={cardSize} frameColor={frameColor} onClick={handleCardClick}>
        <CardImage src={card.imageImportName} alt={card.name} onLoad={(e) => handleImageLoad(e, "card")} />
      </CardContainer>

      <CardContainer cardSize={cardSize} frameColor={frameColor} onClick={handleCardClick}>
        <CardImage src={yasminLogo} alt={card.name} onLoad={(e) => handleImageLoad(e, "yasminLogo")} />
      </CardContainer>
    </ReactCardFlip>
  );
};

export default NikeCard;
