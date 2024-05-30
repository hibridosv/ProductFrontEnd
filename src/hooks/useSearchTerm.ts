
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

export function useSearchTerm(searchRows: string[], delay = 300) {
    const [searchTerm, setSearchTerm] = useState("");
    const [term, setTerm] = useState("");
    const [debouncedTerm] = useDebounce(term, delay);

    useEffect(() => {
        if (debouncedTerm !== "") {
            const filters = searchRows.map((field: string) => `filter[${field}]=${debouncedTerm}`).join('&');
            setSearchTerm(`&${filters}`);
        } else {
            setSearchTerm("");
        }
    }, [debouncedTerm, searchRows]);

    const handleSearchTerm = (term: string) => {
        setTerm(term);
    };

    return { searchTerm, handleSearchTerm };
}