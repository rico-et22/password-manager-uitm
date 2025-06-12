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
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export function AddPassword() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ siteName: '', email: '', passwordValue: '' });
  const queryClient = useQueryClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/passwords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to create password');
      }

      toast.success('Password added!');

      setForm({ siteName: '', email: '', passwordValue: '' });
      setOpen(false);

      queryClient.invalidateQueries({ queryKey: ['passwords'] });
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="siteName"
            value={form.siteName}
            placeholder="Site name"
            onChange={handleChange}
            required
          />
          <Input
            name="email"
            value={form.email}
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <Input
            name="passwordValue"
            value={form.passwordValue}
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
