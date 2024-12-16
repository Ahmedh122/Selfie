import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url"; // Import this for __dirname fix
import cookieParser from "cookie-parser";
import connectDB from "./connect.js";
import userRoutes from "./routes/users.js";
import eventRoutes from "./routes/events.js";
import commentRoutes from "./routes/comments.js";
import noteRoutes from "./routes/notes.js";
import timerRoutes from "./routes/timers.js";
import channelRoutes from "./routes/channels.js";
import authRoutes from "./routes/auth.js";
import subscriptionRoutes from "./routes/subscriptions.js";
import searchRoutes from "./routes/search.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/search", searchRoutes);

const PORT = 8800;


connectDB();


app.listen(PORT, () => {
  console.log(`API working on http://localhost:${PORT}`);
});
