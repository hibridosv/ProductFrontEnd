'use client'
import { useState } from "react";
import { numberToMoney } from "@/utils/functions";
import { Badge } from 'flowbite-react';
import { NothingHere } from "../nothing-here/nothing-here";
import { formatDateAsDMY } from "@/utils/date-formats";
import { Product } from "@/services/products";
import { ProductViewModal } from "../modals/product-view-modal";

interface ProductExpirationTableProps {
  records?:  any;
}

export function ProductExpirationTable(props: ProductExpirationTableProps) {
  const { records } = props;
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectProduct, setSelectProduct] = useState<Product>({} as Product);


  if (!records.data) return <NothingHere widht="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" widht="164" height="98" />;

  const showProduct = (product:Product) => {
    setSelectProduct(product);
    setShowProductDetail(true);
  }

  const status = (expiration: string) => {
    if (new Date(expiration) <= new Date()) {
        return <Badge color="failure">Expirado</Badge>
    }
    return <Badge color="success">Por Expirar</Badge>
  }


  const listItems = records.data.map((record: any) => (
    <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
      <td className="py-3 px-6">{ record.product.cod }</td>
      <th className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer" scope="row" onClick={()=>showProduct(record.product)}>{ record.product.description }</th>
      <td className="py-3 px-6">{ record.actual_stock }</td>
      <td className="py-3 px-6">{ numberToMoney(record.cost_price ? record.cost_price : 0) }</td>
      <td className="py-3 px-6 truncate">{ formatDateAsDMY(record.expiration) }</td>
      <td className="py-3 px-6 truncate">{ status(record.expiration) }</td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Código</th>
          <th scope="col" className="py-3 px-4 border">Producto</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Precio Costo</th>
          <th scope="col" className="py-3 px-4 border">Expiración</th>
          <th scope="col" className="py-3 px-4 border">Estado</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 { showProductDetail && <ProductViewModal product={selectProduct} onClose={()=>setShowProductDetail(false)}  />}
 </div>);
}
