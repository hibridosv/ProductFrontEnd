'use client'
import { useState } from "react";
import { Product, Products as ProductsInterface } from "../../../services/products";
import { NothingHere } from "../nothing-here/nothing-here";
import { IoMdOptions } from "react-icons/io";
import {  GrClose, GrEdit, GrAction } from "react-icons/gr";
import { Dropdown } from "flowbite-react";
import { DeleteModal, ProductViewModal } from "../../components/";
import Link from "next/link";


interface ProductsTableProps {
  products?: ProductsInterface | any;
  onDelete: (id: number) => void;
}

export function ProductsTable(props: ProductsTableProps) {
  const { products, onDelete } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectProduct, setSelectProduct] = useState<Product>({} as Product);

  if (!products.data) return <NothingHere widht="164" height="98" />;


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



  const listItems = products.data.map((product: any) => (
    <tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
      <td className="py-3 px-6">{product.cod}</td>
      <th className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white" scope="row" >{product.description}</th>
      <td className="py-3 px-6">{product.quantity}</td>
      <td className="py-3 px-6">{product.prices[0] ? product.prices[0].price : "0.00"}</td>
      <td className="py-3 px-6">{product.category.name}</td>
      <td className="py-3 px-6">{product?.brand?.name}</td>
      <td className="py-3 px-6">{product.minimum_stock}</td>
      <td className="py-3 px-6">
        <Dropdown label={<IoMdOptions size="1.2em" />} inline={true} >
          <Dropdown.Item onClick={()=>showProduct(product)}>VER PRODUCTO</Dropdown.Item>
          <Dropdown.Item icon={GrEdit}><Link href={`/product/${product.id}`}>Editar</Link></Dropdown.Item>
          <Dropdown.Item icon={GrAction}><Link href={`/product/kardex/${product.id}`}>Kardex</Link></Dropdown.Item>
          <Dropdown.Item icon={GrClose} onClick={()=>isDeleteProduct(product)}><span className="text-red-700">Eliminar</span></Dropdown.Item>
        </Dropdown>
      </td>
    </tr>
  ));

  return (
  <div className="w-full overflow-auto">
    <table className="text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4">Cod</th>
          <th scope="col" className="py-3 px-4">Producto</th>
          <th scope="col" className="py-3 px-4">Cantidad</th>
          <th scope="col" className="py-3 px-4">Precio</th>
          <th scope="col" className="py-3 px-4">Categoria</th>
          <th scope="col" className="py-3 px-4">Marca</th>
          <th scope="col" className="py-3 px-4">Minimo</th>
          <th scope="col" className="py-3 px-4">Opciones</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
    { showDeleteModal && 
          <DeleteModal 
          text="¿Estas seguro de eliminar este producto?"
          onDelete={handleDeleteProduct} 
          onClose={()=>setShowDeleteModal(false)} /> }

    { showProductDetail && 
          <ProductViewModal 
          onClose={()=>setShowProductDetail(false)} 
          product={selectProduct}
          /> }
 </div>
 );
}
