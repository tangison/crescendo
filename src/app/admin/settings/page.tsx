'use client';

import { useState, useEffect } from 'react';

interface Setting {
  _id: string;
  key: string;
  value: string;
  group: string;
  description?: string;
  isPublic: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchSettings = async () => {
    const res = await fetch('https://academic-wombat-389.convex.cloud/api/query', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: 'admin.js:adminGetSettings', args: {}, format: 'json' }),
    });
    const json = await res.json();
    setSettings(json.value || []);
    setLoading(false);
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleSave = async (key: string, value: string) => {
    setSaving(key);
    await fetch('https://academic-wombat-389.convex.cloud/api/mutation', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: 'admin.js:adminUpdateSetting', args: { key, value }, format: 'json' }),
    });
    setSaving(null);
    fetchSettings();
  };

  if (loading) {
    return <div className="text-center py-12"><div className="size-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  }

  const grouped = settings.reduce((acc, s) => {
    if (!acc[s.group]) acc[s.group] = [];
    acc[s.group].push(s);
    return acc;
  }, {} as Record<string, Setting[]>);

  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight mb-6">Site Settings</h1>
      {Object.entries(grouped).map(([group, items]) => (
        <div key={group} className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3">{group}</h2>
          <div className="space-y-3">
            {items.map(s => (
              <div key={s._id} className="bg-card border border-border rounded-2xl p-4">
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  {s.description || s.key}
                </label>
                <div className="flex gap-2">
                  <input
                    defaultValue={s.value}
                    onBlur={e => { if (e.target.value !== s.value) handleSave(s.key, e.target.value); }}
                    className="flex-1 px-3 py-2 rounded-full border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                  {saving === s.key && <span className="text-xs text-brand-accent self-center">Saving...</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
