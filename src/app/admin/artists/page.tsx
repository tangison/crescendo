'use client';

import { useState, useEffect } from 'react';

interface Artist {
  _id: string;
  name: string;
  profession: string;
  artistCategory?: string;
  shortBio?: string;
  fullBio?: string;
  image?: string;
  isPublished: boolean;
  isFeatured?: boolean;
  displayOrder: number;
  bookingMessage: string;
  genres?: string[];
  performanceTypes?: string[];
  location?: string;
  rateNote?: string;
  availabilityNote?: string;
  needsReview: boolean;
}

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Artist | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchArtists = async () => {
    setLoading(true);
    const res = await fetch('https://academic-wombat-389.convex.cloud/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: 'admin.js:adminGetArtists', args: {}, format: 'json' }),
    });
    const json = await res.json();
    setArtists(json.value || []);
    setLoading(false);
  };

  useEffect(() => { fetchArtists(); }, []);

  const handleSave = async (artist: Artist | null, data: Record<string, unknown>, isNew: boolean) => {
    const path = isNew ? 'admin.js:adminCreateArtist' : 'admin.js:adminUpdateArtist';
    const args = isNew ? data : { id: artist!._id, ...data };
    const res = await fetch('https://academic-wombat-389.convex.cloud/api/mutation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, args, format: 'json' }),
    });
    const json = await res.json();
    if (json.status === 'success') {
      setEditing(null);
      setCreating(false);
      fetchArtists();
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="size-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Artists</h1>
          <p className="text-sm text-muted-foreground">{artists.length} artist{artists.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="px-4 py-2 rounded-full bg-brand-accent text-brand-dark text-sm font-semibold hover:bg-brand-accent/90 transition-colors"
        >
          + Add Artist
        </button>
      </div>

      {artists.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <p className="text-muted-foreground mb-2">No artists yet</p>
          <p className="text-xs text-muted-foreground">Click "Add Artist" to create the first profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artists.map(a => (
            <div key={a._id} className="bg-card border border-border rounded-2xl overflow-hidden">
              {a.image && (
                <div className="aspect-[4/3] bg-secondary">
                  <img src={a.image} alt={a.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold">{a.name}</h3>
                    <p className="text-sm text-brand-accent">{a.profession}</p>
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    a.isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {a.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                {a.shortBio && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{a.shortBio}</p>}
                <button
                  onClick={() => setEditing(a)}
                  className="text-xs text-brand-accent hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <ArtistModal
          artist={editing}
          isNew={creating}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function ArtistModal({
  artist,
  isNew,
  onClose,
  onSave,
}: {
  artist: Artist | null;
  isNew: boolean;
  onClose: () => void;
  onSave: (artist: Artist | null, data: Record<string, unknown>, isNew: boolean) => void;
}) {
  const [name, setName] = useState(artist?.name || '');
  const [profession, setProfession] = useState(artist?.profession || '');
  const [shortBio, setShortBio] = useState(artist?.shortBio || '');
  const [fullBio, setFullBio] = useState(artist?.fullBio || '');
  const [image, setImage] = useState(artist?.image || '');
  const [isPublished, setIsPublished] = useState(artist?.isPublished || false);
  const [displayOrder, setDisplayOrder] = useState(artist?.displayOrder || 1);
  const [bookingMessage, setBookingMessage] = useState(artist?.bookingMessage || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const data: Record<string, unknown> = {
      name, profession, shortBio: shortBio || undefined, fullBio: fullBio || undefined,
      image: image || undefined, isPublished, displayOrder,
      bookingMessage: bookingMessage || `Hello Crescendo, I would like to enquire about booking ${name}.`,
    };
    if (isNew) {
      data.slug = slug;
    }
    await onSave(artist, data, isNew);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background rounded-2xl border border-border shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">{isNew ? 'Add Artist' : 'Edit Artist'}</h2>
            <button onClick={onClose} className="size-8 flex items-center justify-center rounded-full hover:bg-accent">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 rounded-full border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Profession</label>
              <input value={profession} onChange={e => setProfession(e.target.value)} placeholder="e.g. Saxophonist, Guitarist" className="w-full px-3 py-2 rounded-full border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Short Bio</label>
              <textarea value={shortBio} onChange={e => setShortBio(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Full Bio</label>
              <textarea value={fullBio} onChange={e => setFullBio(e.target.value)} rows={4} className="w-full px-3 py-2 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Image URL</label>
              <input value={image} onChange={e => setImage(e.target.value)} placeholder="/products/artists/..." className="w-full px-3 py-2 rounded-full border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Display Order</label>
                <input value={displayOrder} onChange={e => setDisplayOrder(parseInt(e.target.value) || 1)} type="number" className="w-full px-3 py-2 rounded-full border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent" />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="rounded" />
                  <span className="text-sm">Published</span>
                </label>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Booking Message</label>
              <input value={bookingMessage} onChange={e => setBookingMessage(e.target.value)} className="w-full px-3 py-2 rounded-full border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent" />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-accent transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving || !name || !profession} className="flex-1 px-4 py-2 rounded-full bg-brand-accent text-brand-dark text-sm font-semibold hover:bg-brand-accent/90 transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
