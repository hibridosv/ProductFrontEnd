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
import { ReactElement, useContext } from "react";
import { permissionExists } from "@/utils/functions";


export function SideBar() {
const { systemInformation } = useContext(ConfigContext);
const sys = systemInformation?.system?.tenant?.system;

const hasAnyPermission = (permissions: string[]): boolean => {
  return permissions.some(permission => permissionExists(systemInformation?.permission, permission));
}


const showIten = (permission: string, item: ReactElement): ReactElement => {
  if (permissionExists(systemInformation?.permission, permission)) {
    return item;
  }
  return <></>
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
        { hasAnyPermission(["dashboard"]) && 
          showIten("dashboard", <MenuItem icon={<HiFingerPrint />} component={<Link href="/dashboard" />}>Panel Principal</MenuItem>)
        }

        { hasAnyPermission(["cashdrawer"]) &&
        showIten("cashdrawer", <MenuItem icon={<FaCashRegister />} component={<Link href="/cashdrawers" />}>Control de cajas</MenuItem>)
        }
        
        { hasAnyPermission(["restaurant-add-product", "restaurant-producs", "restaurant-screen", "restaurant-counter"]) && (sys == 2 || sys == 4) &&
            <SubMenu label="Restaurante" icon={<IoMdCash />}>
            {showIten("restaurant-add-product", <MenuItem component={<Link className="text-sm" href="/restaurant/add-product" />}>Agregar Producto </MenuItem>)}
            {showIten("restaurant-producs", <MenuItem component={<Link className="text-sm" href="/restaurant/products" />}>Productos de Menu </MenuItem>)}
            {showIten("restaurant-screen", <MenuItem component={<Link className="text-sm" href="/restaurant/screen" />}>Pantalla </MenuItem>)}
            {showIten("restaurant-counter", <MenuItem component={<Link className="text-sm" href="/restaurant/counter" />}>Pantalla Despacho </MenuItem>)}
            {showIten("restaurant-orders", <MenuItem component={<Link className="text-sm" href="/restaurant/orders" />}>Listado de Ordenes</MenuItem>)}
            </SubMenu>
        }

        { hasAnyPermission(["inventory", "inventory-register", "inventory-edit", "inventory-add", "inventory-failure", "inventory-linked", "inventory-stock", "inventory-expiration", "inventory-karex"]) &&
        <SubMenu label="Inventario" icon={<HiOutlineChartSquareBar />}>
          {showIten("inventory", <MenuItem component={<Link className="text-sm" href="/product" />}>Ver Productos</MenuItem>)}
          {showIten("inventory-register", <MenuItem component={<Link className="text-sm" href="/product/register" />}>Registrar Producto</MenuItem>)}
          {showIten("inventory-edit", <MenuItem component={<Link className="text-sm" href="/product/edit" />}>Editar Producto</MenuItem>)}
          {showIten("inventory-add", <MenuItem component={<Link className="text-sm" href="/product/add" />}>Agregar Productos</MenuItem>)}
          {showIten("inventory-failure", <MenuItem component={<Link className="text-sm" href="/product/failure" />}>Descontar Productos</MenuItem>)}
          {showIten("inventory-linked", <MenuItem component={<Link className="text-sm" href="/product/linked" />}>Productos Relacionados</MenuItem>)}
          {showIten("inventory-stock", <MenuItem component={<Link className="text-sm" href="/product/stock" />}>Bajas Existencias</MenuItem>)}
          {showIten("inventory-expiration", <MenuItem component={<Link className="text-sm" href="/product/expiration" />}>Proximos Vencimientos</MenuItem>)}
          {showIten("inventory-karex", <MenuItem component={<Link className="text-sm" href="/product/kardex" />}>Kardex</MenuItem>)}
        </SubMenu>
        }

        { hasAnyPermission(["cash-bills", "cash-remittance", "cash-accounts", "cash-inout", "cash-history"]) &&
        <SubMenu label="Efectivo" icon={<IoMdCash />}>
          {showIten("cash-bills", <MenuItem component={<Link className="text-sm" href="/cash/bills" />}>Registro de gastos </MenuItem>)}
          {showIten("cash-remittance", <MenuItem component={<Link className="text-sm" href="/cash/remittance" />}>Remesas de efectivo </MenuItem>)}
          {showIten("cash-accounts", <MenuItem component={<Link className="text-sm" href="/cash/accounts" />}>Cuentas Bancarias </MenuItem>)}
          {showIten("cash-inout", <MenuItem component={<Link className="text-sm" href="/cash/inout" />}>Flujo de Efectivo </MenuItem>)}
          {showIten("cash-history", <MenuItem component={<Link className="text-sm" href="/cash/history" />}>Historial de transferencias </MenuItem>)}
        </SubMenu>
        }

        { hasAnyPermission(["credits-receivable", "credits-payable"]) && 
        <SubMenu label="Cuentas" icon={<TbBrandCashapp />}>
          {showIten("credits-receivable", <MenuItem component={<Link className="text-sm" href="/credits/receivable" />}>Cuentas por cobrar </MenuItem>)}
          {showIten("credits-payable", <MenuItem component={<Link className="text-sm" href="/credits/payable" />}>Cuentas por pagar </MenuItem>)}
        </SubMenu>
        }

        { hasAnyPermission(["directory"]) && 
        <SubMenu label="Directorio" icon={<FaAddressBook />}>
        {showIten("directory", <MenuItem component={<Link className="text-sm" href="/directory" />}>Contactos </MenuItem>)}
        {showIten("directory", <MenuItem component={<Link className="text-sm" href="/directory/client" />}>Clientes </MenuItem>)}
        {showIten("directory", <MenuItem component={<Link className="text-sm" href="/directory/employee" />}>Repartidores </MenuItem>)}
        {showIten("directory", <MenuItem component={<Link className="text-sm" href="/directory/provider" />}>Proveedores </MenuItem>)}
        {showIten("directory", <MenuItem component={<Link className="text-sm" href="/directory/referred" />}>Referidos </MenuItem>)}
        </SubMenu>
        }

        { hasAnyPermission(["histories-sales", "histories-bills", "histories-remittance","histories-cut","histories-discount","histories-list","histories-by-user","histories-by-client","histories-deleted","histories-cost","histories-shipping-notes","histories-payments","histories-commission-pay"]) && 
        <SubMenu label="Historiales" icon={<FaHistory />}>
        {showIten("histories-sales", <MenuItem component={<Link className="text-sm" href="/histories/sales" />}>Ventas  </MenuItem>)}
        {showIten("histories-bills", <MenuItem component={<Link className="text-sm" href="/histories/bills" />}>Gastos  </MenuItem>)}
        {showIten("histories-remittance", <MenuItem component={<Link className="text-sm" href="/histories/remittance" />}>Remesas  </MenuItem>)}
        {showIten("histories-cut", <MenuItem component={<Link className="text-sm" href="/histories/cut" />}>Cortes de caja  </MenuItem>)}
        {showIten("histories-discount", <MenuItem component={<Link className="text-sm" href="/histories/discount" />}>Ventas con descuento  </MenuItem>)}
        {showIten("histories-list", <MenuItem component={<Link className="text-sm" href="/histories/list" />}>Listado de ventas  </MenuItem>)}
        {showIten("histories-by-user", <MenuItem component={<Link className="text-sm" href="/histories/by-user" />}>Ventas por usuario  </MenuItem>)}
        {showIten("histories-by-client", <MenuItem component={<Link className="text-sm" href="/histories/by-client" />}>Ventas por cliente  </MenuItem>)}
        {showIten("histories-by-client", <MenuItem component={<Link className="text-sm" href="/histories/by-product" />}>Ventas por producto  </MenuItem>)}
        {showIten("histories-deleted", <MenuItem component={<Link className="text-sm" href="/histories/deleted" />}>Ordenes eliminadas  </MenuItem>)}
        {showIten("histories-cost", <MenuItem component={<Link className="text-sm" href="/histories/cost" />}>Listado de costos  </MenuItem>)}
        {showIten("histories-shipping-notes", <MenuItem component={<Link className="text-sm" href="/histories/shipping-notes" />}>Notas de envío  </MenuItem>)}
        {showIten("histories-payments", <MenuItem component={<Link className="text-sm" href="/histories/payments" />}>Abonos recibidos  </MenuItem>)}
        {showIten("histories-commission-pay", <MenuItem component={<Link className="text-sm" href="/histories/commission-pay" />}>Comisiones pagadas  </MenuItem>)}
        </SubMenu>
        }

        { hasAnyPermission(["tools-quotes","tools-commissions","tools-adjustment"]) && 
        <SubMenu label="Herramientas" icon={<HiOutlineChartSquareBar />}>
        {showIten("tools-quotes", <MenuItem component={<Link className="text-sm" href="/tools/quotes" />}>Cotizaciones </MenuItem>)}
        {showIten("tools-commissions", <MenuItem component={<Link className="text-sm" href="/tools/commissions" />}>Detalle Comisiones </MenuItem>)}
        <MenuItem component={<Link className="text-sm" href="/tools/commissions/gold" />}>Puntos de Oro </MenuItem>
        {showIten("tools-adjustment", <MenuItem component={<Link className="text-sm" href="/tools/adjustment" />}>Ajustar inventario </MenuItem>)}
        </SubMenu>
        }

        { hasAnyPermission(["reports-sales","reports-bills","reports-products"]) && 
        <SubMenu label="Reportes" icon={<HiOutlineChartSquareBar />}>
        {showIten("reports-sales", <MenuItem component={<Link className="text-sm" href="/reports/sales" />}>Detalles de ventas </MenuItem>)}
        {showIten("reports-bills", <MenuItem component={<Link className="text-sm" href="/reports/bills" />}>Detalles de gastos </MenuItem>)}
        {showIten("reports-products", <MenuItem component={<Link className="text-sm" href="/reports/products" />}>Productos ingresados </MenuItem>)}
        {showIten("reports-products", <MenuItem component={<Link className="text-sm" href="/reports/by-lot" />}>Productos por lote </MenuItem>)}
        {showIten("reports-products", <MenuItem component={<Link className="text-sm" href="/reports/failures" />}>Productos Averiados </MenuItem>)}
        </SubMenu>
        }

        { hasAnyPermission(["invoices-documents","invoices-correlative","invoices-electronic","invoices-search"]) && 
        <SubMenu label="Facturación" icon={<HiOutlineChartSquareBar />}>
        {showIten("invoices-documents", <MenuItem component={<Link className="text-sm" href="/invoices/documents" />}>Documentos Emitidos </MenuItem>)}
        {showIten("invoices-correlative", <MenuItem component={<Link className="text-sm" href="/invoices/correlative" />}>Correlativo de Documentos </MenuItem>)}
        { systemInformation?.system?.country == 1 &&
        showIten("invoices-electronic", <MenuItem component={<Link className="text-sm" href="/invoices/electronic" />}>Documentos Electrónicos </MenuItem>)
        }
        { systemInformation?.system?.country == 1 &&
        showIten("invoices-electronic", <MenuItem component={<Link className="text-sm" href="/invoices/e-rejected" />}>Documentos Rechazados </MenuItem>)
        }
        { systemInformation?.system?.country == 3 &&
        showIten("invoices-electronic", <MenuItem component={<Link className="text-sm" href="/invoices/electronic-gt" />}>Documentos Electrónicos </MenuItem>)
        }
        {showIten("invoices-search", <MenuItem component={<Link className="text-sm" href="/invoices/search" />}>Buscar Documentos </MenuItem>)}
        </SubMenu>
        }

        { hasAnyPermission(["transfers-send","transfers-receive","transfers-request","histories-transfers"]) && 
        <SubMenu label="Transferencias" icon={<HiOutlineChartSquareBar />}>
        {showIten("transfers-send", <MenuItem component={<Link className="text-sm" href="/transfers/send" />}>Crear Transferencia </MenuItem>)}
        {showIten("transfers-receive", <MenuItem component={<Link className="text-sm" href="/transfers/receive" />}>Aceptar Transferencia </MenuItem>)}
        {showIten("transfers-request", <MenuItem component={<Link className="text-sm" href="/transfers/request" />}>Solicitar Transferencia </MenuItem>)}
        {showIten("histories-transfers", <MenuItem component={<Link className="text-sm" href="/histories/transfers" />}>Listado de Transferencias </MenuItem>)}
        </SubMenu>
        }

        { hasAnyPermission(["config","config-products","config-user","config-permissions","config-transfers"]) && 
        <SubMenu label="Configuraciones" icon={<HiOutlineChartSquareBar />}>
        {showIten("config", <MenuItem component={<Link className="text-sm" href="/config" />}>Principal</MenuItem>)}
        {showIten("config-products", <MenuItem component={<Link className="text-sm" href="/config/product" />}>Productos</MenuItem>)}
        {showIten("config-user", <MenuItem component={<Link className="text-sm" href="/config/user" />}>Usuarios</MenuItem>)}
        {showIten("config-permissions", <MenuItem component={<Link className="text-sm" href="/config/permissions" />}>Permisos de Usuario</MenuItem>)}
        {showIten("config-transfers", <MenuItem component={<Link className="text-sm" href="/config/transfers" />}>Sucursales</MenuItem>)}
        <MenuItem component={<Link className="text-sm" href="/config/invoices" />}>Pagos</MenuItem>
        </SubMenu>
        }
        <MenuItem icon={<HiLogout />} href="/logout">Salir</MenuItem>
      </Menu>
    </Sidebar>
  );
}
