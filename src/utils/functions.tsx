import { OptionsClickOrder, TypeOfPrice } from "@/services/enums"

export const numberToMoney = (number: number): string => {
    return `$${number.toFixed(2)}`
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