import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NameForm from "./components/NameForm";
import RoomsList from "./components/RoomsList";
import Game from "./components/Game";
import { CHOSEN_PROXY_URL } from "./helpers/ServerRoutes.js";

const AppContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  background-color: snow;
`;

function App() {
  const [userName, setUserName] = useState("");
  const [roomsInitialData, setRoomsInitialData] = useState(null);
  const [dataIsSet, setDataIsSet] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Fetch rooms data from the server
		const server_url = `${CHOSEN_PROXY_URL}/api/activeRooms`
        console.log("server_url", server_url)
		const response = await fetch(server_url);
        const data = await response.json();  // Convert response to JSON
        console.log("IN App -- rooms data", data)
		setRoomsInitialData(data);
      } catch (error) {
        console.error("Error initializing the app:", error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (roomsInitialData) {
      setDataIsSet(true);
    }
  }, [roomsInitialData]);

  return (
    <Router>
      <AppContainer>
        <Routes>
          {dataIsSet ? (
            <Route
              path="/rooms"
              element={<RoomsList userName={userName} roomsInitialData={roomsInitialData} />}
            />
          ) : null}
          <Route path="/name" element={<NameForm setUserName={setUserName} />} />
          <Route path="/game/:roomId" element={<Game />} />
          <Route path="" element={<NameForm setUserName={setUserName} />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
