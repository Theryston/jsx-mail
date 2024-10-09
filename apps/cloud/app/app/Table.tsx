import { Skeleton, Tooltip } from '@nextui-org/react';
import { isValidElement } from 'react';

type Props = {
  columns: React.ReactNode[];
  rows: React.ReactNode[][];
  isLoading?: boolean;
  mockCountOnLoading?: number;
};

export default function Table({
  columns,
  rows,
  isLoading,
  mockCountOnLoading = 10,
}: Props) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
    gap: isLoading ? '0.75rem' : '1.5rem',
  };

  return (
    <div className="w-full flex flex-col" style={{ gap: gridStyle.gap }}>
      <div style={gridStyle} className="w-full">
        {columns.map((column, index) => (
          <div
            key={index}
            className="font-semibold text-sm text-blue-300 overflow-auto whitespace-nowrap text-ellipsis flex items-center scrollbar-hide"
          >
            {column}
          </div>
        ))}
      </div>

      {isLoading &&
        Array.from({ length: mockCountOnLoading }).map((_, index) => (
          <div key={index} style={gridStyle} className="w-full">
            {Array.from({ length: columns.length }).map((_, subIndex) => (
              <div
                key={subIndex}
                className="font-normal text-xs overflow-hidden whitespace-nowrap text-ellipsis flex items-center scrollbar-hide"
              >
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            ))}
          </div>
        ))}

      {!isLoading &&
        rows.map((row, index) => (
          <div key={index} style={gridStyle} className="w-full">
            {row.map((cell, index) => (
              <div
                key={index}
                className="font-normal text-xs overflow-auto whitespace-nowrap text-ellipsis flex items-center md:scrollbar-hide"
              >
                {isValidElement(cell) ? (
                  cell
                ) : (
                  <Tooltip content={cell}>{cell}</Tooltip>
                )}
              </div>
            ))}
          </div>
        ))}

      {!isLoading && rows.length === 0 && (
        <div className="w-full flex items-center justify-center">
          <p className="text-xs font-normal text-zinc-500">No data</p>
        </div>
      )}
    </div>
  );
}
