import { useState } from "react";
import axios from "axios";
import Header from "./Header";

export default function Login({ setUser, setShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  return (
    <>
    <Header/>
    <form
      onSubmit={handleLogin}
      className="bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-700"
    >
      <h2 className="text-3xl font-extrabold mb-6 text-white text-center tracking-tight">
        Login
      </h2>

      <div className="mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
      </div>

      <div className="mb-6">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold p-3 rounded-lg 
          hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-md"
      >
        Login
      </button>

      {/* Switch to Register */}
      <p className="text-gray-400 text-sm text-center mt-4">
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={() => setShowRegister(true)}
          className="text-green-500 hover:underline font-semibold"
        >
          Register
        </button>
      </p>
    </form>
    </>
  );
  
}
