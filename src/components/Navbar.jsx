import React from 'react';
import logo from '../../src/assets/images/logo1.png';

const Navbar = () => {
  return (
    <header className="shadow-sm bg-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img src={logo} alt="logo" className="h-[70px] w-[70px] object-contain" />
        </a>

        {/* Navigation Links */}
        <ul className="hidden sm:flex items-center space-x-10 text-lg font-medium text-gray-800">
          <li>
            <a href="/" className="hover:text-blue-600 transition duration-200">How it works?</a>
          </li>
          <li>
            <a href="/" className="hover:text-blue-600 transition duration-200">Features</a>
          </li>
          <li>
            <a href="/" className="hover:text-blue-600 transition duration-200">About us</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
