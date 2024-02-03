'use client';

import { useCallback, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  ChipProps,
} from '@nextui-org/react';
import { DotsVerticalIcon, PlusIcon } from '@radix-ui/react-icons';

type Status = 'active' | 'error' | 'awaiting';

const statusColorMap: Record<Status, ChipProps['color']> = {
  active: 'success',
  error: 'danger',
  awaiting: 'warning',
};

type Item = {
  id: string;
  status?: {
    value: Status;
    label: string;
  };
  actions?: string[];
} & Record<string, any>;

type Props = {
  items: Item[];
  onNewClick?: () => void;
  // eslint-disable-next-line no-unused-vars
  onActionClick?: (action: string, item: Item) => void;
};

export default function CustomTable({
  items,
  onNewClick,
  onActionClick,
}: Props) {
  const [columns] = useState(
    Object.keys(items[0]).map((key) => ({
      uid: key,
      name: key,
    })),
  );

  const renderCell = useCallback(
    (item: Item, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof Item];

      switch (columnKey) {
        case 'status':
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[item.status?.value as Status]}
              size="sm"
              variant="flat"
            >
              {cellValue.label}
            </Chip>
          );
        case 'actions':
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <DotsVerticalIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                {item.actions && (
                  <DropdownMenu>
                    {item.actions.map((action) => (
                      <DropdownItem
                        onClick={() =>
                          onActionClick && onActionClick(action, item)
                        }
                        key={action}
                      >
                        {action}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                )}
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [onActionClick],
  );

  return (
    <Table
      isHeaderSticky
      topContent={
        onNewClick ? (
          <div className="flex w-full justify-end items-center">
            <Button
              color="primary"
              endContent={<PlusIcon />}
              onClick={() => onNewClick()}
            >
              Add New
            </Button>
          </div>
        ) : (
          <></>
        )
      }
    >
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
      </TableHeader>

      <TableBody emptyContent={'Not found found'} items={items}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
