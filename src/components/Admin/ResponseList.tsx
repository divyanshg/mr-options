import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem
} from '@/components/ui/Command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover';
import { cn } from '@/lib/utils';

const ResponseList = ({
  open,
  setOpen,
  value,
  setValue,
  responses,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  responses: any;
}) => (
  <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-[200px] justify-between"
      >
        {value ? value : "Select response..."}
        <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-[200px] p-0">
      <Command>
        <CommandInput placeholder="Search responses..." />
        <CommandEmpty>No Response found.</CommandEmpty>
        <CommandGroup>
          {responses?.map((response: any) => (
            <CommandItem
              key={response.value}
              onSelect={(currentValue) => {
                setValue(currentValue === value ? "" : currentValue);
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === response.value ? "opacity-100" : "opacity-0"
                )}
              />
              {response.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </PopoverContent>
  </Popover>
);

export default ResponseList;
