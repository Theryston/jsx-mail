import { Tooltip } from '@nextui-org/react';
import { isValidElement } from 'react';

type Props = {
  columns: React.ReactNode[];
  rows: React.ReactNode[][];
};

export default function Table({ columns, rows }: Props) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
    gap: '1.5rem',
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div style={gridStyle} className="w-full">
        {columns.map((column, index) => (
          <div
            key={index}
            className="font-semibold text-sm text-blue-300 flex items-center"
          >
            {column}
          </div>
        ))}
      </div>

      {rows.map((row, index) => (
        <div key={index} style={gridStyle} className="w-full">
          {row.map((cell, index) => (
            <div
              key={index}
              className="font-normal text-xs overflow-hidden whitespace-nowrap text-ellipsis flex items-center"
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
    </div>
  );
}
