import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import isEmpty from "../helpers/isEmpty";
import {
  updateCr,
  removeUpdatedRoomDataListener,
  emitAddMemberToRoom,
  emitCurentRoomChanged,
} from "../clientSocketServices";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  font-family: Lobster, Georgia, serif;
  color: #545454;
  padding: 2vw;
`;

const GameHeading = styled.h1`
  text-align: center;
  font-size: 2.4rem;
  margin: 0 0 0.8em;
`;

const RoomList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const RoomItemWrapper = styled.li`
  margin: 10px;
  width: 15vw;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  border: 6px solid ${(props) => props.frameColor};
  border-radius: 5px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.05);
  }
`;

const RoomImageWrapper = styled.div`
  width: 100%;
  height: 20vw;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
  border-radius: 5px;
`;

//const RoomInfoLink = styled.a`
//  color: #fff;
//  text-decoration: none;
//  background-color: rgba(0, 0, 0, 0.5);
//  padding: 5px 10px;
//  border-radius: 5px;
//  margin: 5px 0;
//  font-size: 1.5vw;
//`;

const JoinButton = styled.button`
  background-color: ${(props) => props.btnColor};
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.5vw;
`;

const PlayersSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 90%;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 10px;
  border-radius: 5px;
`;

const PlayersTitle = styled.h4`
  margin: 0;
  font-size: 1.4vw;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 5px;
  border-radius: 5px;
  text-align: center;
`;

const PlayersList = styled.div`
  color: #fff;
  font-size: 1.2vw;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 5px;
  border-radius: 5px;
  width: 90%;
  text-align: center;
`;

const RoomsList = ({ userName, roomsInitialData }) => {
  const [currentRoom, setCr] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const handleUpdateCr = (room) => setCr(room);
    updateCr(handleUpdateCr);

    return () => {
      removeUpdatedRoomDataListener();
    };
  }, []);

  useEffect(() => {
    console.log("After handleJoinRoom -- currentRoom:", currentRoom && currentRoom.currentPlayers, currentRoom.id)

    if (!isEmpty(currentRoom)) {
      navigate(`/game/${currentRoom.id}`, {
        state: { userName, currentRoom },
      });
    }
  }, [currentRoom, navigate, userName]);

//  const broadcastChangeCr = async (updatedCr) => {
//    if (!isEmpty(updatedCr)) {
//      await emitCurentRoomChanged({ ...updatedCr });
//    }
//  };

  const handleJoinRoom = async (room) => {
    console.log("IN handleJoinRoom -- room: ", room);
    console.log("IN handleJoinRoom -- userName: ", userName);
    console.log("!isEmpty(room)", !isEmpty(room));
    console.log("!isEmpty(userName)", !isEmpty(userName));

    if (!isEmpty(room) && !isEmpty(userName)) {
      await emitAddMemberToRoom({
        chosenRoom: room,
        playerName: userName,
      });
	  
      //broadcastChangeCr(room); //XXX xxx HHH WATCH THIS!
    }
  };

  console.log("In ROOM-LIST -- roomsInitialData: ", roomsInitialData);

  return (
    <GameContainer>
      <GameHeading>Get to know your friend better while practicing active listening:</GameHeading>
      <RoomList>
        {roomsInitialData.map((room) => (
          <RoomItemWrapper key={room.id} frameColor={room.frameColor}>
            {/* Image and Players Section Wrapper */}
            <RoomImageWrapper backgroundImage={room.backgroundImage} />
            
            {/* Players Section */}
            <PlayersSection>
              <PlayersTitle>Current Players:</PlayersTitle>
              <PlayersList>
			  {room.currentPlayers && room.currentPlayers.length > 0
				? room.currentPlayers.map((player) => player.name).join(", ")
				: "No players yet"}
			  </PlayersList>
            </PlayersSection>

            <JoinButton btnColor={room.frameColor} onClick={() => handleJoinRoom(room)}>
              Join
            </JoinButton>
          </RoomItemWrapper>
        ))}
      </RoomList>
    </GameContainer>
  );
};

export default RoomsList;
