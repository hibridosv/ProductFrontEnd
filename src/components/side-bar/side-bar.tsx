"use client";

import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  HiFingerPrint,
  HiOutlineChartSquareBar,
  HiLogout,
} from "react-icons/hi";
import { IoMdCash } from "react-icons/io";
import { FaCashRegister, FaAddressBook, FaHistory  } from "react-icons/fa";
import { TbBrandCashapp } from "react-icons/tb";

import Link from "next/link";
import Image from "next/image";
import { destroyAuthCookie } from "@/services/oauth";

const handleLogout = () => {
  destroyAuthCookie();
  window.location.href = "/";
}

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
        <MenuItem icon={<HiFingerPrint />} component={<Link href="/" />}>Panel Principal</MenuItem>
        <MenuItem icon={<FaCashRegister />} component={<Link href="/cashdrawers" />}>Control de cajas</MenuItem>

        <SubMenu label="Inventario" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href="/product" />}>Ver Productos</MenuItem>
          <MenuItem  component={<Link className="text-sm" href="/product/register" />}>Registrar Producto</MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/edit" />}>Editar Producto</MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/add" />}>Agregar Productos</MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/failure" />}>Descontar Averias</MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/linked" />}>Productos Relacionados</MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/stock" />}>Bajas Existencias</MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/expiration" />}>Proximos Vencimientos</MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/kardex" />}>Kardex</MenuItem>
        </SubMenu>

        <SubMenu label="Efectivo" icon={<IoMdCash />}>
          <MenuItem component={<Link className="text-sm" href="/cash/bills" />}>Registro de gastos </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash/remittance" />}>Remesas de efectivo </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash/accounts" />}>Cuentas Bancarias </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash/inout" />}>Flujo de Efectivo </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash/history" />}>Historial de transferencias </MenuItem>
        </SubMenu>

        <SubMenu label="Cuentas" icon={<TbBrandCashapp />}>
          <MenuItem component={<Link className="text-sm" href="/credits/receivable" />}>Cuentas por cobrar </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/credits/payable" />}>Cuentas por pagar </MenuItem>
        </SubMenu>


        <SubMenu label="Directorio" icon={<FaAddressBook />}>
          <MenuItem component={<Link className="text-sm" href="/directory" />}>Contactos </MenuItem>
        </SubMenu>

        <SubMenu label="Historiales" icon={<FaHistory />}>
          <MenuItem component={<Link className="text-sm" href="/histories/sales" />}>Ventas  </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/histories/bills" />}>Gastos  </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/histories/remittance" />}>Remesas  </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/histories/cut" />}>Cortes de caja  </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/histories/discount" />}>Ventas con descuento  </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/histories/list" />}>Listado de ventas  </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/histories/by-user" />}>Ventas por usuario  </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/histories/deleted" />}>Ordenes eliminadas  </MenuItem>
        </SubMenu>

        <SubMenu label="Herramientas" icon={<HiOutlineChartSquareBar color="blue" />}>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Ingreso rápido de productos </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Ajustar inventario </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Importar desde Excel </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Restablecer precios </MenuItem>
        </SubMenu>

        <SubMenu label="Cotizaciones" icon={<HiOutlineChartSquareBar color="red" />}>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Crear Cotizaciones </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Consultar Cotizaciones </MenuItem>
        </SubMenu>

        <SubMenu label="Reportes" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href="/reports/sales" />}>Detalles de ventas </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/reports/bills" />}>Detalles de gastos </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/reports/products" />}>Productos ingresados </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/reports/commissions" />}>Detalle Comisiones </MenuItem>
        </SubMenu>

        <SubMenu label="Facturación" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href="/invoices/documents" />}>Documentos Emitidos </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/invoices/search" />}>Buscar Documentos </MenuItem>
          {/* <MenuItem component={<Link className="text-sm" href="/cash" />}>Reporte contable </MenuItem> */}
        </SubMenu>
        
        <SubMenu label="Planillas" icon={<HiOutlineChartSquareBar color="red" />}>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Consultar Planillas </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Crear Planillas </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Administrar empleados </MenuItem>
        </SubMenu>

        <SubMenu label="Configuraciones" icon={<HiOutlineChartSquareBar color="red" />}>
          <MenuItem component={<Link className="text-sm" href="/config" />}>Principal</MenuItem>
          <MenuItem component={<Link className="text-sm" href="/config/product" />}>Productos</MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Perfiles de usuario </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Administración Principal </MenuItem>
        </SubMenu>
        <MenuItem icon={<HiLogout />} onClick={()=>handleLogout()}>Salir</MenuItem>
      </Menu>
    </Sidebar>
  );
}
