import React from 'react';
import Logo from './Logo';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md p-3 flex justify-between items-center fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center space-x-2">
        <Logo className="w-10 h-10" />
        <h1 className="text-md sm:text-lg font-semibold text-charcoal-gray">
          Funda Nathi IT Mastery Chatbot
        </h1>
      </div>
    </header>
  );
};

export default Header;