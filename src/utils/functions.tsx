import { Configuration } from "@/services/config";
import { DocumentTypes, DocumentTypesNames, OptionsClickOrder, PaymentType, PaymentTypeNames, TypeOfPrice } from "@/services/enums"
import { getData } from "@/services/resources";
import { formatDateAsNumber } from "./date-formats";


export const loadData = async (url: string) => {
  try {
    const response = await getData(url);
    return response;
  } catch (error) {
    console.error(error);
  } 
};


export const numberToMoney = (number: number, systemInformation = null as any): string => {
    let num = number ? number : 0;
    let symbol =  systemInformation ? getCountryProperty(parseInt(systemInformation?.system?.country)).currency : '$';
    return `${symbol}${num.toFixed(2)}`
}

export const getConfigStatus = (feature: string, config: any)=>{
    if (config?.configurations) {
     return config.configurations.find((configuration: any) => configuration.feature === feature)?.active === 1
    }
    return false
  }

export const fieldWidth = (field: string): string => {
    switch (field) {
      case "full": return "w-full px-3 mb-2"
      case "medio": return "w-full md:w-1/2 px-3 mb-2"
      case "tercio": return "w-full md:w-1/3 px-3 mb-2"
      default: return "w-full md:w-1/2 px-3 mb-2"
    }
}

// Transforma los campos del formulario de producto agregando los valores de las categorias, unidades de medida, proveedores y marcas
export const transformFields = (Fields: any, specialData: any): any => {
  const FieldsFormProduct = [...Fields];
  const categorys = specialData.categories;
  const quantityUnits = specialData.quantityUnits;
  const providers = specialData.providers;
  const brands = specialData.brands;

  const categoriesData = Array.isArray(categorys) ? categorys : [];
  const categoryValues = categoriesData.map((category) => ({
    id: category.id,
    name: category.name,
    isSelected: category.name === "Principal",
  }));

  const categoryField = Array.isArray(FieldsFormProduct)
    ? FieldsFormProduct.find((field) => field.id === "category_id")
    : null;

  if (categoryField) {
    categoryField.values = categoryValues;
  }

  const quantityUnitField = Array.isArray(FieldsFormProduct)
    ? FieldsFormProduct.find((field) => field.id === "quantity_unit_id")
    : null;

  if (quantityUnitField) {
    quantityUnitField.values = Array.isArray(quantityUnits)
      ? quantityUnits.map((unit) => ({
          id: unit.id,
          name: unit.name,
          isSelected: false,
        }))
      : [];
  }

  const providerField = Array.isArray(FieldsFormProduct)
    ? FieldsFormProduct.find((field) => field.id === "provider_id")
    : null;

  if (providerField) {
    providerField.values = Array.isArray(providers)
      ? providers.map((provider) => ({
          id: provider.id,
          name: provider.name,
          isSelected: false,
        }))
      : [];
  }

  const BrandField = Array.isArray(FieldsFormProduct)
    ? FieldsFormProduct.find((field) => field.id === "brand_id")
    : null;

  if (BrandField) {
    BrandField.values = Array.isArray(brands)
      ? brands.map((brand) => ({
          id: brand.id,
          name: brand.name,
          isSelected: false,
        }))
      : [];
  }
  return FieldsFormProduct;
}

export const sumarSubtotal = (datos: any): number => {
  let totalSuma = 0;

  datos?.forEach((elemento: any) => {
    if (elemento.hasOwnProperty('subtotal')) {
      totalSuma += elemento.subtotal;
    }
  });

  return totalSuma;
}

/**
 * Lo mismo que sumar totales pero retorna un numero
 * @param datos 
 * @returns 
 */
export const sumarCantidad = (datos: any): number => {
  let totalSuma = 0;

  datos?.forEach((elemento: any) => {
    if (elemento.hasOwnProperty('total')) {
      totalSuma += elemento.total;
    }
  });

  return totalSuma;
}

/**
 * suma las cantidades del campo
 * @param datos 
 * @returns 
 */
export const sumarTotales = (datos: any): number => {
  let totalSuma = 0;

  datos?.forEach((elemento: any) => {
    if (elemento.hasOwnProperty('total')) {
      totalSuma += elemento.total;
    }
  });

  return totalSuma;
}


export const sumarDiscount = (datos: any): number => {
  let totalSuma = 0;

  datos?.forEach((elemento: any) => {
    if (elemento.hasOwnProperty('discount')) {
      totalSuma += elemento.discount;
    }
  });

  return totalSuma;
}

export const sumarTotalesWithoutDIscount = (datos: any): number => {
  let totalSuma = 0;
  let totalDiscount = 0;
  let total = 0;

  datos?.forEach((elemento: any) => {
    if (elemento.hasOwnProperty('total')) {
      totalSuma += elemento.total;
    }
    if (elemento.hasOwnProperty('discount')) {
      totalDiscount += elemento.discount;
    }
  });
  total = totalDiscount + totalSuma;

  return total;
}


/**
 * Esta funcion genera un numero random
 * @param max numero maximo
 * @returns numero random
 */
export const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
}



export const setPriceOptions = (priceType: number, pricesActive: number[]): OptionsClickOrder => {
  if (priceType === TypeOfPrice.normal) return pricesActive.includes(TypeOfPrice.wholesaler) ? OptionsClickOrder.wholesalerPrice : pricesActive.includes(TypeOfPrice.promotion) ? OptionsClickOrder.promotionPrice : OptionsClickOrder.normalPrice;

  if (priceType === TypeOfPrice.wholesaler) return pricesActive.includes(TypeOfPrice.promotion) ?  OptionsClickOrder.promotionPrice : pricesActive.includes(TypeOfPrice.normal) ? OptionsClickOrder.normalPrice : OptionsClickOrder.wholesalerPrice;

  if (priceType === TypeOfPrice.promotion) return pricesActive.includes(TypeOfPrice.normal) ?  OptionsClickOrder.normalPrice : pricesActive.includes(TypeOfPrice.wholesaler) ? OptionsClickOrder.wholesalerPrice : OptionsClickOrder.promotionPrice;

  return OptionsClickOrder.normalPrice;
}

export const setPriceName = (priceType: number): string => {
  if (priceType === TypeOfPrice.normal) return "PRECIO NORMAL";
  if (priceType === TypeOfPrice.wholesaler) return "PRECIO MAYORISTA";
  if (priceType === TypeOfPrice.promotion) return "PRECIO PROMOCION";
  return "PRECIO NORMAL";
}


export const documentType = (document: DocumentTypes): string => {
  if (document == DocumentTypes.ninguno) return DocumentTypesNames.ninguno;
  if (document == DocumentTypes.ticket) return DocumentTypesNames.ticket;
  if (document == DocumentTypes.factura) return DocumentTypesNames.factura;
  if (document == DocumentTypes.creditoFiscal) return DocumentTypesNames.creditoFiscal;
  return DocumentTypesNames.ninguno;
}


/// obtengo el nombre del tipo de pago 
export const getPaymentTypeName = (type: PaymentType): string | undefined => {
  const typeName = Object.entries(PaymentType)
    .filter(([key, value]) => typeof value === 'number' && value === type)
    .map(([key]) => key)
    .pop();

  return typeName ? (PaymentTypeNames as Record<string, string>)[typeName] : undefined;
};


/// suma una item de un arreglo
export const getTotalOfItem = (datos: any, item: string): any => {
  let totalSuma = 0;

  datos?.forEach((elemento: any) => {
    if (elemento.hasOwnProperty(item)) {
      totalSuma += elemento[item];
    }
  });

  return totalSuma;
}



// obtiene el ultimo elemento de un arreglo
export const getLastElement = (items: any)=> {
  const elementsWithStatus1 = items.filter((element:any) => element.status === 1);

  if (elementsWithStatus1 && elementsWithStatus1.length > 0) {
      const lastElementWithStatus1 = elementsWithStatus1[elementsWithStatus1.length - 1];
      return lastElementWithStatus1;
  } else {
      return null;
  }
}

// obtiene el primer elemento de un arreglo
export const getFirstElement = (items: any)=> {
  const elementsWithStatus1 = items.filter((element: any) => element.status === 1);

  if (elementsWithStatus1 && elementsWithStatus1.length > 0) {
      const firstElementWithStatus1 = elementsWithStatus1[0];
      return firstElementWithStatus1;
  } else {
      return null;
  }
}


// porcentaje de ganancias segun el precio costo y precio de venta de un producto
export const percentage = (totalCost: number, totalPrice: number): number =>{
  return ((totalPrice - totalCost) / totalCost) * 100;
}

// calcula el valor segun porcentaje
export const getTotalPercentage = (porcentaje: number, total: number ) :number => {
  return (porcentaje / 100) * total;
}


export const  successSound = () => {
  const audio = new Audio('/sounds/success.mp3');
  audio.play();
}

export const  errorSound = () => {
  const audio = new Audio('/sounds/error.mp3');
  audio.play();
}



/**
 * Extrae de config las carateristicas activadas
 * @param configurations 
 * @returns 
 */

export const extractActiveFeature = (configurations: Configuration[]): string[] => {
  const activeFeatures: string[] = [];
  configurations.forEach(config => {
    if (config.active === 1) {
      activeFeatures.push(config.feature);
    }
  });
  return activeFeatures;
};



export const getDepartmentNameById = (id: string, data: any): any => {
  if(!data?.departamentos) return; 
  const department = data?.departamentos.find((dept: any) => dept.id === id);
  if (department) {
    return department?.nombre;
  }
};

export const getMunicipioNameById = (id_mun: string, data: any): any => {
  if(!data?.departamentos) return; 
  for (const departamento of data?.departamentos) {
    const municipio = departamento?.municipios.find((mun: any) => mun.id_mun === id_mun);
    if (municipio) {
      return municipio?.nombre;
    }
  }
};


export function formatDocument(cadena: string) {
  if (!cadena) return;
  return cadena.replace(/-/g, '');
}

export function formatDuiWithAll(cadena: string) {
  if(!cadena) return; 
  var doc = cadena.replace(/-/g, '');
  if (doc.length == 14) {
        var partes = [
          doc.slice(0, 4),   // Primer grupo de 4 dígitos
          doc.slice(4, 10),  // Segundo grupo de 6 dígitos
          doc.slice(10, 13), // Tercer grupo de 3 dígitos
          doc.slice(13)      // Último dígito
      ];
    return partes.join('-');
  } else {
    var posicion = doc.length - 1;
    return doc.slice(0, posicion) + '-' + doc.slice(posicion);
  }

}



export const permissionExists = (permissions: any, permission: string) => {
  if(!permissions) return; 
  return permissions.some((perm: any) => perm.name === permission);
};


export const getCountryProperty = (country: number): { name: string, subname: string, currency: string, currencyName: string, document: string } => {
  switch (country) {
    case 1: return {"name": "El Salvador", "subname": "SV", "currency": "$", "currencyName": "Dolares", "document": "NIT"};
    case 2: return {"name": "Honduras", "subname": "HN", "currency": "L", "currencyName": "Lempiras", "document": "RTN"};
    case 3: return {"name": "Guatemala", "subname": "GT", "currency": "Q", "currencyName": "Quetzales", "document": "NIT"};
    default: return {"name": "El Salvador", "subname": "SV", "currency": "$", "currencyName": "Dolares", "document": "NIT"};
  }
}


export const dateToNumberValidate = () =>{
  const fecha = new Date();
  const hoy = fecha.toISOString();
  return formatDateAsNumber(hoy)
}


export function getModalSize(imagesFiltered: any) {
  const count = imagesFiltered.length;
  if (count <= 3) return 'sm';
  if (count >= 4 && count <= 6) return 'md';
  if (count >= 7 && count <= 12) return 'xl';
  if (count >= 16 && count <= 20) return '2xl';
  if (count >= 21 && count <= 35) return '4xl';
  if (count >= 36 && count <= 40) return '6xl';
  // Si hay más de 45 elementos, devolvemos el tamaño más grande '7xl'
  return '7xl';
}


// agrupa los productos de restaurante para no mostrarlos individuales
 export function groupInvoiceProductsByCod(invoice: any) {
  const groupedProducts = {} as any;

  invoice.invoiceproducts.forEach((product : any) => {
      const { cod, quantity, subtotal, total } = product;

      if (!groupedProducts[cod]) {
          groupedProducts[cod] = { ...product };
      } else {
          groupedProducts[cod].quantity += quantity;
          groupedProducts[cod].subtotal += subtotal;
          groupedProducts[cod].total += total;
      }
  });

  // Convertir el objeto en un array de productos
  invoice.invoiceproductsGroup = Object.values(groupedProducts);
  invoice.invoiceproductsGroup.sort((a: any, b: any) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
);
  return invoice;
}

//// contar cuantos productos estan en cero de imprimir
export function countSendPrintZero(invoice: any) {
  if (!invoice?.invoiceproducts) return;

  let count = 0;

  invoice.invoiceproducts.forEach((product: any) => {
      if (product.attributes && product.attributes.work_station_id && product.attributes.send_print === 0) {
          count++;
      }
  });

  return count;
}