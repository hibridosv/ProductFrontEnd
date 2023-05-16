"use client"
import React from 'react';
import SideBar from './side-bar';
import Header from './header';

const Layout = ({ children }) => {
  const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <div>
      <Header onMenuClick={toggleSideBar} />
      <div className="flex">
        <SideBar isOpen={isSideBarOpen} />
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
