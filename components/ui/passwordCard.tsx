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
import { Scanner } from '@yudiel/react-qr-scanner';

export interface PasswordItem {
  id?: number;
  siteName?: string;
  passwordValue?: string;
  secretToken?: string;
  email?: string;
  totp?: string;
}

export function PasswordCard({
  siteName,
  id,
  passwordValue,
  secretToken,
  email,
  totp,
}: PasswordItem) {
  const [otp, setOtp] = useState('');
  const [expires, setExpires] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const generateOTP = () => {
      if (totp) {
        const secret = new URL(totp).searchParams.get('secret');
        const { otp, expires } = TOTP.generate(secret || '');
        setOtp(otp);
        setExpires(expires);

        const timeUntilExpiry = expires - Date.now();
        setTimeout(() => {
          generateOTP();
        }, timeUntilExpiry);
      }
    };

    generateOTP();
  }, [secretToken, totp]);

  // based on expires, calculate time left in seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (totp) {
        const timeUntilExpiry = expires - Date.now();
        const secondsLeft = Math.floor(timeUntilExpiry / 1000);
        setTimeLeft(secondsLeft);
        if (secondsLeft <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expires, totp]);

  const copyPassword = () => {
    if (passwordValue) {
      navigator.clipboard.writeText(passwordValue);
      toast.success(`Password for ${siteName} copied to clipboard`);
    } else {
      toast.error('No password to copy');
    }
  };

  const [editData, setEditData] = useState({ siteName, email, passwordValue, totp });
  const [scannerOpen, setScannerOpen] = useState(false);
  const setTOTP = (result: string) => {
    if (!result.startsWith('otpauth:')) {
      toast.error('Invalid TOTP format. Please scan a valid code.');
      setScannerOpen(false);
    } else {
      setEditData(f => ({ ...f, totp: result }));
      setScannerOpen(false);
    }
  };

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
      {totp && (
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
      )}
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
              {!editData.totp && !scannerOpen && (
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => setScannerOpen(true)}
                >
                  Add 2FA
                </Button>
              )}
              {editData.totp && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">TOTP: {editData.totp}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setEditData(f => ({ ...f, totp: '' }))}
                  >
                    Remove
                  </Button>
                </div>
              )}
              {scannerOpen && (
                <div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mb-2 w-full"
                    onClick={() => setScannerOpen(false)}
                  >
                    Close Scanner
                  </Button>
                  <p className="pb-2">Scan code below. Compatible with Google Authenticator</p>
                  <Scanner onScan={result => setTOTP(result[0].rawValue)} />
                </div>
              )}
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
      </CardFooter>
    </Card>
  );
}
