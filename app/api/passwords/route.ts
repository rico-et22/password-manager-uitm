import { auth } from '@/app/auth';
import { createPassword, listPasswords } from '@/app/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const passwords = await listPasswords(session.user.id);
  return NextResponse.json(passwords);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { siteName, email, passwordValue } = await req.json();

  if (!siteName || !email || !passwordValue) {
    return new NextResponse('Missing fields', { status: 400 });
  }

  const created = await createPassword(session.user.id, siteName, email, passwordValue);
  return NextResponse.json(created);
}
