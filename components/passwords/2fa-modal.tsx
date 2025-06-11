'use client';

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
import { Button } from '@/components/ui/button';
import QRCode from 'react-qr-code';
import { useState } from 'react';

export default function TwoFAModal({ passwordId }: { passwordId: number }) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate2FA = async () => {
    setError(null);
    try {
      const res = await fetch(`/api/passwords/${passwordId}/generate-2fa`);
      if (!res.ok) throw new Error(await res.text());
      const { otpAuthUrl } = await res.json();
      setQrUrl(otpAuthUrl);
    } catch (e: any) {
      setError(e.message || 'Failed to generate 2FA');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Setup 2FA
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Setup Two-Factor Auth</DialogTitle>
          <DialogDescription>
            Click Generate to create a 2FA secret and scan the QR code.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Button onClick={generate2FA}>Generate QR Code</Button>
          {error && <p className="text-destructive">{error}</p>}
          {qrUrl && (
            <div className="flex justify-center p-4 bg-gray-50 rounded">
              <QRCode value={qrUrl} />
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
