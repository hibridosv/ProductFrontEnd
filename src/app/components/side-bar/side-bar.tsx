"use client";

import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  HiFingerPrint,
  HiOutlineChartSquareBar,
} from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";

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
            src="/img/logo.png"
            alt="Logo"
            width={300}
            height={80}
            priority={false}
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
          <MenuItem component={<Link className="text-sm" href="/product/add" />}>
            Agregar Productos
          </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/failure" />}>
            Descontar Averias
          </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/compound" />}>
            Productos Compuestos
          </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/stock" />}>
            Bajas Existencias
          </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/expiration" />}>
            Proximos Vencimientos
          </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/kardex" />}>
            Kardex
          </MenuItem>
        </SubMenu>

        {/* <MenuItem icon={<HiGlobe />}>Dashboard</MenuItem> */}
        <SubMenu label="Configuraciones" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href="/config" />}>
            Principal
          </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/config/product" />}>
            Productos
          </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
}
