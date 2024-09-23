import clsx from 'clsx';

type Props = {
  columns: React.ReactNode[];
  rows: React.ReactNode[][];
};

export default function Table({ columns, rows }: Props) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
    gap: '0.5rem',
  };

  return (
    <div className="w-full">
      <div style={gridStyle} className="w-full">
        {columns.map((column, index) => (
          <div
            key={index}
            className="font-semibold text-sm text-blue-300 h-12 flex items-center"
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
              className="h-12 font-normal text-xs overflow-hidden whitespace-nowrap text-ellipsis flex items-center"
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
