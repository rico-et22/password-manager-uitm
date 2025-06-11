'use client';

import { useEffect, useState } from 'react';
import { PasswordCard } from '@/components/ui/passwordCard';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

type Password = {
  id: number;
  siteName: string;
  email: string;
  passwordValue: string;
  secretToken?: string;
};

export function PasswordList() {
  const { data, isLoading } = useQuery({
    queryKey: ['passwords'],
    queryFn: async (): Promise<Password[]> => {
      const res = await fetch('/api/passwords');
      if (!res.ok) toast.error('Failed to fetch passwords');
      return res.json();
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (!data?.length) return <p>No passwords yet</p>;

  return (
    <>
      {data.map(p => (
        <PasswordCard
          key={p.id}
          id={p.id}
          siteName={p.siteName}
          passwordValue={p.passwordValue}
          secretToken={p.secretToken}
        />
      ))}
    </>
  );
}
