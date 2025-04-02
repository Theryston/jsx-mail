'use client';

import { Button } from '@jsx-mail/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@jsx-mail/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@jsx-mail/ui/calendar';
import { useState } from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface DateFilterProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

export function DateFilter({ dateRange, onDateRangeChange }: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[240px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, 'dd MMM yy')} -{' '}
                {format(dateRange.to, 'dd MMM yy')}
              </>
            ) : (
              format(dateRange.from, 'dd MMM yy')
            )
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={onDateRangeChange}
        />
      </PopoverContent>
    </Popover>
  );
}
