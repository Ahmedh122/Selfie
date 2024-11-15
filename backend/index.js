import express from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import connectDB from "./connect.js";
import userRoutes from "./routes/users.js";
import eventRoutes from "./routes/events.js";
import commentRoutes from "./routes/comments.js";
import noteRoutes from "./routes/notes.js";
import timerRoutes from "./routes/timers.js";
import channelRoutes from "./routes/channels.js"
import authRoutes from "./routes/auth.js";
import subscriptionRoutes from "./routes/subscriptions.js";
import searchRoutes from "./routes/search.js";



const app = express();

// Middlewares
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../app/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

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

// Connect to MongoDB
connectDB();

// Start the express app after successful database connection
app.listen(PORT, () => {
  console.log(`API working on http://localhost:${PORT}`);
});
