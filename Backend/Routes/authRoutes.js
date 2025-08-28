import express from "express";
import User from "../Models/User.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";


const router = express.Router();


// Register
router.post("/register", async (req, res) => {
try {
const { username, email, password } = req.body;
const user = new User({ username, email, password });
await user.save();
res.json({ message: "User registered successfully" });
} catch (err) {
res.status(400).json({ error: err.message });
}
});


// Login
router.post("/login", async (req, res) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ error: "User not found" });


const isMatch = await user.comparePassword(password);
if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });


const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
res.json({ token, user });
} catch (err) {
res.status(500).json({ error: err.message });
}
});


export default router;