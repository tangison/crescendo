'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ADMIN_PASSWORD = 'crescendo-admin-2026';

export function useAdminAuth() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authed = sessionStorage.getItem('crescendo-admin') === 'true';
    setIsAuthed(authed);
    setLoading(false);
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('crescendo-admin', 'true');
      setIsAuthed(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('crescendo-admin');
    setIsAuthed(false);
    router.push('/admin/login');
  };

  return { isAuthed, loading, login, logout };
}
