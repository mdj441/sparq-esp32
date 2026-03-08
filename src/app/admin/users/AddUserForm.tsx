'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function AddUserForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'שגיאה לא ידועה');
      } else {
        setSuccess(`המשתמש "${name}" נוצר בהצלחה`);
        setEmail('');
        setName('');
        setPassword('');
        setRole('user');
        router.refresh();
      }
    } catch {
      setError('שגיאת רשת');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">הוספת משתמש חדש</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-indigo-400 outline-none text-sm transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-indigo-400 outline-none text-sm transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">סיסמה (לפחות 8 תווים)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-indigo-400 outline-none text-sm transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">הרשאה</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-indigo-400 outline-none text-sm transition-colors bg-white"
            >
              <option value="user">משתמש</option>
              <option value="admin">מנהל</option>
            </select>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        {success && <p className="text-green-600 text-sm font-medium">{success}</p>}
        <Button type="submit" loading={loading}>
          הוספת משתמש
        </Button>
      </form>
    </div>
  );
}
