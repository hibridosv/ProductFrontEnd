'use client'
import React, { useContext, useEffect, useState } from "react";
import { Product, Products as ProductsInterface } from "../../services/products";
import { NothingHere } from "../nothing-here/nothing-here";
import { IoMdOptions } from "react-icons/io";
import {  GrClose, GrUpdate } from "react-icons/gr";
import { MdOutlineHomeRepairService } from "react-icons/md"
import { FaLayerGroup } from "react-icons/fa"
import { Dropdown } from "flowbite-react";
import { DeleteModal, ProductViewModal } from "..";
import { numberToMoney, permissionExists } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";
import { RowTable } from "./products-table";


interface ProductsAllTableProps {
  products?: ProductsInterface | any;
  onDelete: (id: number) => void;
  updatePrice: (cod: string) => void;
  withOutRows?: RowTable[];
  handleSortBy?: (sort: string) => void;
}

export function ProductsAllTable(props: ProductsAllTableProps) {
  const { products, onDelete, withOutRows, updatePrice, handleSortBy } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canTransfer, setCanTransfer] = useState(false);
  const [selectProduct, setSelectProduct] = useState<Product>({} as Product);
  const { systemInformation } = useContext(ConfigContext);
  const [sortPreview, setSortPreview] = useState("-cod");

  
  useEffect(() => {
    setCanDelete( permissionExists(systemInformation?.permission, 'product-delete'));
    setCanEdit( permissionExists(systemInformation?.permission, 'product-edit'));
    setCanTransfer( permissionExists(systemInformation?.permission, 'config-transfers'));
    // eslint-disable-next-line
  }, [systemInformation]);

  
  if (!products.data) return <NothingHere width="164" height="98" />;
  if (products.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  const sortBySelected = (sort: string) => {
    if (handleSortBy) {
      if (sortPreview.slice(0, 1) != "-") {
        sort = "-" + sort;
      }
      setSortPreview(sort);
      handleSortBy(sort);
    }
  }

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
      { !withOutRows?.includes(RowTable.cod) && <td className="py-3 px-6 whitespace-nowrap">{product.cod}</td>}
      { !withOutRows?.includes(RowTable.description) && <th className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer flex justify-items-start" scope="row" onClick={()=>showProduct(product)}>
      
        {productTypeIcon(product.product_type)}
             
      <span>
        {product.description}
      </span>
        </th>}
      { !withOutRows?.includes(RowTable.prices) && <td className="py-3 px-6">{product.prices[0] ? numberToMoney(product.prices[0].price, systemInformation) : numberToMoney(0, systemInformation)}</td>}
      { !withOutRows?.includes(RowTable.quantity) && <td className="py-3 px-6">{product.quantity}</td>}
      { !withOutRows?.includes(RowTable.category) && <td className="py-3 px-6 whitespace-nowrap">{product.category.name}</td>}
      { !withOutRows?.includes(RowTable.brand) && <td className="py-3 px-6">{product?.brand?.name}</td>}
      { !withOutRows?.includes(RowTable.location) && <td className="py-3 px-6">{product?.location?.name}</td>}
      { !withOutRows?.includes(RowTable.minimum_stock) && <td className="py-3 px-6">{product.minimum_stock}</td>}
      { !withOutRows?.includes(RowTable.options) && <td className="py-3 px-6">
        <Dropdown label={<IoMdOptions size="1.2em" />} inline={true} dismissOnClick={true}>
          <Dropdown.Item onClick={()=>showProduct(product)}>VER PRODUCTO</Dropdown.Item>
          {/* <Dropdown.Item icon={GrEdit}><Link href={`/product/edit/${product.id}`}>Editar</Link></Dropdown.Item>
          <Dropdown.Item icon={GrAction}><Link href={`/product/kardex/${product.id}`}>Kardex</Link></Dropdown.Item> */}
          { canTransfer && <Dropdown.Item icon={GrUpdate} onClick={()=>updatePrice(product.cod)}>Actualizar Precios</Dropdown.Item> }
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
          { !withOutRows?.includes(RowTable.cod) && <th scope="col" className="py-3 px-4 clickeable" onClick={()=>sortBySelected("cod")}>Cod</th>}
          { !withOutRows?.includes(RowTable.description) && <th scope="col" className="py-3 px-4 clickeable" onClick={()=>sortBySelected("description")}>Producto</th>}
          { !withOutRows?.includes(RowTable.prices) && <th scope="col" className="py-3 px-4">Precio</th>}
          { !withOutRows?.includes(RowTable.quantity) && <th scope="col" className="py-3 px-4 clickeable" onClick={()=>sortBySelected("quantity")}>Cantidad</th>}
          { !withOutRows?.includes(RowTable.category) && <th scope="col" className="py-3 px-4 clickeable" onClick={()=>sortBySelected("category_id")}>Categoria</th>}
          { !withOutRows?.includes(RowTable.brand) && <th scope="col" className="py-3 px-4 clickeable" onClick={()=>sortBySelected("brand_id")}>Marca</th>}
          { !withOutRows?.includes(RowTable.location) && <th scope="col" className="py-3 px-4 clickeable" onClick={()=>sortBySelected("location_id")}>Ubicación</th>}
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
