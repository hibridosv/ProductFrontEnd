import { Account } from "./Bills";
import { Employee } from "./Employee";


export interface InOuts {
    data: InOut[];
}

export interface InOut {
    id:               string;
    transaction_type: number;
    description:      string;
    quantity:         number;
    employee_id:      null | string;
    cash_accounts_id: string;
    status:           number;
    created_at:       Date;
    updated_at:       Date;
    account:          Account;
    employee:         Employee | null;
}