import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { deleteUser } from '@/lib/users';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { userId } = await params;

  if (userId === session.user.id) {
    return NextResponse.json({ error: 'לא ניתן למחוק את עצמך' }, { status: 400 });
  }

  try {
    await deleteUser(userId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'משתמש לא נמצא' }, { status: 404 });
  }
}
