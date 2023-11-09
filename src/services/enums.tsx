/**
 * Tipos de contacto que podrian llevas las ordenes de venta y sus respectivas rutas
 */
export enum ContactTypeToGet {
    clients = 'contacts/clients',
    providers = 'contacts/providers',
    employees = 'users',
    referrals = 'contacts/referrals'
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