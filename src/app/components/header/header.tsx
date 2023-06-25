"use client";
import { Navbar, Button } from "flowbite-react";
import { useProSidebar } from "react-pro-sidebar";
import Image from "next/image";
import LogoImage from "../../../../public/img/logo_small.png";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";

export function Header() {
  const { toggleSidebar } = useProSidebar();

  return (
    <div className="w-full">
      <Navbar
        fluid={true}
        rounded={true}
        className="border-solid border-2 border-b-sky-500"
      >
        <Navbar.Brand>
          <GiHamburgerMenu onClick={() => toggleSidebar()} size={40} />
          {/* <button className="sb-button" onClick={() => toggleSidebar()}>
            <Image src={LogoImage} alt="Logo" />
          </button> */}
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Link href="/sales/quick"><Button >NUEVA VENTA</Button></Link>
          {/* <Navbar.Toggle /> */}
        </div>
        {/* <Navbar.Collapse>
          <Navbar.Link href="/navbars" active={true}>
            Home
          </Navbar.Link>
          <Navbar.Link href="/navbars">About</Navbar.Link>
          <Navbar.Link href="/navbars">Services</Navbar.Link>
          <Navbar.Link href="/navbars">Pricing</Navbar.Link>
          <Navbar.Link href="/navbars">Contact</Navbar.Link>
        </Navbar.Collapse> */}
      </Navbar>
    </div>
  );
}
