import express from "express";
import User from "../Models/User.js";

const router = express.Router();

// GET /api/users - return all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "_id username email");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;
