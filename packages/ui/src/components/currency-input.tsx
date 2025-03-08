import { Input } from '@jsx-mail/ui/input';

import CurrencyInputComponent, {
  CurrencyInputProps,
} from 'react-currency-input-field';

export function CurrencyInput({
  className,
  type,
  ...props
}: React.ComponentProps<'input'> & CurrencyInputProps) {
  return (
    <CurrencyInputComponent
      intlConfig={{ locale: 'en-US', currency: 'USD' }}
      prefix="$"
      customInput={Input}
      placeholder="$0"
      {...props}
    />
  );
}
