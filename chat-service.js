import express from 'express';
import http from 'http';
import {Server} from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {origin: "*"}
})

io.connection((socket) => {
    console.log("User connected:", socket.id);

    // joined personal room
    socket.on("join", (userId) => {
        socket.join(userId)
    });

    // send message
    socket.on("sendMessage", ({senderId, receiverId, text}) => {
        const message = {senderId, text, timestamp: Date.now()};

        // pesist message to mongodb
        io.to(receiverId).emit("receivedMessage", message)
    })
    
    socket.on("disconnect", () => {
        console.log("user disconnected:", socket.id)
    })
})

server.listen(4000, () => {
    console.log('chat service listening on port 4000')
})