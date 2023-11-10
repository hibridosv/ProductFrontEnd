'use client'
import React from "react";
import { Products as ProductsInterface } from "../../services/products";

export interface PaginationProps {
  products?: ProductsInterface | any;
  handlePageNumber?: (url: string) => any;
}

export function Paginator(props: PaginationProps) {
  const { products, handlePageNumber } = props;

  if (!products.links) return null;

  const getButtonStyle = (link: any) => {
    let defaultStyle = "h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white border border-indigo-600";

    if (link.active) {
      defaultStyle = "h-10 px-5 text-white transition-colors duration-150 bg-indigo-600 border border-indigo-600 focus:shadow-outline";
    }

    if (link.label === 'Anterior') {
      return `${defaultStyle} border-r-0 rounded-l-lg focus:shadow-outline hover:bg-indigo-100`;
    }

    if (link.label === 'Siguiente') {
      return `${defaultStyle} rounded-r-lg focus:shadow-outline hover:bg-indigo-100`;
    }

    return `${defaultStyle} border-r-0 focus:shadow-outline hover:bg-indigo-100`;
  };
  


  const filteredLinks = products.meta.links.filter((link: any) => {
   return link.label === 'Anterior' || link.label === 'Siguiente' || !isNaN(link.label);
  });



  const listItems = filteredLinks.map((link: any) => (
    <li key={link.url}>
      <button className={getButtonStyle(link)} onClick={() => handlePageNumber?.(link.url)}>
        {link.label}
      </button>
    </li>
  ));

  return (
    <div className="flex items-center justify-center text-center mt-3">
      <nav aria-label="Page navigation">
        <ul className="inline-flex">
          {listItems}
        </ul>
      </nav>
    </div>
  );
}
