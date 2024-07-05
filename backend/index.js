import express from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import connectDB from "./connect.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import channelRoutes from "./routes/channels.js"
import authRoutes from "./routes/auth.js";
import subscriptionRoutes from "./routes/subscriptions.js";
import searchRoutes from "./routes/search.js";
import quotaRoutes from "./routes/quota.js";
import viewRoutes from "./routes/views.js";


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
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/search", searchRoutes); 
app.use("/api/quota", quotaRoutes);
app.use("/api/views", viewRoutes);


const PORT = 8800;

// Connect to MongoDB
connectDB();

// Start the express app after successful database connection
app.listen(PORT, () => {
  console.log(`API working on http://localhost:${PORT}`);
});
