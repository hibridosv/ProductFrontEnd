"use client";
import { useProSidebar } from "react-pro-sidebar";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";

export function Header() {
  const { toggleSidebar } = useProSidebar();

  return (

    <header className="bg-white">
    <nav className="w-full mx-auto flex items-center justify-between p-2 bg-mdb" aria-label="Global">
      <div className="flex">
      <GiHamburgerMenu className='clickeable' color="white" onClick={() => toggleSidebar()} size={40} />
      </div>

      <div className="justify-end clickeable">
          <Link href="/sales/quick"><span className=" text-white font-black text-xl"><span>&#9750;</span> Inicio</span></Link>
      </div>
    </nav>
  </header>
  );
}
