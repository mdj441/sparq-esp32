import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/users';

export async function POST() {
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD are not set' },
      { status: 500 }
    );
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json({ message: 'Admin already exists', id: existing.id });
  }

  const admin = await createUser({ email, name: 'מנהל', password, role: 'admin' });
  return NextResponse.json({ message: 'Admin created', id: admin.id }, { status: 201 });
}
