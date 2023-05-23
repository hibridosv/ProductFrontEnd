'use client'
import { useState } from 'react';

export function useSearchTerm() {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchTerm =  (term: string) => {
        if (term !== "") {
            setSearchTerm(`&filter[cod]=${term}&filter[description]=${term}`);
        } else {
            setSearchTerm("");
        }
    }

  return { searchTerm, handleSearchTerm };
}