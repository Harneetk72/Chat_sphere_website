import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import ChatPage from "./pages/ChatPage";

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false); // toggle between login/register

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Website Name/Header */}
   
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        {!user ? (
          <div className="w-full max-w-md space-y-6">
            {showRegister ? (
              <Register setUser={setUser} setShowRegister={setShowRegister} />
            ) : (
              <Login setUser={setUser} setShowRegister={setShowRegister} />
            )}
          </div>
        ) : (
          <ChatPage user={user} />
        )}
      </main>
    </div>
  );
}

export default App;
