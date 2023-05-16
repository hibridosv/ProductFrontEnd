'use client'
import { useState } from 'react';
import Link from 'next/link';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      <button
        className="fixed z-50 flex items-center justify-center w-12 h-12 bg-gray-800 text-white rounded-full shadow-md lg:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      <aside
        className={`bg-gray-800 text-gray-200 w-64 min-h-screen flex-shrink-0 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:block`}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold">Menú</h2>
        </div>

        <nav className="flex-grow">
          <ul className="p-4">
            <li>
              <Link href="/">
                <a className="block py-2">Inicio</a>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <a className="block py-2">Acerca de</a>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <a className="block py-2">Contacto</a>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default SideBar;
