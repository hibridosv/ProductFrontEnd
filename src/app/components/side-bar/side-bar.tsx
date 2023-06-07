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

        <SubMenu label="Inventario" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href="/product" />}>
            Ver Productos
          </MenuItem>
          <MenuItem  component={<Link className="text-sm" href="/product/register" />}>
            Registrar Producto
          </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/edit" />}>
            Editar Producto
          </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/" />}>
            Agregar Productos
          </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/" />}>
            Descontar Averias
          </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/" />}>
            Productos Compuestos
          </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/" />}>
            Bajas Existencias
          </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/" />}>
            Proximos Vencimientos
          </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/" />}>
            Productos Vendidos
          </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/kardex" />}>
            Kardex
          </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/" />}>
            Opciones y Configuraciones
          </MenuItem>
        </SubMenu>

        {/* <MenuItem icon={<HiGlobe />}>Dashboard</MenuItem> */}
        <SubMenu label="Configuraciones" icon={<HiOutlineChartSquareBar />}>
          <MenuItem icon={<HiOutlineChartSquareBar />} component={<Link href="/config" />}>
            Principal
          </MenuItem>
          <MenuItem icon={<HiOutlineChartSquareBar />}>invoices</MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
}
