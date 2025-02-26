"use strict";
const express = require("express");
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");
const path = require("path");
const isEmpty = require("./helpers/isEmpty");


const app = express();
const server = http.Server(app);
const { pppRooms, pppRoom } = require("./helpers/ppp.js");

// Replace "*" with the actual URL of your production CLIENT
// const allowedOrigin = "https://6515a011d7e9ca1d9a23b191--mg-client.netlify.app/";
const allowedOrigin = "*";

// Update corsOptions with allowedOrigin
const corsOptions = {
  origin: allowedOrigin,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Add the following lines to handle Socket.IO connections
const io = socket(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    // You can configure other CORS options as needed
  },
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

app.get("/database/Cards.json", (req, res) => {
  const filePath = path.join(__dirname, "database", "Cards.json");
  res.sendFile(filePath);
});

app.get("/database/rooms.json", (req, res) => {
  const filePath = path.join(__dirname, "database", "rooms.json");
  res.sendFile(filePath);
});


app.get("/database/GameCards/:filename", (req, res) => {
  const filePath = path.join(__dirname, "database/GameCards", req.params.filename);
  res.sendFile(filePath);
});


const {
	getActiveRooms,
	setActiveRooms,
	activeRooms,
	serverSocketServices} = require("./serverSocketServices");

serverSocketServices(io);
app.use(express.json());
console.log("__dirname", __dirname)
app.use("/helpers", express.static(path.join(__dirname, "helpers")));

// POST route
app.post('/api/activeRooms', async (req, res) => {
  try {
    const { rooms } = req.body;  // Extract rooms from the request body
    console.log("\n app.post -- received rooms:", rooms);

    let updatedRooms = [];
	let activeRooms = getActiveRooms()

    rooms.forEach(room => {
      const existingRoom = activeRooms.find(activeRoom => activeRoom.id === room.id);
      if (existingRoom) {
        updatedRooms.push(existingRoom);
      } else {
        const newRoom = {
          id: room.id,
          currentPlayers: [],
        };
        updatedRooms.push(newRoom);
      }
    });

    setActiveRooms(updatedRooms);

    console.log("\nIN app.post - updated returned activeRooms:", activeRooms);

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(updatedRooms);  // Return the updated rooms list to the client

  } catch (error) {
    console.error("Error in /api/activeRooms:", error);
    return res.status(500).json({ error: "Server error" });
  }
});


const PORT = process.env.PORT || 5000;
console.log("IN server index - PORT:", PORT)
server.listen(PORT, console.log(`Listening to ${PORT}!`))
