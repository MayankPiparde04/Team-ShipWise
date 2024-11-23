import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/ShipWiseLogo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close the mobile menu
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed z-50 top-0 left-0 w-full h-20 z-20 bg-gray-900 bg-opacity-70 backdrop-blur-md shadow-md flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="ShipWise Logo" className="h-16" />
        </Link>

        {/* Full Navigation Links (visible on large screens) */}
        <div className="hidden lg:flex lg:space-x-6">
          <Link
            to="/"
            className="text-gray-200 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-lg font-medium"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="/dashboard/home"
            className="text-gray-200 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-lg font-medium"
            onClick={closeMenu}
          >
            Dashboard
          </Link>
          <Link
            to="/about"
            className="text-gray-200 hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md text-lg font-medium"
            onClick={closeMenu}
          >
            About
          </Link>
        </div>

        {/* Right: Authentication Links (visible on large screens) */}
        <div className="hidden lg:flex lg:space-x-6">
          <Link
            to="/auth/login"
            className="px-6 py-2 bg-gradient-to-r from-indigo-400 to-teal-400 text-transparent bg-clip-text font-semibold text-lg rounded-md hover:bg-indigo-600 focus:outline-none"
            onClick={closeMenu}
          >
            Login
          </Link>
          <Link
            to="/auth/signup"
            className="px-6 py-2 bg-gradient-to-r from-teal-400 to-indigo-400 text-transparent bg-clip-text font-semibold text-lg rounded-md hover:bg-teal-600 focus:outline-none"
            onClick={closeMenu}
          >
            Signup
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-white text-2xl focus:outline-none"
        >
          {isMenuOpen ? '×' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-gray-900 bg-opacity-90 text-white rounded-lg shadow-lg px-8 py-4 lg:hidden">
          <Link
            to="/"
            className="block text-lg font-medium hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="/dashboard/home"
            className="block text-lg font-medium hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md"
            onClick={closeMenu}
          >
            Dashboard
          </Link>
          <Link
            to="/about"
            className="block text-lg font-medium hover:bg-gray-700 hover:text-white px-4 py-2 rounded-md"
            onClick={closeMenu}
          >
            About
          </Link>
          <Link
            to="/auth/login"
            className="block px-6 py-2 bg-gradient-to-r from-indigo-400 to-teal-400 text-transparent bg-clip-text font-semibold text-lg rounded-md hover:bg-indigo-600 focus:outline-none"
            onClick={closeMenu}
          >
            Login
          </Link>
          <Link
            to="/auth/signup"
            className="block px-6 py-2 bg-gradient-to-r from-teal-400 to-indigo-400 text-transparent bg-clip-text font-semibold text-lg rounded-md hover:bg-teal-600 focus:outline-none"
            onClick={closeMenu}
          >
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
