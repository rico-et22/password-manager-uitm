import { auth, signOut } from 'app/auth';
import Image from 'next/image';
import uitm_logo from '@/app/assets/utim_logo.png';
import { Button } from '@/components/ui/button';

export default async function ProtectedPage() {
  let session = await auth();

  return (
    <>
      <header className="relative flex items-center justify-between bg-white shadow-md px-3 md:px-6 py-3 h-24">
        <p className="">Welcome, {session?.user?.firstName}</p>
        <Image
          src={uitm_logo}
          alt="Password Manager Logo"
          className="w-28 absolute left-1/2 -translate-x-1/2"
          priority
        />
        <SignOut />
      </header>
      <main className=" p-3 md:p-6">Content here</main>
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
      <Button type="submit" variant="outline">
        Sign out
      </Button>
    </form>
  );
}
