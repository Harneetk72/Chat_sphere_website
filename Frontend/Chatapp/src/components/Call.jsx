import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, PhoneOff, Phone } from "lucide-react";

const Call = ({ onClose, callee }) => {
  const [micOn, setMicOn] = useState(true);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateX: -15 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white rounded-2xl shadow-2xl p-8 w-96 flex flex-col items-center relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <Phone className="w-14 h-14 mx-auto mb-2 animate-pulse" />
          <h2 className="text-2xl font-bold">
            Calling {callee?.username || "User"}...
          </h2>
          <p className="text-sm text-gray-200">Ringing...</p>
        </motion.div>

        {/* Controls */}
        <div className="flex space-x-6 mt-6">
          {/* Mic Button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setMicOn(!micOn)}
            className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
              micOn ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 hover:bg-gray-600"
            }`}
          >
            {micOn ? (
              <Mic className="w-6 h-6 text-white" />
            ) : (
              <MicOff className="w-6 h-6 text-white" />
            )}
          </motion.button>

          {/* End Call */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={onClose}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 shadow-lg transition-all duration-300"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </motion.button>
        </div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-gray-200 text-xs text-center"
        >
          (This is a demo call UI. Integrate WebRTC or Socket.IO for real audio/video.)
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Call;


