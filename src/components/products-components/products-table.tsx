'use client'
import React, { useContext, useEffect, useState } from "react";
import { Product, Products as ProductsInterface } from "../../services/products";
import { NothingHere } from "../nothing-here/nothing-here";
import { IoMdOptions } from "react-icons/io";
import {  GrClose } from "react-icons/gr";
import { MdOutlineHomeRepairService } from "react-icons/md"
import { FaLayerGroup } from "react-icons/fa"
import { Dropdown } from "flowbite-react";
import { DeleteModal, ProductViewModal } from "..";
import { numberToMoney, permissionExists } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";

export enum RowTable {
  cod = "cod",
  description = "description",
  quantity = "quantity",
  prices = "prices",
  category = "category",
  brand = "brand",
  minimum_stock = "minimum_stock",
  options = "options"
}

interface ProductsTableProps {
  products?: ProductsInterface | any;
  onDelete: (id: number) => void;
  withOutRows?: RowTable[];
}

export function ProductsTable(props: ProductsTableProps) {
  const { products, onDelete, withOutRows } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [selectProduct, setSelectProduct] = useState<Product>({} as Product);
  const { systemInformation } = useContext(ConfigContext);

  useEffect(() => {
    setCanDelete( permissionExists(systemInformation?.permission, 'product-delete'));
    setCanEdit( permissionExists(systemInformation?.permission, 'product-edit'));
    // eslint-disable-next-line
  }, [systemInformation]);

  if (!products.data) return <NothingHere width="164" height="98" />;
  if (products.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;


  const isDeleteProduct = (product:Product) => {
    setSelectProduct(product);
    setShowDeleteModal(true);
  }

  const showProduct = (product:Product) => {
    setSelectProduct(product);
    setShowProductDetail(true);
  }
  const handleDeleteProduct = () => {
    onDelete(selectProduct.id);
    setShowDeleteModal(false);
    setSelectProduct({} as Product);
  }

  const productTypeIcon = (type: number)=>{
    switch (type) {
      case 2: return <span className="mr-2"><MdOutlineHomeRepairService size={12} color="blue" /></span>
      case 3: return <span className="mr-2"><FaLayerGroup size={10} color="green" /></span> 
    }
  }


  const listItems = products.data.map((product: any) => (
    <tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
      { !withOutRows?.includes(RowTable.cod) && <td className="py-3 px-6">{product.cod}</td>}
      { !withOutRows?.includes(RowTable.description) && <th className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer flex justify-items-start" scope="row" onClick={()=>showProduct(product)}>
      
        {productTypeIcon(product.product_type)}
             
      <span>
        {product.description}
      </span>
        </th>}
      { !withOutRows?.includes(RowTable.prices) && <td className="py-3 px-6">{product.prices[0] ? numberToMoney(product.prices[0].price) : numberToMoney(0)}</td>}
      { !withOutRows?.includes(RowTable.quantity) && <td className="py-3 px-6">{product.quantity}</td>}
      { !withOutRows?.includes(RowTable.category) && <td className="py-3 px-6">{product.category.name}</td>}
      { !withOutRows?.includes(RowTable.brand) && <td className="py-3 px-6">{product?.brand?.name}</td>}
      { !withOutRows?.includes(RowTable.minimum_stock) && <td className="py-3 px-6">{product.minimum_stock}</td>}
      { !withOutRows?.includes(RowTable.options) && <td className="py-3 px-6">
        <Dropdown label={<IoMdOptions size="1.2em" />} inline={true} dismissOnClick={true}>
          <Dropdown.Item onClick={()=>showProduct(product)}>VER PRODUCTO</Dropdown.Item>
          {/* <Dropdown.Item icon={GrEdit}><Link href={`/product/edit/${product.id}`}>Editar</Link></Dropdown.Item>
          <Dropdown.Item icon={GrAction}><Link href={`/product/kardex/${product.id}`}>Kardex</Link></Dropdown.Item> */}
          { canDelete && <Dropdown.Item icon={GrClose} onClick={()=>isDeleteProduct(product)}><span className="text-red-700">Eliminar</span></Dropdown.Item> }
        </Dropdown>
      </td>}

    </tr>
  ));


  return (
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          { !withOutRows?.includes(RowTable.cod) && <th scope="col" className="py-3 px-4">Cod</th>}
          { !withOutRows?.includes(RowTable.description) && <th scope="col" className="py-3 px-4">Producto</th>}
          { !withOutRows?.includes(RowTable.prices) && <th scope="col" className="py-3 px-4">Precio</th>}
          { !withOutRows?.includes(RowTable.quantity) && <th scope="col" className="py-3 px-4">Cantidad</th>}
          { !withOutRows?.includes(RowTable.category) && <th scope="col" className="py-3 px-4">Categoria</th>}
          { !withOutRows?.includes(RowTable.brand) && <th scope="col" className="py-3 px-4">Marca</th>}
          { !withOutRows?.includes(RowTable.minimum_stock) && <th scope="col" className="py-3 px-4">Minimo</th>}
          { !withOutRows?.includes(RowTable.options) && <th scope="col" className="py-3 px-4">Opciones</th>}
          
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>

          <DeleteModal isShow={showDeleteModal}
          text="¿Estas seguro de eliminar este producto?"
          onDelete={handleDeleteProduct} 
          onClose={()=>setShowDeleteModal(false)} /> 

   
          <ProductViewModal 
          onClose={()=>setShowProductDetail(false)} 
          product={selectProduct}
          editable={canEdit}
          isShow={showProductDetail}
          /> 
 </div>
 );
}
