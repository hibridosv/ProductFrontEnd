"use client";

import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  HiFingerPrint,
  HiCalendar,
  HiGlobe,
  HiOutlineChartSquareBar,
} from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
import LogoImage from "../../../../public/img/lgb.png";

export function SideBar() {
  return (
    <Sidebar
      breakPoint="always"
      backgroundColor="rgb(249, 249, 249, 1)"
      // image="https://sistema.hibridosv.com/assets/img/Photos/Others/sidenav4.jpg"
    >
      <Menu>
        <div className="w-full bg-slate-600">
          <Image
            src={LogoImage}
            alt="Logo"
            // width={300}
            // height={80}
          />
        </div>
        <MenuItem icon={<HiFingerPrint />} component={<Link href="/" />}>
          Inicio
        </MenuItem>

        <SubMenu label="Productos" icon={<HiOutlineChartSquareBar />}>
          <MenuItem icon={<HiCalendar />} component={<Link href="/product" />}>
            Ver Productos
          </MenuItem>
          <MenuItem
            icon={<HiCalendar />}
            component={<Link href="/product/add" />}
          >
            Agregar Producto
          </MenuItem>
        </SubMenu>

        <MenuItem icon={<HiGlobe />}>Dashboard</MenuItem>
        <SubMenu label="Configuraciones" icon={<HiOutlineChartSquareBar />}>
          <MenuItem
            icon={<HiOutlineChartSquareBar />}
            component={<Link href="/config" />}
          >
            Principal
          </MenuItem>
          <MenuItem icon={<HiOutlineChartSquareBar />}>invoices</MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
}
