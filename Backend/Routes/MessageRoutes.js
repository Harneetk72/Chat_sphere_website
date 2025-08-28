import express from "express";
import Message from "../Models/Message.js";

const router = express.Router();

// Get all messages
router.get("/", async (req, res) => {
	try {
		const messages = await Message.find()
			.populate("sender", "username")
			.populate("receiver", "username");
		res.json(messages);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch messages" });
	}
});

// Send a message + instant reply
router.post("/", async (req, res) => {
	try {
		const { sender, receiver, content } = req.body;

		// Save the user message
		const message = new Message({ sender, receiver, content });
		await message.save();

		// Fake auto-reply messages
		const randomReplies = [
			"Got it 👍",
			"Sounds good!",
			"Okay, noted.",
			"Let’s talk later.",
			"Haha, nice one 😂",
			"Sure, I agree.",
			"That’s interesting 🤔",
		];

		// Pick a random reply
		const replyContent = randomReplies[Math.floor(Math.random() * randomReplies.length)];

		// Create reply from "receiver" back to "sender"
		const reply = new Message({
			sender: receiver,     // opposite user
			receiver: sender,     // send back to original sender
			content: replyContent,
		});
		await reply.save();

		// Return both messages (sent + reply)
		res.json({ sent: message, reply });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to send message" });
	}
});

export default router;