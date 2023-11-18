import { useState } from 'react';

export function useSearchTerm(searchRows: any, delay = 300) {
    const [searchTerm, setSearchTerm] = useState("");
    let searchTimeout: any = null;

    const handleSearchTerm = (term: any) => {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            if (term !== "") {
                const filters = searchRows.map((field: any) => `filter[${field}]=${term}`).join('&');
                setSearchTerm(`&${filters}`);
            } else {
                setSearchTerm("");
            }
        }, delay);
    }

    return { searchTerm, handleSearchTerm };
}