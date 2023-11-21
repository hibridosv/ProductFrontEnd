'use client'
import {Header, SideBar} from "@/components";

const Layout = ({ children }) => {
  return (
    <div className="mx-auto px-1 my-auto ">
    <Header />
    <div>
      <div>
      <SideBar />
      </div>
      <div className="w-full h-full">
        {children}
      </div>
    </div>  
  </div>
  );
};

export default Layout;
