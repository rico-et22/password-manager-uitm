import { auth } from '@/app/auth';
import { deletePassword, updatePassword } from '@/app/db';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { siteName, email, passwordValue } = await req.json();
  const data = { siteName, email, passwordValue };

  const result = await updatePassword(session.user.id, parseInt(params.id), data);
  return NextResponse.json(result);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const result = await deletePassword(session.user.id, parseInt(params.id));
  return NextResponse.json(result);
}
