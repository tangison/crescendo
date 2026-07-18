'use client';

import { useState } from 'react';

export default function ComingSoonPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'tangi' && password === '12345a') {
      // Set cookie (server-readable by middleware) + localStorage (client-side check)
      document.cookie = 'crescendo-auth=true; path=/; max-age=86400'; // 24 hours
      localStorage.setItem('crescendo-auth', 'true');
      window.location.href = '/';
    } else {
      setError('Invalid credentials');
      setPassword('');
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative">
      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-md">
        {/* Big logo + wordmark */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <img
            src="/branding/crescendo-logo.webp"
            alt="Crescendo Namibia"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
          />
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Crescendo
          </h1>
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-brand-accent">
            Namibia
          </p>
        </div>

        {/* Coming soon message */}
        <div className="space-y-3 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            We&apos;ll Be Right Back
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm">
            Crescendo Namibia is getting a refresh. Our updated catalog will be
            live soon. For urgent enquiries, reach us below.
          </p>
        </div>

        {/* Contact options */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <a
            href="https://wa.me/264814623936?text=Hi%20Crescendo%21%20I%20have%20an%20urgent%20enquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <button className="w-full px-6 py-3 rounded-full border border-border bg-background hover:bg-accent text-sm font-medium transition-colors">
              WhatsApp
            </button>
          </a>
          <a href="mailto:info@crescendona.com" className="w-full sm:w-auto">
            <button className="w-full px-6 py-3 rounded-full border border-border bg-background hover:bg-accent text-sm font-medium transition-colors">
              Email
            </button>
          </a>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          +264 81 462 3936 · info@crescendona.com
        </p>
      </div>

      {/* Small admin icon — fixed to the right side */}
      <button
        onClick={() => setShowLogin(true)}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 size-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors cursor-pointer"
        aria-label="Site Admin"
        title="Site Admin"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground/50 hover:text-foreground transition-colors"
        >
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        </svg>
      </button>

      {/* Login popup */}
      {showLogin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowLogin(false)}
        >
          <div
            className="bg-background rounded-lg border border-border shadow-lg p-6 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-center mb-1">Site Admin</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Enter your credentials to access the site
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  required
                  className="w-full px-4 py-2 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                  required
                  className="w-full px-4 py-2 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Access Site
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
