import * as React from 'react';

export interface GroupProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right';
  children?: React.ReactNode;
}

export function Group(props: GroupProps) {
  const { children, align, ...restProps } = props;
  return (
    <table
      width="100%"
      border={0}
      cellSpacing={0}
      cellPadding={0}
      {...restProps}
    >
      <tr>
        <td align={align ? align : 'left'}>{children}</td>
      </tr>
    </table>
  );
}
