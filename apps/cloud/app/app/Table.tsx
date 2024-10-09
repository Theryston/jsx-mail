import { Skeleton, Tooltip } from '@nextui-org/react';
import clsx from 'clsx';
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
  };

  const classNameGap = clsx('w-full', {
    'gap-2': isLoading,
    'gap-3': !isLoading,
  });

  return (
    <div
      className={clsx('flex flex-col', classNameGap, {
        'gap-2': isLoading,
        'gap-4': !isLoading,
      })}
    >
      <div style={gridStyle} className={classNameGap}>
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
          <div key={index} style={gridStyle} className={classNameGap}>
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
          <div key={index} style={gridStyle} className={classNameGap}>
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
