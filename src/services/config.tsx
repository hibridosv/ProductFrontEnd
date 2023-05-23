export interface Config {
    configurations: Configuration[];
}

export interface Configuration {
    id:          number;
    feature:     string;
    active:      number;
    description: string;
    created_at:  Date;
    updated_at:  Date;
}
