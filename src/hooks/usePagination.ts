'use client'
import { useState } from 'react';

export function usePagination(InitialState: string) {
    const [currentPage, setCurrentPage] = useState(InitialState);

    const handlePageNumber =  (url: string) => {
        var page = url.split("?");
        setCurrentPage(`&${page[page.length - 1]}`);
      }
  return { currentPage, handlePageNumber };
}