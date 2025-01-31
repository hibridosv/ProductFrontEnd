import Link from "next/link";


export interface ExpiresInvoiceProps {
  isShow: boolean;
  expiresDays: number;
}

export function ExpiresInvoice(props: ExpiresInvoiceProps) {
  const {  isShow, expiresDays } = props;

  if (!isShow) return <></>

  return (
    <div className='m-4 border border-teal-700 rounded-md shadow-md'>
        <div className="m-2">
        Estimado cliente: Tiene <span className=" text-red-700 font-semibold">facturas pendientes de pago con {expiresDays} { expiresDays > 1 ? "dias" : "dia" } de vencido</span>. Por favor, consulte el estado de su cuenta y regularice lo antes posible para evitar inconvenientes.
         <Link className="text-sm button-green rounded-md m-4" href="/config/invoices" >CONSULTAR FACTURAS</Link></div>
    </div>
  );
}
