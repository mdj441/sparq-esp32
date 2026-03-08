import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'כניסה – ספארק',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <div className="text-6xl mb-3 select-none">⚡</div>
        <h1 className="text-4xl font-black text-indigo-700 mb-2">ספארק</h1>
        <p className="text-gray-500 text-sm">כניסה למערכת</p>
      </div>
      <Suspense fallback={<div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm h-48" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
