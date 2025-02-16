import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import connectDB from "./connect.js";
import userRoutes from "./routes/users.js";
import eventRoutes from "./routes/events.js";
import commentRoutes from "./routes/comments.js";
import noteRoutes from "./routes/notes.js";
import timerRoutes from "./routes/timers.js";
import channelRoutes from "./routes/channels.js";
import authRoutes from "./routes/auth.js";
import friendsRoutes from "./routes/friends.js";
import notificationRoutes from "./routes/notifications.js";
import searchRoutes from "./routes/search.js";
import activityRoutes from "./routes/activities.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {



  socket.on("join", (roomId) => {
    {/**console.log(`User ${socket.id} joined room: ${roomId}`); */}
    socket.join(roomId);
  });


  socket.on("disconnect", () => {
   {/**console.log("A user disconnected:", socket.id); */}
  });
});


app.set("socketio", io);


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/timers", timerRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/activities", activityRoutes);


connectDB();


const PORT = 8800;
server.listen(PORT, () => {
  console.log(`API working on http://localhost:${PORT}`);
});
