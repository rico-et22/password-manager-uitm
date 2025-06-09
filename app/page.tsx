'use server';
import { auth } from './auth';

export default async function Page() {
  let session = await auth();

  // if session is not found, redirect to login using router
  if (!session) {
    const { redirect } = require('next/navigation');
    redirect('/login');
  }
  // if session is found, redirect to home
  else {
    const { redirect } = require('next/navigation');
    redirect('/home');
  }

  return <></>;
}
