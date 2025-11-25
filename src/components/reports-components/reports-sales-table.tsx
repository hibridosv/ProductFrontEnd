'use client'
import { getTotalOfItem, numberToMoney, percentage, sumarTotales } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDateAsDMY } from "@/utils/date-formats";
import { ConfigContext } from "@/contexts/config-context";
import { useContext } from "react";

interface ReportsSalesTableProps {
  records?: any;
  isLoading?: boolean;
}

export function ReportsSalesTable(props: ReportsSalesTableProps) {
  const { records, isLoading } = props;
  const { systemInformation } = useContext(ConfigContext);

  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length === 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  let totalSale = 0;
  let totalCost = 0;

  const listItems = records.data.map((record: any, key: any) => {
    const priceWithoutBill = record?.subtotal / record?.quantity;
    const totalUnitPrice = priceWithoutBill * record?.quantity;
    const totalUnitCost = record?.unit_cost * record?.quantity;

    totalSale += totalUnitPrice;
    totalCost += totalUnitCost;

    return (
      <tr key={key} className={`border-b`}>
        <td className="py-2 px-6 truncate">{formatDateAsDMY(record?.updated_at)}</td>
        <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{record?.product}</th>
        <td className="py-2 px-6">{record?.cod}</td>
        <td className="py-2 px-6">{record?.quantity}</td>
        <td className="py-2 px-6">{numberToMoney(record?.unit_cost || 0, systemInformation)}</td>
        <td className="py-2 px-6">{numberToMoney(totalUnitCost, systemInformation)}</td>
        <td className="py-2 px-6" title={numberToMoney(priceWithoutBill, systemInformation)}>{numberToMoney(record?.unit_price || 0, systemInformation)}</td>
        <td className="py-2 px-6" title={numberToMoney(totalUnitPrice, systemInformation)}>{numberToMoney(record?.unit_price ? record?.unit_price * record?.quantity : 0, systemInformation)}</td>
        <td className="py-2 px-6">{record?.discount_percentage || 0} %</td>
        <td className="py-2 px-6">{numberToMoney(record?.discount || 0, systemInformation)}</td>
        <td className="py-2 px-6">{numberToMoney(record?.total || 0, systemInformation)}</td>
        <td className="py-2 px-6 whitespace-nowrap">{numberToMoney(totalUnitPrice - totalUnitCost, systemInformation)}</td>
        <td className="py-2 px-6 whitespace-nowrap">{percentage(totalUnitCost, totalUnitPrice).toFixed(2)} %</td>
      </tr>
    );
  });

  const totalMargin = totalSale - totalCost;
  const marginPercentage = totalSale > 0 ? percentage(totalCost, totalSale).toFixed(2) : '0.00';

  return (
    <div>
      <div className="w-full overflow-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-4 border">Fecha</th>
              <th scope="col" className="py-3 px-4 border">Producto</th>
              <th scope="col" className="py-3 px-4 border">Codigo</th>
              <th scope="col" className="py-3 px-4 border">Cantidad</th>
              <th scope="col" className="py-3 px-4 border">Costo U</th>
              <th scope="col" className="py-3 px-4 border">Costo T</th>
              <th scope="col" className="py-3 px-4 border" title="Precio Unitario con Impuestos">Precio U</th>
              <th scope="col" className="py-3 px-4 border" title="Total Precio Unitario con Impuestos">Precio T</th>
              <th scope="col" className="py-3 px-4 border whitespace-nowrap">Descuento %</th>
              <th scope="col" className="py-3 px-4 border">Monto</th>
              <th scope="col" className="py-3 px-4 border" title="Total Venta con Impuestos">Total</th>
              <th scope="col" className="py-3 px-4 border whitespace-nowrap" title="Margen Bruto">Margen $</th>
              <th scope="col" className="py-3 px-4 border whitespace-nowrap" title="Porcentaje de Margen Bruto">Margen %</th>
            </tr>
          </thead>
          <tbody>{listItems}</tbody>
        </table>
      </div>

      <div className="uppercase shadow-lg border-x-2 mx-4 mt-8 mb-4 p-4 bg-white rounded-lg">
        <div>Subtotal: <span className="font-semibold">{numberToMoney(getTotalOfItem(records?.data, "subtotal"), systemInformation)}</span></div>
        <div>Impuestos: <span className="font-semibold">{numberToMoney(getTotalOfItem(records?.data, "taxes"), systemInformation)}</span></div>
        <div>Ventas: <span className="font-semibold">{numberToMoney(sumarTotales(records?.data), systemInformation)}</span></div>
        <div>Margen: <span className="font-semibold">{numberToMoney(totalMargin, systemInformation)}</span></div>
        <div>Margen: <span className="font-semibold">{marginPercentage} %</span></div>
      </div>
    </div>
  );
}
