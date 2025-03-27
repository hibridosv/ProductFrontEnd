export interface Contacts {
    data?: Contact[];
}

export interface Contact {
    id:            string;
    name:          string;
    email?:        string;
    phone?:        string;
    document?:     string;
    contact_type?:  number;
    excluded?:  number;
}
