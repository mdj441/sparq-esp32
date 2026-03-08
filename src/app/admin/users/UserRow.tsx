'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SafeUser } from '@/lib/users';
import { Button } from '@/components/ui/Button';

export function UserRow({ user, isSelf }: { user: SafeUser; isSelf: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`למחוק את "${user.name}"?`)) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = user.role === 'admin' ? 'מנהל' : 'משתמש';
  const roleClass =
    user.role === 'admin'
      ? 'bg-indigo-100 text-indigo-700'
      : 'bg-gray-100 text-gray-600';

  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-0">
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-gray-800 text-sm">{user.name}</span>
        <span className="text-gray-400 text-xs" dir="ltr">
          {user.email}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleClass}`}>
          {roleLabel}
        </span>
        {!isSelf && (
          <Button variant="danger" size="sm" loading={loading} onClick={handleDelete}>
            מחיקה
          </Button>
        )}
        {isSelf && <span className="text-xs text-gray-400">(אתה)</span>}
      </div>
    </div>
  );
}
