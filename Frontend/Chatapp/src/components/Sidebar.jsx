import React, { useEffect, useState } from "react";

const Sidebar = ({ currentUser, onLogout, onSelectUser, selectedUserId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-112 h-screen bg-gray-100 p-5 border-r border-gray-200 text-black flex flex-col">
      {/* Profile + Logout */}
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-lg font-bold text-white shadow">
          {currentUser?.username ? currentUser.username[0].toUpperCase() : "?"}
        </div>
        <div className="ml-3 flex-1">
          <div className="font-semibold text-gray-800">
            {currentUser?.username || "Me"}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {currentUser?.email}
          </div>
        </div>
        <button
          onClick={onLogout}
          className="ml-2 px-4 py-2 text-xs font-semibold rounded-full 
                     bg-gradient-to-r from-red-500 to-red-600 
                     hover:from-red-600 hover:to-red-700 
                     active:scale-95 text-white shadow-md 
                     transition-all duration-200 ease-in-out"
        >
          Logout
        </button>
      </div>

      {/* Users List */}
      <h2 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
        Users
      </h2>
      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      <ul className="flex-1 overflow-y-auto space-y-2">
        {users
          .filter((u) => u._id !== currentUser?._id)
          .map((user) => (
            <li
              key={user._id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 shadow-sm ${
                selectedUserId === user._id
                  ? "bg-blue-100 ring-2 ring-blue-400"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => onSelectUser(user)}
            >
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-gray-700 font-bold">
                {user.username ? user.username[0].toUpperCase() : "?"}
              </div>
              <span className="text-sm font-medium text-gray-800">
                {user.username}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Sidebar;
