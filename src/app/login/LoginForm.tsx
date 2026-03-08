'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError('אימייל או סיסמה שגויים');
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">כניסה</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            dir="ltr"
            className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-indigo-400 outline-none text-gray-800 text-sm transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">סיסמה</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            dir="ltr"
            className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-indigo-400 outline-none text-gray-800 text-sm transition-colors"
          />
        </div>
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          כניסה
        </Button>
      </form>
    </div>
  );
}
