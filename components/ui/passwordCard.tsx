'use client';

import { cn } from '@/app/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { TOTP } from 'totp-generator';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import TwoFAModal from '../passwords/2fa-modal';

export interface PasswordItem {
  id?: number;
  siteName?: string;
  passwordValue?: string;
  secretToken?: string;
  email?: string;
}

export function PasswordCard({ siteName, id, passwordValue, secretToken, email }: PasswordItem) {
  const [otp, setOtp] = useState('');
  const [expires, setExpires] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const generateOTP = () => {
      const { otp, expires } = TOTP.generate(secretToken || '');
      setOtp(otp);
      setExpires(expires);

      const timeUntilExpiry = expires - Date.now();
      setTimeout(() => {
        generateOTP();
      }, timeUntilExpiry);
    };

    generateOTP();
  }, [secretToken]);

  // based on expires, calculate time left in seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const timeUntilExpiry = expires - Date.now();
      const secondsLeft = Math.floor(timeUntilExpiry / 1000);
      setTimeLeft(secondsLeft);
      if (secondsLeft <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expires]);

  const copyPassword = () => {
    if (passwordValue) {
      navigator.clipboard.writeText(passwordValue);
      toast.success(`Password for ${siteName} copied to clipboard`);
    } else {
      toast.error('No password to copy');
    }
  };

  const [editData, setEditData] = useState({ siteName, email, passwordValue });

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Mutation for update
  const updateMutation = useMutation({
    mutationFn: (data: typeof editData) =>
      fetch(`/api/passwords/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      }),
    onSuccess: () => {
      toast.success('Password updated!');
      setEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ['passwords'] });
    },
    onError: () => {
      toast.error('Update failed');
    },
  });

  // Mutation for delete
  const deleteMutation = useMutation({
    mutationFn: () =>
      fetch(`/api/passwords/${id}`, { method: 'DELETE' }).then(async res => {
        if (!res.ok) throw new Error(await res.text());
      }),
    onSuccess: () => {
      toast.success('Password deleted!');
      queryClient.invalidateQueries({ queryKey: ['passwords'] });
    },
    onError: () => {
      toast.error('Delete failed');
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>{siteName}</CardHeader>
      <CardContent>
        2FA code: {otp}
        <div className="w-full h-2 bg-gray-100 relative rounded-md mt-1">
          <div
            className="h-2 bg-primary absolute top-0 left-0 transition-all duration-200 ease-in-out rounded-md"
            style={{
              width: `${(timeLeft / 30) * 100}%`,
            }}
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button variant="secondary" className="w-full" onClick={() => copyPassword()}>
          Copy Password
        </Button>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="w-full">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Password</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={e => {
                e.preventDefault();
                updateMutation.mutate(editData);
              }}
              className="space-y-3"
            >
              <Input
                name="siteName"
                value={editData.siteName}
                onChange={handleEditChange}
                required
              />
              <Input name="email" value={editData.email} onChange={handleEditChange} required />
              <Input
                name="passwordValue"
                value={editData.passwordValue}
                onChange={handleEditChange}
                required
              />
              <Button type="submit" className="w-full">
                Save
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        {/* Delete dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                This will permanently delete the password for {siteName}.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={() => deleteMutation.mutate()}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* <TwoFAModal passwordId={id || 420} /> */}
      </CardFooter>
    </Card>
  );
}
