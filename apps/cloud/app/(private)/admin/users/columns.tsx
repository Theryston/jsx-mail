'use client';

import { UserAdmin } from '@/types/user';
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { Button } from '@jsx-mail/ui/button';
import { toast } from '@jsx-mail/ui/sonner';
import {
  ShieldIcon,
  BanIcon,
  MoreHorizontal,
  BarChartIcon,
  SettingsIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@jsx-mail/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@jsx-mail/ui/dropdown-menu';
import { useImpersonateUser } from '@/hooks/user';
import handleRedirectUrl from '@/utils/handle-redirect-url';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { BlockPermissionsModal } from './block-permissions-modal';
import { UtmsModal } from './utms-modal';
import { Badge } from '@jsx-mail/ui/badge';
import { UserSettingsModal } from './user-settings-modal';

export const columns: ColumnDef<UserAdmin>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <span>{row.original.id}</span>
          {row.original.blockedPermissions.length > 0 && (
            <Badge variant="destructive">Blocked</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <span>{row.original.name || 'N/A'}</span>;
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      return <span>{row.original.email || 'N/A'}</span>;
    },
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => {
      return <span>{row.original.phone || 'N/A'}</span>;
    },
  },
  {
    accessorKey: 'onboardingStep',
    header: 'Onboarding Step',
    cell: ({ row }) => {
      return <span>{row.original.onboardingStep || 'N/A'}</span>;
    },
  },
  {
    accessorKey: 'isEmailVerified',
    header: 'Email Verified',
    cell: ({ row }) => {
      return <span>{row.original.isEmailVerified ? 'Yes' : 'No'}</span>;
    },
  },
  {
    accessorKey: 'accessLevel',
    header: 'Access Level',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      return <span>{moment(row.original.createdAt).format('DD/MM/YYYY')}</span>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;
      const { mutateAsync: impersonateUser } = useImpersonateUser();
      const searchParams = useSearchParams();
      const router = useRouter();
      const [blockModalOpen, setBlockModalOpen] = useState(false);
      const [utmsModalOpen, setUtmsModalOpen] = useState(false);
      const [settingsModalOpen, setSettingsModalOpen] = useState(false);

      const handleImpersonate = async () => {
        const id = toast.loading('Impersonating user...');

        try {
          const impersonatedSession = await impersonateUser({
            userId: user.id,
          });

          const redirectUrlString = handleRedirectUrl(searchParams);
          const redirectUrlObj = new URL(redirectUrlString);
          redirectUrlObj.searchParams.append(
            'sessionId',
            impersonatedSession.sessionId,
          );
          redirectUrlObj.searchParams.append(
            'token',
            impersonatedSession.token,
          );

          const redirectUrl = redirectUrlObj.toString();

          toast.success('User impersonated successfully', { id });
          router.push(redirectUrl);
        } catch (error) {
          toast.error('Failed to impersonate user', { id });
        }
      };

      const handleBlock = () => {
        setBlockModalOpen(true);
      };

      const handleUtms = () => {
        setUtmsModalOpen(true);
      };

      const handleSettings = () => {
        setSettingsModalOpen(true);
      };

      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSettings}
            title="Edit user settings"
          >
            <SettingsIcon className="size-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleImpersonate}>
                <ShieldIcon className="size-4" />
                Impersonate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBlock}>
                <BanIcon className="size-4" />
                Block
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleUtms}>
                <BarChartIcon className="size-4" />
                View UTMs
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {blockModalOpen && (
            <BlockPermissionsModal
              isOpen={blockModalOpen}
              onClose={() => setBlockModalOpen(false)}
              user={user}
            />
          )}

          {utmsModalOpen && (
            <UtmsModal
              isOpen={utmsModalOpen}
              onClose={() => setUtmsModalOpen(false)}
              user={user}
            />
          )}

          {settingsModalOpen && (
            <UserSettingsModal
              isOpen={settingsModalOpen}
              onClose={() => setSettingsModalOpen(false)}
              user={user}
            />
          )}
        </div>
      );
    },
  },
];
