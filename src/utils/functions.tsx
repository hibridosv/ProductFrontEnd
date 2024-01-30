import { Configuration } from "@/services/config";
import { DocumentTypes, DocumentTypesNames, OptionsClickOrder, PaymentType, PaymentTypeNames, TypeOfPrice } from "@/services/enums"
import { getData } from "@/services/resources";


export const loadData = async (url: string) => {
  try {
    const response = await getData(url);
    return response;
  } catch (error) {
    console.error(error);
  } 
};


export const numberToMoney = (number: number): string => {
    let num = number ? number : 0;
    return `$${num.toFixed(2)}`
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



export const sumarTotales = (datos: any): string => {
  let totalSuma = 0;

  datos?.forEach((elemento: any) => {
    if (elemento.hasOwnProperty('total')) {
      totalSuma += elemento.total;
    }
  });

  return totalSuma.toFixed(2);
}


export const sumarDiscount = (datos: any): string => {
  let totalSuma = 0;

  datos?.forEach((elemento: any) => {
    if (elemento.hasOwnProperty('discount')) {
      totalSuma += elemento.discount;
    }
  });

  return totalSuma.toFixed(2);
}

export const sumarTotalesWithoutDIscount = (datos: any): string => {
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

  return total.toFixed(2);
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

// obtiene el ultimo elemento de un arreglo
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