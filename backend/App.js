const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const subscriber = require('./subscriber');

const port = process.env.PORT || 4001;
const index = require("./Index");

const app = express();
app.use(index);

const server = http.createServer(app);

const options = {
    cors: true,
    origins: ["http://127.0.0.1:*"],
};

const io = socketIo(server, options);

io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

subscriber(io);

server.listen(port, () => console.log(`Listening on port ${port}`));
