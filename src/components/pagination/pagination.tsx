"use client";
import React from "react";
import { Products as ProductsInterface } from "../../services/products";
// import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io"

export interface PaginationProps {
  products?: ProductsInterface | any;
  handlePageNumber?: (url: string) => any;
}

export function Pagination(props: PaginationProps) {
  const { products, handlePageNumber } = props;

  if (!products.links) return null;

  if (products.meta.total === 0) return null;

  const { links } = products.meta;
  const activeIndex = links.findIndex((link: any) => link.active);

  const startIndex = Math.max(activeIndex - 2, 0);
  const endIndex = Math.min(activeIndex + 2, links.length - 1);
  const defaultSlice = links.slice(0, 5);

  const filteredLinks =
    activeIndex >= 0 ? links.slice(startIndex, endIndex + 1) : defaultSlice;

  const filtered = filteredLinks.filter((link: any) => {
    return !isNaN(link.label);
  });

  const listItems = filtered.map((link: any) => (
    <button
      key={link.url}
      onClick={() => handlePageNumber?.(link.url)}
      className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-800  hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white mx-0.5"
    >
      {link.label}
    </button>
  ));

  return (
    <div className="flex flex-col items-center">
      <span className="text-sm text-gray-700 dark:text-gray-400">
        Mostrando{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {products.meta.from}
        </span>{" "}
        a{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {products.meta.to}
        </span>{" "}
        de{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {products.meta.total}
        </span>{" "}
        Registros
      </span>
      <div className="inline-flex mt-2 xs:mt-0">
        {products.links.prev ? (
          <button
            onClick={() => handlePageNumber?.(products.links.prev)}
            className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Prev
          </button>
        ) : (
          <button
            className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-500 rounded-l hover:bg-gray-600 dark:bg-gray-500 dark:border-gray-400 dark:text-gray-100 dark:hover:bg-gray-400 dark:hover:text-white"
            disabled
          >
            Prev
          </button>
        )}

        {listItems}

        {products.links.next ? (
          <button
            onClick={() => handlePageNumber?.(products.links.next)}
            className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-r border-0 border-l border-gray-700 hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Next
          </button>
        ) : (
          <button className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-gray-500 rounded-r border-0 border-l border-gray-400 hover:bg-gray-600 dark:bg-gray-500 dark:border-gray-400 dark:text-gray-100 dark:hover:bg-gray-400 dark:hover:text-white">
            Next
          </button>
        )}
      </div>
    </div>
  );
}
