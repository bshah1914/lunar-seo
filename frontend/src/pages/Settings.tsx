import React, { useState, useEffect } from 'react'
import {
  User,
  Building2,
  Plug,
  Bell,
  Key,
  Camera,
  Copy,
  Trash2,
  Plus,
  Check,
  X,
  RefreshCw,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types & Static Data
// ---------------------------------------------------------------------------

const API = '/api/v1';
const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

type SettingsTab = 'Profile' | 'Agency' | 'Integrations' | 'Notifications' | 'API Keys'

const settingsTabs: { label: SettingsTab; icon: React.ElementType }[] = [
  { label: 'Profile', icon: User },
  { label: 'Agency', icon: Building2 },
  { label: 'Integrations', icon: Plug },
  { label: 'Notifications', icon: Bell },
  { label: 'API Keys', icon: Key },
]

const integrations = [
  { name: 'Google Ads', description: 'Manage PPC campaigns and bidding', connected: false, icon: '🔍' },
  { name: 'Facebook Ads', description: 'Social media advertising campaigns', connected: false, icon: '📘' },
  { name: 'LinkedIn Ads', description: 'B2B advertising and lead generation', connected: false, icon: '💼' },
  { name: 'Google Analytics', description: 'Website traffic and behavior analytics', connected: false, icon: '📊' },
  { name: 'Google Search Console', description: 'Search performance and indexing', connected: false, icon: '🌐' },
]

const notificationSettings = [
  { id: 'seo_score', label: 'SEO Score Changes', description: 'Alert when any client SEO score changes by more than 5 points', enabled: true },
  { id: 'keyword_ranking', label: 'Keyword Ranking Changes', description: 'Notify when keywords enter or leave the first page', enabled: true },
  { id: 'backlink_new', label: 'New Backlinks Detected', description: 'Alert when new backlinks are discovered', enabled: false },
  { id: 'backlink_lost', label: 'Lost Backlinks', description: 'Alert when existing backlinks are lost', enabled: true },
  { id: 'crawl_errors', label: 'Crawl Errors', description: 'Notify about new crawl errors detected', enabled: true },
  { id: 'campaign_complete', label: 'Campaign Milestones', description: 'Alert when campaigns reach key milestones', enabled: false },
  { id: 'weekly_digest', label: 'Weekly Digest', description: 'Receive a weekly summary of all client metrics', enabled: true },
  { id: 'ai_content', label: 'AI Content Ready', description: 'Notify when AI-generated content is ready for review', enabled: true },
]

const apiKeys = [
  { id: '1', name: 'Production API Key', key: 'mk_prod_a3f8c92d...e4b1', created: 'Jan 15, 2026', lastUsed: '2 hours ago' },
  { id: '2', name: 'Development Key', key: 'mk_dev_7b2e41a0...9f3c', created: 'Feb 20, 2026', lastUsed: '5 days ago' },
]

// ---------------------------------------------------------------------------
// Settings Page
// ---------------------------------------------------------------------------

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('Profile')
  const [notifications, setNotifications] = useState(notificationSettings)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Profile state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const apiFetch = (url: string, options?: RequestInit) => {
    return fetch(url, { ...options, headers: { ...getHeaders(), ...options?.headers } })
      .then(r => {
        if (r.status === 401) { localStorage.removeItem('token'); window.location.href = '/login'; return null; }
        if (!r.ok) throw new Error(`Error: ${r.status}`);
        return r.json();
      });
  };

  // Fetch user profile on load
  useEffect(() => {
    setProfileLoading(true);
    apiFetch(`${API}/auth/me`)
      .then(d => {
        if (!d) return;
        const fullName = d.full_name || d.name || '';
        const parts = fullName.split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
        setEmail(d.email || '');
      })
      .catch((e) => setErrorMsg(e.message))
      .finally(() => setProfileLoading(false));
  }, []);

  const handleSaveProfile = () => {
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    const fullName = `${firstName} ${lastName}`.trim();
    const params = new URLSearchParams({ full_name: fullName, email });
    apiFetch(`${API}/auth/me?${params.toString()}`, { method: 'PUT' })
      .then((d) => {
        if (!d) return;
        setSuccessMsg('Profile saved successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
      })
      .catch((e) => setErrorMsg(e.message))
      .finally(() => setSaving(false));
  };

  function toggleNotification(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    )
  }

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '??';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage your account, agency, and integrations.
          </p>
        </div>

        {successMsg && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar Tabs */}
          <nav className="w-full shrink-0 lg:w-56">
            <ul className="flex gap-1 overflow-x-auto lg:flex-col">
              {settingsTabs.map(({ label, icon: Icon }) => (
                <li key={label}>
                  <button
                    onClick={() => setActiveTab(label)}
                    className={`flex w-full items-center gap-3 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                      activeTab === label
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="flex-1">
            {/* ---- Profile Tab ---- */}
            {activeTab === 'Profile' && (
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                    Profile Information
                  </h2>

                  {profileLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                    </div>
                  ) : (
                    <>
                      {/* Avatar */}
                      <div className="mb-6 flex items-center gap-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-2xl font-bold text-white">
                          {initials}
                        </div>
                        <div>
                          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                            <Camera className="h-4 w-4" />
                            Change Avatar
                          </button>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            JPG, PNG or GIF. Max 2MB.
                          </p>
                        </div>
                      </div>

                      {/* Name Fields */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="mt-4">
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Change Password */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                    Change Password
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ---- Agency Tab ---- */}
            {activeTab === 'Agency' && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                  Agency Settings
                </h2>

                {/* Logo */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-lg font-bold text-white">
                    MO
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                    <Camera className="h-4 w-4" />
                    Change Logo
                  </button>
                </div>

                {/* Agency Name */}
                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Agency Name
                  </label>
                  <input
                    type="text"
                    defaultValue="MarketingOS Agency"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Subscription Plan */}
                <div className="mb-6">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subscription Plan
                  </label>
                  <div className="flex items-center gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex-1">
                      <p className="font-semibold text-blue-700 dark:text-blue-400">Professional Plan</p>
                      <p className="text-sm text-blue-600/80 dark:text-blue-400/70">
                        Up to 50 clients, unlimited keywords, AI content generation
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">$199</p>
                      <p className="text-xs text-blue-600/80 dark:text-blue-400/70">per month</p>
                    </div>
                  </div>
                  <button className="mt-3 text-sm font-medium text-blue-600 transition hover:text-blue-500 dark:text-blue-400">
                    Upgrade Plan
                  </button>
                </div>

                <div className="flex justify-end">
                  <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* ---- Integrations Tab ---- */}
            {activeTab === 'Integrations' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Connected Services
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {integrations.map((integration) => (
                    <div
                      key={integration.name}
                      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{integration.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {integration.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {integration.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            integration.connected
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          }`}
                        >
                          {integration.connected ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          {integration.connected ? 'Connected' : 'Not Connected'}
                        </span>
                        <button
                          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                            integration.connected
                              ? 'border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:bg-gray-800 dark:text-rose-400 dark:hover:bg-rose-900/20'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {integration.connected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ---- Notifications Tab ---- */}
            {activeTab === 'Notifications' && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                  Notification Preferences
                </h2>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {notifications.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{setting.label}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {setting.description}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleNotification(setting.id)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          setting.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                            setting.enabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* ---- API Keys Tab ---- */}
            {activeTab === 'API Keys' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">API Keys</h2>
                  <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                    Generate New Key
                  </button>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="flex items-center justify-between p-5">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{apiKey.name}</p>
                          <div className="mt-1 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs dark:bg-gray-700">
                              {apiKey.key}
                            </code>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                            Created {apiKey.created} &middot; Last used {apiKey.lastUsed}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                            <RefreshCw className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg p-2 text-gray-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Usage Notice */}
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <strong>Important:</strong> API keys grant full access to your account. Never share them publicly or commit them to version control.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
