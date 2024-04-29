import React, { useState } from "react";
import styled from "styled-components";
import ReactCardFlip from "react-card-flip";
import yasminLogo from "../assets/textures/yasminLogo.PNG";

const computeBorderColor = (frameColor) => {
  return `border: 0.625rem solid ${frameColor};`; // Converted border width to rem
};

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  cursor: grab;
  overflow: hidden;
  position: relative;
  border-radius: 1.5625rem; // Converted border radius to rem
  ${({ frameColor }) => computeBorderColor(frameColor)}
  box-sizing: border-box;
  max-width: 100%;
  height: ${({ cardSize }) => cardSize.card.height}; 
  width: ${({ cardSize }) => cardSize.card.width};
  margin: ${({ cardSize }) => `${cardSize.gap.height} ${cardSize.gap.width}`}; 
  min-height: ${({ cardSize }) => cardSize.card.width}; /* Set max-width to maintain aspect ratio */
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

  const [yasminLogoSize, setYasminLogoSize] = useState({ width: 0, height: 0 });
  const [cardImageSize, setCardImageSize] = useState({ width: 0, height: 0 });

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
