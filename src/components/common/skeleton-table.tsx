import React from 'react'

interface SkeletonTableProps {
  columns: number
  rows: number
}

export default function SkeletonTable({ columns, rows }: SkeletonTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={`header-${index}`} className="p-2 border">
                <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={`cell-${rowIndex}-${colIndex}`} className="p-2 border">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}