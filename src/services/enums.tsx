/**
 * Tipos de contacto que podrian llevas las ordenes de venta y sus respectivas rutas
 */
export enum ContactTypeToGet {
    clients = 'contacts?filterWhere[is_client]==1&',
    providers = 'contacts?filterWhere[is_provider]==1&',
    employees = 'users?',
    referrals = 'contacts?filterWhere[is_referred]==1&'
}

/**
 * Tipos de contacto con sus ids de las ordenes de ventas
 */
export enum ContactNameOfOrder {
    employee = 'employee_id',
    casheir = 'casheir_id',
    delivery = 'delivery_id',
    client = 'client_id',
    referred = 'referred_id',
}


/**
 * Opciones de los botones de las ordenes de ventas
 */
export enum OptionsClickOrder {
    pay = 1,
    save = 2,
    delete = 3,
    discount = 11,
    client = 12,
    seller = 13,
    referred = 14,
    delivery = 15,
    special = 16,
    normalPrice = 17,
    promotionPrice = 18,
    wholesalerPrice = 19,
    documentType = 20,
    comment = 21,
    quotes = 22,
  }
  

  export enum TypeOfPrice {
    normal = 1,
    wholesaler = 2,
    promotion = 3,
  }


  
export enum PresetTheme {
  primary = "primary",
  danger = "danger",
  success = "success",
  info = "info",
  warning = "warning",
}


export enum DocumentTypes {
  ninguno = 0,
  ticket = 1,
  factura = 2,
  creditoFiscal = 3,
}


export enum DocumentTypesNames {
  ninguno = "Ninguno",
  ticket = 'Ticket',
  factura = "Factura",
  creditoFiscal = "Credito Fiscal",
}


export enum PaymentType {
  efectivo = 1,
  tarjeta = 2,
  tranferencia = 3,
  cheque = 4,
  credito = 5,
  btc = 6,
  otro = 0,
}


export enum PaymentTypeNames {
  efectivo = "Efectivo",
  tarjeta = "Tarjeta",
  tranferencia = "Transferencia",
  cheque = "Cheque",
  credito = "Credito",
  btc = "BTC",
  otro = "Otro",
}