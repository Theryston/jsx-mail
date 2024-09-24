type DNSRecord = {
  id: string;
  name: string;
  value: string;
  type: string;
  ttl: number;
};

export type Domain = {
  id: string;
  name: string;
  userId: string;
  status: 'pending' | 'verified' | 'failed';
  dnsRecords: DNSRecord[];
  createdAt: Date;
};
