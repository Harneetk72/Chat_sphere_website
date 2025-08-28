import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Call from "../components/Call";

const socket = io("http://localhost:5000");

export default function ChatPage({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCall, setShowCall] = useState(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/messages").then((res) =>
      setMessages(res.data)
    );

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = async () => {
    if (!selectedUser || !newMessage.trim()) return;

    const messageData = {
      sender: user._id,
      receiver: selectedUser._id,
      content: newMessage,
    };

    socket.emit("sendMessage", messageData);

    try {
      await axios.post("http://localhost:5000/api/messages", messageData);
    } catch (err) {
      console.error("Error saving message:", err);
    }

    setNewMessage("");
  };

  // 🎤 Start speech recognition
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNewMessage((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.start();
  };

  // Filter messages between current user & selected user
  const filteredMessages = selectedUser
    ? messages.filter(
        (msg) =>
          (msg.sender?._id === user._id &&
            msg.receiver?._id === selectedUser._id) ||
          (msg.sender?._id === selectedUser._id &&
            msg.receiver?._id === user._id)
      )
    : [];

  const handleLogout = () => {
    window.location.reload(); // simple logout for demo
  };

  const handleEndCall = () => {
    setShowCall(false);
    if (selectedUser) {
      const callEndMsg = {
        sender: user._id,
        receiver: selectedUser._id,
        content: "Call ended.",
      };
      socket.emit("sendMessage", callEndMsg);
      axios.post("http://localhost:5000/api/messages", callEndMsg).catch(console.error);
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <Sidebar
        currentUser={user}
        onLogout={handleLogout}
        onSelectUser={setSelectedUser}
        selectedUserId={selectedUser?._id}
      />

      {/* Main Chat Section */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {/* Header with selected user */}
        {selectedUser && (
          <div className="flex items-center p-4 border-b border-gray-800 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-300 flex items-center justify-center text-xl font-bold text-white mr-3">
              {selectedUser.username
                ? selectedUser.username[0].toUpperCase()
                : "?"}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white">{selectedUser.username}</div>
              <div className="text-xs text-gray-400">{selectedUser.email}</div>
            </div>
            <button
              className="ml-2 px-3 py-1 bg-green-500 text-white rounded text-sm"
              onClick={() => setShowCall(true)}
            >
              Call
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {selectedUser ? (
            filteredMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded flex ${
                  msg.sender?._id === user._id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    msg.sender?._id === user._id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  <strong className="block text-xs mb-1">
                    {msg.sender?._id === user._id ? "Me" : selectedUser.username}
                  </strong>
                  {msg.content}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400">
              Select a user to start chatting.
            </div>
          )}
        </div>

        {/* Input box */}
        {selectedUser && (
          <div className="p-4 flex border-t border-gray-800 items-center">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-700 text-white"
              placeholder={`Message ${selectedUser.username}...`}
            />

            {/* 🎤 Mic button */}
            <button
              className={`ml-2 px-3 py-2 rounded flex items-center justify-center ${
                listening ? "bg-red-500 text-white" : "bg-gray-300 text-gray-700"
              }`}
              title="Mic"
              onClick={startListening}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75v2.25m0 0h-3m3 0h3m-3-2.25a6 6 0 006-6V9a6 6 0 10-12 0v3a6 6 0 006 6z"
                />
              </svg>
            </button>

            {/* Send button */}
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            >
              Send
            </button>
          </div>
        )}

        {/* Call UI */}
        {showCall && selectedUser && (
          <Call callee={selectedUser} onClose={handleEndCall} />
        )}
      </div>
    </div>
  );
}
