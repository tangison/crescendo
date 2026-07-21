'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface LegalPage { _id: string; slug: string; title: string; content: string; isPublished: boolean; version: string; }

export default function AdminLegalPage() {
  const pages = useQuery(api.admin.adminGetLegalPages, {});
  const updateLegalPage = useMutation(api.admin.adminUpdateLegalPage);
  const [editing, setEditing] = useState<LegalPage | null>(null);

  if (pages === undefined) {
    return <div className="text-center py-12"><div className="size-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  }

  if (editing) {
    return <LegalEditor page={editing} onClose={() => setEditing(null)} onSave={async (p, content, isPublished) => { await updateLegalPage({ id: p._id, content, isPublished }); setEditing(null); }} />;
  }

  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight mb-6">Legal Pages</h1>
      <div className="space-y-3">
        {pages.map((p: LegalPage) => (
          <div key={p._id} className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">{p.title}</h3>
              <p className="text-xs text-muted-foreground">/{p.slug} - {p.content ? `${p.content.length} chars` : 'Empty'}</p>
            </div>
            <button onClick={() => setEditing(p)} className="text-xs text-brand-accent hover:underline">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegalEditor({ page, onClose, onSave }: { page: LegalPage; onClose: () => void; onSave: (p: LegalPage, content: string, isPublished: boolean) => void }) {
  const [content, setContent] = useState(page.content);
  const [isPublished, setIsPublished] = useState(page.isPublished);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">{page.title}</h1>
        <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground">Back</button>
      </div>
      <textarea value={content} onChange={e => setContent(e.target.value)} rows={20} className="w-full px-4 py-3 rounded-2xl border border-border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-accent mb-4" placeholder="Write legal page content here..." />
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="rounded" /><span className="text-sm">Published</span></label>
        <button onClick={() => onSave(page, content, isPublished)} className="px-6 py-2 rounded-full bg-brand-accent text-brand-dark text-sm font-semibold hover:bg-brand-accent/90 transition-colors">Save</button>
      </div>
    </div>
  );
}
