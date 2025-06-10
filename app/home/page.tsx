import { auth, signOut } from 'app/auth';
import Image from 'next/image';
import uitm_logo from '@/app/assets/utim_logo.png';
import { Button } from '@/components/ui/button';
import { PasswordCard } from '@/components/ui/passwordCard';
import { AddPassword } from '@/components/passwords/add-password';

export default async function ProtectedPage() {
  let session = await auth();

  return (
    <>
      <header className="relative flex items-center justify-between bg-white shadow-md px-3 md:px-6 py-3 h-24">
        <p className="max-w-[30%]">Welcome, {session?.user?.firstName}</p>
        <Image
          src={uitm_logo}
          alt="Password Manager Logo"
          className="w-28 absolute left-1/2 -translate-x-1/2"
          priority
        />
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <AddPassword />
          <SignOut />
        </div>
      </header>
      <main className="min-h-[80vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 grid-rows-auto">
          <PasswordCard />
          <PasswordCard />
          <PasswordCard />
          <PasswordCard />
          <PasswordCard />
        </div>
      </main>
      <footer className="text-center text-sm text-gray-500 mt-4 border-t pt-4">
        Created by: Kamil Pawlak w69831, Jakub Karaś w70844, Miłosz Makiel w69817 <br />
        React + Next + TypeScript + Tailwind CSS + Radix UI + Prisma + Neon PostgreSQL +
        totp-generator
      </footer>
    </>
  );
}

function SignOut() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <Button type="submit" variant="outline" className="w-full">
        Sign out
      </Button>
    </form>
  );
}
