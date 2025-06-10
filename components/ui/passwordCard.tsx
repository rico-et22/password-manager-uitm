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
import { useEffect, useState } from 'react';
import { TOTP } from 'totp-generator';

export interface PasswordItem {
  id?: number;
  siteName?: string;
  passwordValue?: string;
  secretToken?: string;
}

export function PasswordCard({ siteName, id, passwordValue, secretToken }: PasswordItem) {
  const [otp, setOtp] = useState('');
  const [expires, setExpires] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const generateOTP = () => {
      const { otp, expires } = TOTP.generate('JBSWY3DPEHPK3PXP');
      setOtp(otp);
      setExpires(expires);

      const timeUntilExpiry = expires - Date.now();
      setTimeout(() => {
        generateOTP();
      }, timeUntilExpiry);
    };

    generateOTP();
  }, []);

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
        <Button variant="secondary" className="w-full">
          Copy Password
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigator.clipboard.writeText('asd')}
        >
          Edit
        </Button>
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
              <Button variant="destructive" onClick={() => alert('Delete action triggered')}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
