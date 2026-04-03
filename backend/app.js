const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDB = require("../backend/db/connectDB");
const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary");
const errorMiddleware = require("./middleWare/errorHandler");
const fileUpload = require("express-fileupload");
const path = require("path");
var cors = require("cors");

// routes
const userRoute = require("./route/userRoute");
const chatRuote = require("./route/chatRoute");
const messageRoute = require("./route/messageRoutes");
const notificationRoute = require("./route/notificationRoute");

// FIX 1: cors() must be registered BEFORE routes so that CORS headers
// are applied to every API response.  Previously it was placed after the
// route registrations, so the browser never received the required headers.
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL // set CLIENT_URL in your production .env
        : "http://localhost:3000",
    credentials: true, // required when the frontend sends cookies (JWT)
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(fileUpload());

app.use("/api/user", userRoute);
app.use("/api/chat", chatRuote);
app.use("/api/message", messageRoute);
app.use("/api/notification", notificationRoute);

// Error middleware should be last, after all routes
app.use(errorMiddleware);

// connect with cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// -----deployment code-----
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully..");
  });
}

// connect to DB
connectDB();

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}`)
);

// socket.io connection
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // join room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  // typing indicators
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  // send message
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  // cleanup on disconnect
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(socket.userData?._id);
  });
});
