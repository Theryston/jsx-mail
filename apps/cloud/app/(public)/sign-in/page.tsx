'use client';

import { toast } from '@jsx-mail/ui/sonner';

export default function SignIn() {
  return (
    <div>
      <button onClick={() => toast.error('Invalid redirect URL')}>
        Click me
      </button>
    </div>
  );
}
