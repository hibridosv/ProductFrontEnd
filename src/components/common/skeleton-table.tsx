import React from 'react'

interface SkeletonTableProps {
  columns?: number
  rows?: number
}

export default function SkeletonTable({ columns = 7, rows = 11 }: SkeletonTableProps) {
  return (
    <div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
        {Array.from({ length: columns }).map((_, index) => (
              <th scope="col"  key={`header-${index}`} className="py-2 px-2  border">
                <div className="h-5 bg-gray-300 rounded animate-pulse"></div>
              </th>
            ))}

        </tr>
      </thead>
      <tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={`row-${rowIndex}`} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td className="py-2 px-2" key={colIndex}>
                  <div className="h-6 bg-gray-200 rounded animate-pulse text-lg"></div>
                  </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
 </div>
 </div>
  )
}
