import {
  CloudSunny,
  Computing,
  Document,
  DocumentSketch,
  Home,
  MessageTick,
  Send,
} from 'iconsax-react';

export const HEADER_ITEMS = [
  {
    label: 'Home',
    href: '/app',
    icon: <Home variant="Bold" size="1.5rem" />,
  },
  {
    label: 'Billing',
    href: '/app/billing',
    icon: <Computing variant="Bold" size="1.5rem" />,
  },
  {
    label: 'Domains',
    href: '/app/domains',
    icon: <CloudSunny variant="Bold" size="1.5rem" />,
  },
  {
    label: 'Senders',
    href: '/app/senders',
    icon: <Send variant="Bold" size="1.5rem" />,
  },
  {
    label: 'Files',
    href: '/app/files',
    icon: <DocumentSketch variant="Bold" size="1.5rem" />,
  },
  {
    label: 'Sending History',
    href: '/app/sending-history',
    icon: <MessageTick variant="Bold" size="1.5rem" />,
  },
  {
    label: 'Documentation',
    href: 'https://docs.jsxmail.org/introduction',
    icon: <Document variant="Bold" size="1.5rem" />,
    isExternal: true,
  },
];
