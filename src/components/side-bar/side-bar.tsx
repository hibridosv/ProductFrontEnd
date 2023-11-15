"use client";

import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  HiFingerPrint,
  HiOutlineChartSquareBar,
  HiLogout,
  HiCash
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
        <MenuItem icon={<HiFingerPrint />} component={<Link href="/" />}>Panel Principal</MenuItem>
        <MenuItem icon={<HiCash />} component={<Link href="/cash" />}>Control de cajas</MenuItem>

        <SubMenu label="Inventario" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href="/product" />}>Ver Productos</MenuItem>
          <MenuItem  component={<Link className="text-sm" href="/product/register" />}>Registrar Producto</MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/edit" />}>Editar Producto</MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/add" />}>Agregar Productos</MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/failure" />}>Descontar Averias</MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/compound" />}>Productos Compuestos</MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/stock" />}>Bajas Existencias</MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/expiration" />}>Proximos Vencimientos</MenuItem>
          <MenuItem component={<Link className="text-sm" href="/product/kardex" />}>Kardex</MenuItem>
        </SubMenu>

        <SubMenu label="Efectivo" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href="/cash/bills" />}>Registro de gastos </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash/remittance" />}>Remesas de efectivo </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash/accounts" />}>Cuentas Bancarias </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash/inout" />}>Flujo de Efectivo </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash/history" />}>Historial de transferencias </MenuItem>
        </SubMenu>

        <SubMenu label="Cuentas" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href="/credits/receivable" />}>Cuentas por cobrar </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/credits/payable" />}>Cuentas por pagar </MenuItem>
        </SubMenu>

        <SubMenu label="Historiales" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Consolidado diario </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Ventas  </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Gastos  </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Remesas  </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Cortes de caja  </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Ventas con descuento  </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Listado de ventas  </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Ventas por usuario  </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Ordenes eliminadas  </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Reporte mensual  </MenuItem>
        </SubMenu>

        <SubMenu label="Herramientas" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Ingreso rápido de productos </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Ajustar inventario </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Importar desde Excel </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Restablecer precios </MenuItem>
        </SubMenu>

        <SubMenu label="Cotizaciones" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Crear Cotizaciones </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Consultar Cotizaciones </MenuItem>
        </SubMenu>

        <SubMenu label="Directorio" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Clientes </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Proveedores </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Repartidores </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Referidos </MenuItem>
        </SubMenu>

        <SubMenu label="Reportes" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Detalles de ventas </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Productos averiados </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Ventas Agrupadas </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Detalles de gastos </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Productos ingresados </MenuItem>
        </SubMenu>

        <SubMenu label="Facturación" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Facturas Emitidas </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Reemprimir Facturas </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Eliminar Facturas </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Reporte contable </MenuItem>
        </SubMenu>
        
        <SubMenu label="Planillas" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Consultar Planillas </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Crear Planillas </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Administrar empleados </MenuItem>
        </SubMenu>
        {/* <MenuItem icon={<HiGlobe />}>Dashboard</MenuItem> */}
        <SubMenu label="Configuraciones" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href="/config" />}>Principal</MenuItem>
          <MenuItem component={<Link className="text-sm" href="/config/product" />}>Productos</MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Perfiles de usuario </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Administración Principal </MenuItem>
        </SubMenu>
        <MenuItem icon={<HiLogout />} component={<Link href="/cash" />}>Salir</MenuItem>
      </Menu>
    </Sidebar>
  );
}
