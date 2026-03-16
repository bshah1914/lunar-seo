import React, { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  ScanSearch,
  Globe,
  TrendingUp,
  Target,
  Rocket,
  MoreVertical,
  Users,
} from 'lucide-react'

const API = '/api/v1';
const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ClientStatus = 'active' | 'paused' | 'archived'
type Industry = 'Technology' | 'E-commerce' | 'Healthcare' | 'Finance' | 'Sustainability' | 'SaaS'

interface Client {
  id: string
  name: string
  domain: string
  industry: Industry
  status: ClientStatus
  avatar: string
  seoScore: number
  keywordsTracked: number
  activeCampaigns: number
  organicTraffic: string
}

const industries: Industry[] = ['Technology', 'E-commerce', 'Healthcare', 'Finance', 'Sustainability', 'SaaS']
const statuses: ClientStatus[] = ['active', 'paused', 'archived']

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function statusStyles(status: ClientStatus) {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    case 'paused':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case 'archived':
      return 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
  }
}

function industryColor(industry: string) {
  const map: Record<string, string> = {
    Technology: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'E-commerce': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    Healthcare: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    Finance: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Sustainability: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    SaaS: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  }
  return map[industry] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
}

function scoreColor(score: number) {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 60) return 'text-amber-600 dark:text-amber-400'
  return 'text-rose-600 dark:text-rose-400'
}

// ---------------------------------------------------------------------------
// Clients Page
// ---------------------------------------------------------------------------

export default function Clients() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<ClientStatus | 'all'>('all')
  const [filterIndustry, setFilterIndustry] = useState<Industry | 'all'>('all')
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/clients/`, { headers: getHeaders() })
      .then(r => r.json())
      .then(d => {
        const clientList = d.clients || d || [];
        setClients(Array.isArray(clientList) ? clientList : []);
      })
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  }, [])

  const filtered = clients.filter((c) => {
    const matchName = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.domain?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = filterStatus === 'all' || c.status === filterStatus
    const matchIndustry = filterIndustry === 'all' || c.industry === filterIndustry
    return matchName && matchStatus && matchIndustry
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clients</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Manage and monitor all your client accounts.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Plus className="h-4 w-4" />
            Add Client
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients by name or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as ClientStatus | 'all')}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                <option value="all">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value as Industry | 'all')}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              <option value="all">All Industries</option>
              {industries.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        )}

        {/* Empty State */}
        {!loading && clients.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No clients yet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add your first client to get started with SEO management.
            </p>
          </div>
        )}

        {/* Client Cards Grid */}
        {!loading && clients.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((client) => (
              <div
                key={client.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                {/* Top Row: Avatar, Name, Status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white">
                      {client.avatar || client.name?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{client.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Globe className="h-3 w-3" />
                        {client.domain}
                      </div>
                    </div>
                  </div>
                  <button className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                {/* Badges */}
                <div className="mt-4 flex items-center gap-2">
                  {client.status && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusStyles(client.status)}`}>
                      {client.status}
                    </span>
                  )}
                  {client.industry && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${industryColor(client.industry)}`}>
                      {client.industry}
                    </span>
                  )}
                </div>

                {/* Key Metrics */}
                <div className="mt-5 grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-700">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Target className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <p className={`mt-1 text-lg font-bold ${scoreColor(client.seoScore || 0)}`}>
                      {client.seoScore || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SEO Score</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                      {client.keywordsTracked || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Keywords</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Rocket className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                    <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                      {client.activeCampaigns || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Campaigns</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
                  <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                  <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30">
                    <ScanSearch className="h-3.5 w-3.5" />
                    Audit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results from filter */}
        {!loading && clients.length > 0 && filtered.length === 0 && (
          <div className="mt-12 text-center">
            <Search className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No clients found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
