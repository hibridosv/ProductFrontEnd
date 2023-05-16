import React from 'react';

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-gray-900 text-white p-4">
      {/* <div className="text-xl font-bold">Head</div> */}
      <button
        className="text-white focus:outline-none lg:hidden"
        onClick={onMenuClick}
      >
        Menú
      </button>
    </header>
  );
};

export default Header;