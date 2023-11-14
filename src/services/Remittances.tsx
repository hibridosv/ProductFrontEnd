import { Account } from "./Bills";
import { Employee } from "./Employee";

export interface Remittances {
    data: Remittance[];
}

export interface Remittance {
    id:               string;
    name:             string;
    description:      string;
    quantity:         number;
    employee_id?:      Employee;
    cash_accounts_id: string;
    status:           number;
    created_at:       Date;
    updated_at:       Date;
    account:          Account;
}