export interface Employee {
    id:                string;
    name:              string;
    email?:             string;
    email_verified_at?: Date;
    type?:              number;
    created_at?:        Date;
    updated_at?:        Date;
}