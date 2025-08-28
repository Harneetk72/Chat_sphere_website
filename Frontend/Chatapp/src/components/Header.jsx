import React from 'react'

const Header = () => {
  return (
    <div>
       <header className="bg-transparent w-full py-6 text-center">
              <h1
                className="text-4xl font-extrabold tracking-wide 
                bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 
                bg-clip-text text-transparent drop-shadow-lg 
                transition-transform transform hover:scale-105"
              >
                ChatSphere
              </h1>
              <p className="text-gray-400 mt-2 text-sm">
                Connect • Chat • Share
              </p>
            </header>
    </div>
  )
}

export default Header
