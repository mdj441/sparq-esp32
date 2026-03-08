import { auth } from '@/auth';
import { listUsers } from '@/lib/users';
import { AddUserForm } from './AddUserForm';
import { UserRow } from './UserRow';
import { signOut } from '@/auth';

export default async function AdminUsersPage() {
  const [users, session] = await Promise.all([listUsers(), auth()]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-indigo-700 mb-1">ניהול משתמשים</h1>
            <p className="text-gray-500 text-sm">רק מנהל יכול להוסיף ולהסיר משתמשים</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/"
              className="text-sm text-indigo-600 hover:underline font-medium self-center"
            >
              חזרה לבית
            </a>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/login' });
              }}
            >
              <button
                type="submit"
                className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
              >
                יציאה
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          {users.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm">אין משתמשים עדיין</div>
          )}
          {users.map((user) => (
            <UserRow key={user.id} user={user} isSelf={user.id === session?.user?.id} />
          ))}
        </div>

        <AddUserForm />
      </div>
    </main>
  );
}
