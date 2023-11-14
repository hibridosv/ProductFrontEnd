import { Employee } from "./Employee";

export interface Bills {
    data: Bill[];
}

export interface Bill {
    id:                       string;
    name:                     string;
    description?:              string;
    type:                     number;
    quantity:                 number;
    employee_id?:              Employee;
    invoice?:                  number;
    invoice_number?:           string;
    payment_type:             number;
    cash_bills_categories_id?: string;
    cash_accounts_id?:         string;
    status:                   number;
    created_at?:               Date;
    updated_at?:               Date;
    category:                 Category;
    account?:                  Account;
}

export interface Account {
    id:           string;
    account?:      string;
    type?:         number;
    bank?:         string;
    balance?:      number;
    is_principal?: number;
    status?:       number;
    created_at?:   Date;
    updated_at?:   Date;
}

export interface Category {
    id?:           string;
    name?:         string;
    is_principal?: number;
    status?:       number;
    created_at?:   Date;
    updated_at?:   Date;
}
