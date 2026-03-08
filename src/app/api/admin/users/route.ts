import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { listUsers, createUser } from '@/lib/users';
import { z } from 'zod';

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { session };
}

export async function GET() {
  const check = await requireAdmin();
  if (check.error) return check.error;
  const users = await listUsers();
  return NextResponse.json({ users });
}

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  password: z.string().min(8),
  role: z.enum(['admin', 'user']).default('user'),
});

export async function POST(request: Request) {
  const check = await requireAdmin();
  if (check.error) return check.error;

  const body = await request.json();
  const parsed = CreateUserSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'פרטים לא תקינים' }, { status: 400 });
  }

  try {
    const user = await createUser(parsed.data);
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === 'USER_EXISTS') {
      return NextResponse.json({ error: 'משתמש עם אימייל זה כבר קיים' }, { status: 409 });
    }
    return NextResponse.json({ error: 'שגיאה ביצירת המשתמש' }, { status: 500 });
  }
}
