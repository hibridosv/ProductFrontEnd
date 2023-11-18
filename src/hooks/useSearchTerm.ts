import { useState } from 'react';

export function useSearchTerm(searchRows: string[], delay = 300) {
    const [searchTerm, setSearchTerm] = useState("");
    let searchTimeout: any = null;

    const handleSearchTerm = (term: string) => {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            if (term !== "") {
                const filters = searchRows.map((field: string) => `filter[${field}]=${term}`).join('&');
                setSearchTerm(`&${filters}`);
            } else {
                setSearchTerm("");
            }
        }, delay);
    }

    return { searchTerm, handleSearchTerm };
}