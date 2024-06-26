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

const NikeCard = (props) => {
  const { card, cardSize, faceType, frameColor, toggleCardFlip } = props;

  console.log("IN NickCard --  cardSize: ", cardSize)

  let [yasminLogoSize, setYasminLogoSize] = useState({ width: 0, height: 0 });
  let [cardImageSize, setCardImageSize] = useState({ width: 0, height: 0 });

  const handleCardClick = () => {
    if (toggleCardFlip != null) {
      toggleCardFlip(card.id);
    }
  };

  const handleImageLoad = (e, type) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (type === "yasminLogo") {
      yasminLogoSize = naturalWidth  // SO IT WILL PASS ON RAILWAY
      console.log("yasminLogoSize: ", yasminLogoSize)
      setYasminLogoSize({ width: naturalWidth, height: naturalHeight });
    } else {
      cardImageSize = naturalWidth  // SO IT WILL PASS ON RAILWAY
      console.log("cardImageSize: ", cardImageSize)  
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
