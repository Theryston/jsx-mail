'use client';

import { toast } from '@jsx-mail/ui/sonner';
import { useTheme } from '@jsx-mail/ui/theme';

export default function SignIn() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <button onClick={() => toast.error('Invalid redirect URL')}>
        Click me
      </button>
    </div>
  );
}
