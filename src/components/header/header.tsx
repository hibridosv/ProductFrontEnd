"use client";
import { useProSidebar } from "react-pro-sidebar";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillHome } from "react-icons/ai"

export function Header() {
  const { toggleSidebar } = useProSidebar();

  return (

    <header className="bg-white">
    <nav className="w-full mx-auto flex items-center justify-between p-2 bg-mdb" aria-label="Global">
      <div className="flex">
      <GiHamburgerMenu className='clickeable' color="white" onClick={() => toggleSidebar()} size={40} />
      </div>

      <div className="justify-end">
          <Link href="/sales/quick"><span className="clickeable text-white"><span><AiFillHome size={24} /></span></span></Link>
      </div>
    </nav>
  </header>
  );
}
