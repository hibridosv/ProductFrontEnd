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
import { ConfigContext } from "@/contexts/config-context";
import { useContext } from "react";
import { permissionExists } from "@/utils/functions";


export function SideBar() {
const { systemInformation } = useContext(ConfigContext);

const handlePermission = (permission: string, redirect: string): string => {
    if (permissionExists(systemInformation?.permission, permission)) {
      return redirect;
    }
    return "/error/403";
}

  if (!systemInformation?.system?.theme) { return <></> }

  return (
    <Sidebar
      breakPoint="always"
      backgroundColor="rgb(249, 249, 249, 1)"
      image="/img/sidenav.jpg"
    >
      <Menu>
        <div className={`w-full ${systemInformation ? systemInformation?.system?.theme === 1 ? "bg-slate-600" : "bg-lime-100 px-2" : "bg-slate-600"}`}>
          <Image
            src={systemInformation ? systemInformation?.system?.theme === 1 ? "/img/logo_hibrido_s.png" : "/img/logo_latam_s.png" : "/img/logo_hibrido_s.png"}
            alt="Logo"
            width={300}
            height={80}
            priority={false}
          />
        </div>
        <MenuItem icon={<HiFingerPrint />} component={<Link href={handlePermission("dashboard", "/dashboard")} />}>Panel Principal</MenuItem>
        <MenuItem icon={<FaCashRegister />} component={<Link href={handlePermission("cashdrawer", "/cashdrawers")} />}>Control de cajas</MenuItem>

        <SubMenu label="Inventario" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href={handlePermission("inventory", "/product")} />}>Ver Productos</MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("inventory-register", "/product/register")} />}>Registrar Producto</MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("inventory-edit", "/product/edit")} />}>Editar Producto</MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("inventory-add", "/product/add")} />}>Agregar Productos</MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("inventory-failure", "/product/failure")} />}>Descontar Productos</MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("inventory-linked", "/product/linked")} />}>Productos Relacionados</MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("inventory-stock", "/product/stock")} />}>Bajas Existencias</MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("inventory-expiration", "/product/expiration")} />}>Proximos Vencimientos</MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("inventory-karex", "/product/kardex")} />}>Kardex</MenuItem>
        </SubMenu>

        <SubMenu label="Efectivo" icon={<IoMdCash />}>
          <MenuItem component={<Link className="text-sm" href={handlePermission("cash-bills", "/cash/bills")} />}>Registro de gastos </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("cash-remittance", "/cash/remittance")} />}>Remesas de efectivo </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("cash-accounts", "/cash/accounts")} />}>Cuentas Bancarias </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("cash-inout", "/cash/inout")} />}>Flujo de Efectivo </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("cash-history", "/cash/history")} />}>Historial de transferencias </MenuItem>
        </SubMenu>

        <SubMenu label="Cuentas" icon={<TbBrandCashapp />}>
          <MenuItem component={<Link className="text-sm" href={handlePermission("credits-receivable", "/credits/receivable")} />}>Cuentas por cobrar </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("credits-payable", "/credits/payable")} />}>Cuentas por pagar </MenuItem>
        </SubMenu>


        <SubMenu label="Directorio" icon={<FaAddressBook />}>
          <MenuItem component={<Link className="text-sm" href={handlePermission("directory", "/directory")} />}>Contactos </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("directory", "/directory/client")} />}>Clientes </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("directory", "/directory/employee")} />}>Repartidores </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("directory", "/directory/provider")} />}>Proveedores </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("directory", "/directory/referred")} />}>Referidos </MenuItem>
        </SubMenu>

        <SubMenu label="Historiales" icon={<FaHistory />}>
          <MenuItem component={<Link className="text-sm" href={handlePermission("histories-sales", "/histories/sales")} />}>Ventas  </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("histories-bills", "/histories/bills")} />}>Gastos  </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("histories-remittance", "/histories/remittance")} />}>Remesas  </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("histories-cut", "/histories/cut")} />}>Cortes de caja  </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("histories-discount", "/histories/discount")} />}>Ventas con descuento  </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("histories-list", "/histories/list")} />}>Listado de ventas  </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("histories-by-user", "/histories/by-user")} />}>Ventas por usuario  </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("histories-deleted", "/histories/deleted")} />}>Ordenes eliminadas  </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("histories-cost", "/histories/cost")} />}>Listado de costos  </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("histories-shipping-notes", "/histories/shipping-notes")} />}>Notas de envío  </MenuItem>
        </SubMenu>

        <SubMenu label="Herramientas" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href={handlePermission("tools-quotes", "/tools/quotes")} />}>Cotizaciones </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("tools-commissions", "/tools/commissions")} />}>Detalle Comisiones </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("tools-adjustment", "/tools/adjustment")} />}>Ajustar inventario </MenuItem>
        </SubMenu>

        <SubMenu label="Reportes" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href={handlePermission("reports-sales", "/reports/sales")} />}>Detalles de ventas </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("reports-bills", "/reports/bills")} />}>Detalles de gastos </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("reports-products", "/reports/products")} />}>Productos ingresados </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("reports-products", "/reports/failures")} />}>Productos Averiados </MenuItem>
        </SubMenu>

        <SubMenu label="Facturación" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href={handlePermission("invoices-documents", "/invoices/documents")} />}>Documentos Emitidos </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("invoices-electronic", "/invoices/electronic")} />}>Documentos Electrónicos </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("invoices-search", "/invoices/search")} />}>Buscar Documentos </MenuItem>
          {/* <MenuItem component={<Link className="text-sm" href="/cash" />}>Reporte contable </MenuItem> */}
        </SubMenu>

        <SubMenu label="Transferencias" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href={handlePermission("transfers-send", "/transfers/send")} />}>Crear Transferencia </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("transfers-receive", "/transfers/receive")} />}>Aceptar Transferencia </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("transfers-request", "/transfers/request")} />}>Solicitar Transferencia </MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("histories-transfers", "/histories/transfers")} />}>Listado de Transferencias </MenuItem>
        </SubMenu>
        {/*         
        <SubMenu label="Planillas" icon={<HiOutlineChartSquareBar color="red" />}>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Consultar Planillas </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Crear Planillas </MenuItem>
          <MenuItem component={<Link className="text-sm" href="/cash" />}>Administrar empleados </MenuItem>
        </SubMenu> */}

        <SubMenu label="Configuraciones" icon={<HiOutlineChartSquareBar />}>
          <MenuItem component={<Link className="text-sm" href={handlePermission("config", "/config")} />}>Principal</MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("config-products", "/config/product")} />}>Productos</MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("config-user", "/config/user")} />}>Usuarios</MenuItem>
          <MenuItem component={<Link className="text-sm" href={handlePermission("config-transfers", "/config/transfers")} />}>Sucursales</MenuItem>
          {/* <MenuItem component={<Link className="text-sm" href="/error/403" />}>Error</MenuItem> */}

        </SubMenu>
        <MenuItem icon={<HiLogout />} href="/logout">Salir</MenuItem>
      </Menu>
    </Sidebar>
  );
}
