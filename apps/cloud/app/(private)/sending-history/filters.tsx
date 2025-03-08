'use client';

import { Button } from '@jsx-mail/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@jsx-mail/ui/popover';
import { Input } from '@jsx-mail/ui/input';
import { FilterIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@jsx-mail/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@jsx-mail/ui/select';
import { Status } from '@/types/message';
import { useSenders } from '@/hooks/sender';
import { useMessageStatuses } from '@/hooks/message';
import { Sender } from '@/types/sender';
import { Checkbox } from '@jsx-mail/ui/checkbox';

const filtersSchema = z.object({
  fromEmail: z.string().optional(),
  toEmail: z
    .string()
    .email({ message: 'Invalid email address' })
    .optional()
    .or(z.literal('')),
  statuses: z.array(z.string()).optional(),
});

type FiltersFormValues = z.infer<typeof filtersSchema>;

interface FiltersProps {
  fromEmail: string;
  toEmail: string;
  statuses: string[];
  onFiltersChange: (filters: {
    fromEmail: string;
    toEmail: string;
    statuses: string[];
  }) => void;
}

export function Filters({
  fromEmail,
  toEmail,
  statuses,
  onFiltersChange,
}: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: senders } = useSenders();
  const { data: messageStatuses } = useMessageStatuses();
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(
    statuses || [],
  );

  const form = useForm<FiltersFormValues>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      fromEmail: fromEmail || 'any',
      toEmail: toEmail || '',
      statuses: statuses || [],
    },
  });

  function onSubmit(data: FiltersFormValues) {
    onFiltersChange({
      fromEmail: data.fromEmail === 'any' ? '' : data.fromEmail || '',
      toEmail: data.toEmail || '',
      statuses: selectedStatuses,
    });
    setIsOpen(false);
  }

  const toggleStatus = (value: string) => {
    setSelectedStatuses((prev) => {
      if (prev.includes(value)) {
        return prev.filter((s) => s !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <FilterIcon className="mr-2 h-4 w-4" />
          Filters
          {(fromEmail || toEmail || selectedStatuses.length > 0) && (
            <span className="ml-1 rounded-full bg-primary w-2 h-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4" align="start">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fromEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="any">Any sender</SelectItem>
                      {senders?.map((sender: Sender) => (
                        <SelectItem key={sender.id} value={sender.email}>
                          {sender.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="toEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <Input placeholder="recipient@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Status</FormLabel>
              <div className="mt-2 space-y-2 max-h-[150px] overflow-y-auto">
                {messageStatuses?.map((status: Status) => (
                  <div
                    key={status.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`status-${status.value}`}
                      checked={selectedStatuses.includes(status.value)}
                      onCheckedChange={() => toggleStatus(status.value)}
                    />
                    <label
                      htmlFor={`status-${status.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {status.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Apply Filters</Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
