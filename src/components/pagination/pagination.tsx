"use client";
import React from "react";

export interface PaginationProps {
  records?: any;
  handlePageNumber?: (url: string) => any;
}

export function Pagination(props: PaginationProps) {
  const { records, handlePageNumber } = props;

  if (!records?.links) return <></>;

  if (records?.meta?.total === 0) return <></>;

  const { links } = records.meta;
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
      className={`inline-flex items-center py-2 px-4 text-sm font-medium text-white  mx-0.5  
      ${link.active ? "bg-cyan-500" : "bg-cyan-800 hover:bg-cyan-900"}`}
    >
      {link.label}
    </button>
  ));


  return (
    <div className="flex flex-col items-center">
      <span className="text-sm text-cyan-700">
        Mostrando{" "}
        <span className="font-semibold text-cyan-900">
          {records.meta.from}
        </span>{" "}
        a{" "}
        <span className="font-semibold text-cyan-900">
          {records.meta.to}
        </span>{" "}
        de{" "}
        <span className="font-semibold text-cyan-900">
          {records.meta.total}
        </span>{" "}
        Registros
      </span>
      { records.meta.total > records.meta.per_page && (
      <div className="inline-flex mt-2 xs:mt-0">
        {records.links.prev ? (
          <button
            onClick={() => handlePageNumber?.(records.links.prev)}
            className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-cyan-800 rounded-l hover:bg-cyan-900 "
          >
            Prev
          </button>
        ) : (
          <button
            className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-cyan-500 rounded-l hover:bg-cyan-600"
            disabled
          >
            Prev
          </button>
        )}

        {listItems}

        {records.links.next ? (
          <button
            onClick={() => handlePageNumber?.(records.links.next)}
            className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-cyan-800 rounded-r border-0 border-l border-cyan-700 hover:bg-cyan-900"
          >
            Next
          </button>
        ) : (
          <button className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-cyan-500 rounded-r border-0 border-l border-cyan-400 hover:bg-cyan-600">
            Next
          </button>
        )}
      </div>
      )}
    </div>
  );
}
