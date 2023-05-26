"use client";

export const FieldsFormProduct = [
  {
    id: "product_type",
    type: "select",
    name: "Tipo de Registro",
    style: "full",
    values: [
      { id: 1, name: "Producto", isSelected: true },
      { id: 2, name: "Servicio", isSelected: false },
      { id: 3, name: "Compuesto", isSelected: false },
    ],
  },
  {
    id: "cod",
    type: "text",
    name: "Código",
    style: "full",
  },
  {
    id: "description",
    type: "text",
    name: "Descripción",
    style: "full",
  },
  {
    id: "quantity",
    type: "number",
    name: "Cantidad",
    style: "medio",
  },
  {
    id: "minimum_stock",
    type: "number",
    name: "Stock Minimo",
    style: "medio",
  },
  {
    id: "category_id",
    type: "select",
    name: "Categoria",
    style: "medio",
    values: [],
  },
  {
    id: "quantity_unit_id",
    type: "select",
    name: "Unidad de Medida",
    style: "medio",
    values: [],
  },
  {
    id: "provider_id",
    type: "select",
    name: "Proveedor",
    style: "medio",
    values: [],
  },
  {
    id: "brand_id",
    type: "select",
    name: "Marca",
    style: "medio",
    values: [],
  },
  {
    id: "measure",
    type: "text",
    name: "Medida",
    style: "medio",
  },
  {
    id: "cost_price",
    type: "number",
    name: "Precio de Costo",
    style: "medio",
  },
  {
    id: "sale_price",
    type: "number",
    name: "Precio de Venta",
    style: "medio",
  },
];