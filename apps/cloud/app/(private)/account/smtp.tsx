import { Card, CardContent, CardHeader, CardTitle } from '@jsx-mail/ui/card';
import { Label } from '@jsx-mail/ui/label';
import { Input } from '@jsx-mail/ui/input';
import Link from 'next/link';

export function SMTP() {
  return (
    <Card className="max-w-lg w-full flex gap-4 pt-0">
      <CardHeader className="p-4 pb-0">
        <CardTitle>SMTP</CardTitle>
      </CardHeader>
      <hr />
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>SMTP Host</Label>
            <Input disabled value="smtp.jsxmail.org" copyIcon />
          </div>
          <div className="flex flex-col gap-2">
            <Label>SMTP Port</Label>
            <Input disabled value="25" copyIcon />
          </div>
          <div className="flex flex-col gap-2">
            <Label>SMTP Username</Label>
            <Input disabled value="jsxmail" copyIcon />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Encryption</Label>
            <Input disabled value="None" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>SMTP Password</Label>
            <Input disabled value="YOUR_API_KEY" />
            <div className="text-xs text-muted-foreground flex flex-col gap-1">
              <p>
                An{' '}
                <Link
                  href="/account?tab=api-keys"
                  className="text-primary underline"
                >
                  API Key
                </Link>{' '}
                with at least these two permissions:
              </p>
              <ul className="list-disc list-inside">
                <li>
                  <code>self:get</code>
                </li>
                <li>
                  <code>self:send-email</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
