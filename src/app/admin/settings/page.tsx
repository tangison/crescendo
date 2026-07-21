'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function AdminSettingsPage() {
  const settings = useQuery(api.admin.adminGetSettings, {});
  const updateSetting = useMutation(api.admin.adminUpdateSetting);
  const updatePassword = useMutation(api.admin.adminUpdatePassword);
  const [activeTab, setActiveTab] = useState<'business' | 'social' | 'security'>('business');
  const [saving, setSaving] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  const settingsMap: Record<string, string> = {};
  if (settings) {
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }
  }

  const handleSave = async (key: string, value: string) => {
    setSaving(key);
    await updateSetting({ key, value });
    setSaving(null);
  };

  const handleChangePassword = async () => {
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) { setPasswordMsg({ type: 'error', text: 'New passwords do not match' }); return; }
    if (newPassword.length < 8) { setPasswordMsg({ type: 'error', text: 'Password must be at least 8 characters' }); return; }
    setChangingPassword(true);
    try {
      await updatePassword({ currentPassword, newPassword });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully' });
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (e: any) {
      setPasswordMsg({ type: 'error', text: e.message || 'Failed to change password' });
    }
    setChangingPassword(false);
  };

  if (settings === undefined) {
    return <div className="text-center py-12"><div className="size-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  }

  const tabs = [{ id: 'business' as const, label: 'Business' }, { id: 'social' as const, label: 'Social' }, { id: 'security' as const, label: 'Security' }];
  const businessFields = [{ key: 'businessName', label: 'Business Name' }, { key: 'tagline', label: 'Tagline' }, { key: 'foundingYear', label: 'Founding Year' }, { key: 'email', label: 'Email' }, { key: 'whatsapp', label: 'WhatsApp' }, { key: 'telephone', label: 'Telephone' }, { key: 'address', label: 'Address' }, { key: 'openingHours', label: 'Opening Hours' }];
  const socialFields = [{ key: 'social_facebook', label: 'Facebook URL' }, { key: 'social_instagram', label: 'Instagram URL' }, { key: 'social_tiktok', label: 'TikTok URL' }, { key: 'social_youtube', label: 'YouTube URL' }];

  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight mb-6">Site Settings</h1>
      <div className="flex gap-1 mb-6 border-b border-border">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab.id ? 'text-foreground border-b-2 border-brand-accent -mb-px' : 'text-muted-foreground hover:text-foreground'}`}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'business' && (
        <div className="space-y-3">
          {businessFields.map(field => (
            <div key={field.key} className="bg-card border border-border rounded-2xl p-4">
              <label className="text-xs font-medium text-muted-foreground block mb-1">{field.label}</label>
              <div className="flex gap-2">
                <input defaultValue={settingsMap[field.key] || ''} onBlur={e => { if (e.target.value !== settingsMap[field.key]) handleSave(field.key, e.target.value); }} className="flex-1 px-3 py-2 rounded-full border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                {saving === field.key && <span className="text-xs text-brand-accent self-center">Saving...</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'social' && (
        <div className="space-y-3">
          {socialFields.map(field => (
            <div key={field.key} className="bg-card border border-border rounded-2xl p-4">
              <label className="text-xs font-medium text-muted-foreground block mb-1">{field.label}</label>
              <div className="flex gap-2">
                <input defaultValue={settingsMap[field.key] || ''} onBlur={e => { if (e.target.value !== settingsMap[field.key]) handleSave(field.key, e.target.value); }} className="flex-1 px-3 py-2 rounded-full border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent" />
                {saving === field.key && <span className="text-xs text-brand-accent self-center">Saving...</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="max-w-md">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-bold mb-1">Change Password</h2>
            <p className="text-sm text-muted-foreground mb-6">Update the admin dashboard password.</p>
            <div className="space-y-4">
              <div><label className="text-xs font-medium text-muted-foreground block mb-1">Current Password</label><input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full px-3 py-2 rounded-full border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent" /></div>
              <div><label className="text-xs font-medium text-muted-foreground block mb-1">New Password</label><input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-3 py-2 rounded-full border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent" /></div>
              <div><label className="text-xs font-medium text-muted-foreground block mb-1">Confirm New Password</label><input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 rounded-full border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent" /></div>
              {passwordMsg && <p className={`text-sm ${passwordMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{passwordMsg.text}</p>}
              <button onClick={handleChangePassword} disabled={!currentPassword || !newPassword || !confirmPassword || changingPassword} className="w-full px-4 py-2 rounded-full bg-brand-accent text-brand-dark text-sm font-semibold hover:bg-brand-accent/90 transition-colors disabled:opacity-50">{changingPassword ? 'Changing...' : 'Change Password'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
