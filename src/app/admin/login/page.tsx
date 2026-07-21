'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const adminPassword = useQuery(api.admin.adminGetPassword, {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = adminPassword || 'crescendo-admin-2026';
    if (password === correctPassword) {
      sessionStorage.setItem('crescendo-admin', 'true');
      router.push('/admin');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/branding/crescendo-logo.webp" alt="Crescendo" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-black text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-white/50 mt-1">Crescendo Namibia</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-white/60 block mb-2 uppercase tracking-wide">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus required className="w-full px-4 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all" placeholder="Enter admin password" />
          </div>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <button type="submit" disabled={adminPassword === undefined} className="w-full px-4 py-3 rounded-full bg-brand-accent hover:bg-brand-accent/90 text-brand-dark text-sm font-semibold transition-colors disabled:opacity-50">{adminPassword === undefined ? 'Loading...' : 'Sign In'}</button>
        </form>
        <p className="text-xs text-white/30 text-center mt-6">Authorized personnel only.</p>
      </div>
    </div>
  );
}
