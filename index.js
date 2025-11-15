const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const chatController = require("./controllers/chatController.js");
//import moran from 'morgan';

const tweetRouter = require("./routes/tweetRoutes.js");
const userRouter = require("./routes/userRoutes.js");
//const userTweetsRouter = require('./routes/userTweetsRoutes.js');

dotenv.config({ path: "./config.env" });

//initialize the express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Each user joins their own personal room
  socket.on("joinUser", (userId) => {
    socket.join(userId);
  });

  // Join a specific conversation
  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
  });

  // Handle sending messages
  socket.on(
    "sendMessage",
    async ({ conversationId, senderId, receiverId, text }) => {
      // Check mutual follow rule
      const canChat = await chatController.ensureMutualFollow(
        senderId,
        receiverId
      );
      if (!canChat) {
        socket.emit("errorMessage", "You must follow each other first!");
        return;
      }

      // Create or fetch conversation
      const conversation = await chatController.getOrCreateConversation(
        senderId,
        receiverId
      );

      // Save message using same controller logic
      const message = await chatController.createMessage({
        conversationId: conversation._id,
        senderId,
        text,
      });

      //  Emit real-time events
      io.to(conversation._id.toString()).emit("newMessage", message);
      io.to(receiverId).emit("messageNotification", message);
    }
  );

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// parse JSON bodies (req.body)
app.use(express.json());

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/users", userRouter);
//app.use('/api/v1/user/tweets', userTweetsRouter);

// start the server
const port = process.env.PORT || "3000";
app.listen(3000, () => {
  console.log(`App running on port ${port}`);
});
