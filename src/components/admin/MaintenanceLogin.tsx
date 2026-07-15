'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

interface MaintenanceLoginProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MaintenanceLogin({ open, onOpenChange }: MaintenanceLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'tangi' && password === '12345a') {
      localStorage.setItem('crescendo-auth', 'true');
      onOpenChange(false);
      router.push('/');
      router.refresh();
    } else {
      setError('Invalid credentials');
      setPassword('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px] rounded-full p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-center text-lg font-bold tracking-tight">
            Site Admin
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Enter your credentials to access the site
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-xs font-medium text-muted-foreground">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              required
              className="rounded-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              required
              className="rounded-full"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          <Button type="submit" className="w-full rounded-full">
            Access Site
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
