'use client';

import { cn } from '@/app/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { TOTP } from 'totp-generator';

export function PasswordCard() {
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
    <Card className="w-full max-w-sm">
      <CardHeader>Website name</CardHeader>
      <CardContent>
        2FA code: {otp}
        <div className="w-full h-2 bg-gray-100 relative">
          <div
            className="h-2 bg-primary absolute top-0 left-0 transition-all duration-200 ease-in-out"
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
        <Button variant="outline" className="w-full">
          Edit
        </Button>
        <Button variant="destructive" className="w-full">
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
