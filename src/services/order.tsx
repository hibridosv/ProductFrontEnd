import { Employee } from "./Employee";

export interface Order {
    id:               string;
    order_type?:       number;
    employee_id:      string;
    casheir_id?:       null;
    delivery_id?:      null;
    client_id?:        null;
    referred_id?:      null;
    delivery_type:    number;
    invoice?:          null;
    invoice_type_id:  string;
    payment_type?:     null;
    cash:             null;
    subtotal?:         null;
    taxes?:            null;
    discount?:         null;
    total?:            null;
    change?:           null;
    retention?:        number;
    charged_at?:       null;
    canceled_at?:      null;
    status:           number;
    created_at:       Date;
    updated_at:       Date;
    invoiceproducts?:  Invoiceproduct[];
    employee:         Employee;
    delivery?:        User;
    client?:          Contact;
    referred?:        Contact;
    comment:  string;
    invoice_assigned?: InvoiceAssigned;
}

export interface InvoiceAssigned {
    id:             string;
    type:           number;
    name:           string;
    correlative?:    string;
    inicial_number?: number;
    final_number?:   number;
    last_at?:        Date;
    status:         number;
    created_at?:     Date;
    updated_at?:     Date;
}

export interface Invoiceproduct {
    id:                  string;
    product_id?:          string;
    cod:                 string;
    quantity:            number;
    product?:             string;
    unit_cost?:           number;
    unit_price?:          number;
    discount?:            number;
    discount_percentage?: number;
    price_with_discount?: number;
    taxes?:               number;
    taxes_percent?:       number;
    subtotal:            number;
    total:               number;
    ticket_order_id:     string;
    employee_id?:         string;
    casheir_id?:          null;
    delivery_id?:         null;
    client_id?:           null;
    referred_id?:         null;
    product_type?:        number;
    comment?:             null;
    status?:              number;
    created_at?:          Date;
    updated_at?:          Date;
}


export interface Contact {
    id:              string;
    name:            string;
    id_number:       string;
    direction:       string;
    code:            string;
    email:           string;
    phone:           string;
    birthday:        Date;
    taxpayer:        string;
    taxpayer_type:   number;
    document:        string;
    register:        string;
    roar:            string;
    departament_doc: string;
    direction_doc:   string;
    is_client:       number;
    is_provider:     number;
    is_employee:     number;
    is_referred:     number;
    status:          number;
    comment:         string;
    created_at:      Date;
    updated_at:      Date;
}

export interface User {
    id:                string;
    name:              string;
    email:             string;
    email_verified_at: Date;
    type:              number;
    created_at:        Date;
    updated_at:        Date;
}


