import { useState } from "react";
import axios from "axios";
import Header from "./Header";

export default function Register({ setUser, setShowRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/auth/register", {
      username,
      email,
      password,
    });
    alert("User registered, please login.");
    setShowRegister(false); // go back to login after successful register
  };

  return (
  <>
  <Header/>
      <form
      onSubmit={handleRegister}
      className="bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-700 mt-6"
    >
      <h2 className="text-3xl font-extrabold mb-6 text-white text-center tracking-tight">
        Register
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 
            focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
        />
      </div>

      <div className="mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 
            focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
        />
      </div>

      <div className="mb-6">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 
            focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 text-white font-bold p-3 rounded-lg 
          hover:bg-green-700 transition duration-300 transform hover:scale-105 shadow-md"
      >
        Register
      </button>

      {/* Switch to Login */}
      <p className="text-gray-400 text-sm text-center mt-4">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => setShowRegister(false)}
          className="text-blue-500 hover:underline font-semibold"
        >
          Login
        </button>
      </p>
    </form>
  </>
  );
}
