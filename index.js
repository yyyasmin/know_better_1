"use strict";
const express = require("express");
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");
const path = require("path");

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



const {initActiveRooms, serverSocketServices} = require("./serverSocketServices");
serverSocketServices(io);
app.use(express.json());

app.get('/api/activeRooms', async (req, res) => {
  try {
    let activeRooms  = await initActiveRooms();
    pppRooms("\n app.get -- activeRooms:", activeRooms, 5)

    if (!activeRooms || activeRooms.length === 0) {
      return res.status(404).json({ error: "No active rooms found" });
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(activeRooms);

  } catch (error) {
    console.error("Error in /api/active-rooms:", error);
    return res.status(500).json({ error: "Server error" });
  }
});


// Use process.env.PORT for flexibility in choosing the port
const PORT = process.env.PORT || 5000;
console.log("IN server index - PORT:", PORT)
server.listen(PORT, console.log(`Listening to ${PORT}!`))
