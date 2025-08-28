import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./Routes/authRoutes.js";
import messageRoutes from "./Routes/MessageRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import Message from "./Models/Message.js";
import { MONGO_URI } from "./config.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // React frontend
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Socket.io
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("sendMessage", async (data) => {
    // Save the user message
    let message = new Message({ sender: data.sender, receiver: data.receiver, content: data.content });
    await message.save();
    message = await Message.findById(message._id).populate("sender", "username").populate("receiver", "username");
    io.emit("receiveMessage", message);

    // Fake auto-reply messages
    const randomReplies = [
      "Hello 👍",
      "Sounds good!",
      "Okay, noted.",
      "Let’s talk later.",
      "Haha, nice one 😂",
      "Sure, I agree.",
      "That’s interesting 🤔",
      "I see.",
      "I'm Good",
    ];
    const replyContent = randomReplies[Math.floor(Math.random() * randomReplies.length)];
    // Create reply from "receiver" back to "sender"
    let reply = new Message({
      sender: data.receiver,
      receiver: data.sender,
      content: replyContent,
    });
    await reply.save();
    reply = await Message.findById(reply._id).populate("sender", "username").populate("receiver", "username");
    io.emit("receiveMessage", reply);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Connect DB & Start Server
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    httpServer.listen(5000, () =>
      console.log("🚀 Server running on http://localhost:5000")
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
