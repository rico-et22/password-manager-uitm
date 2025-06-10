'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function AddPassword() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ siteName: '', email: '', passwordValue: '' });
  const router = useRouter();
  //TODO: make it all less dirty + validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/passwords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to create password');
      toast.success('Password added!');
      setOpen(false);
      router.refresh(); // Optional: reload data if you're SSR'ing
    } catch (err) {
      toast.error('Something went wrong');
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Add Password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="siteName" placeholder="Site name" onChange={handleChange} required />
          <Input name="email" placeholder="Email" onChange={handleChange} required />
          <Input
            name="passwordValue"
            placeholder="Password"
            type="password"
            onChange={handleChange}
            required
          />
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
