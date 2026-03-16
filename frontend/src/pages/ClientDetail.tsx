import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Globe,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Link2,
  BarChart3,
  Target,
  Shield,
  ArrowLeft,
  Palette,
  Type,
  Crosshair,
  Users,
} from 'lucide-react'

const API = '/api/v1';
const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

const tabs = ['Overview', 'SEO', 'Keywords', 'Backlinks', 'Content', 'Campaigns', 'Reports'] as const
type Tab = (typeof tabs)[number]

// ---------------------------------------------------------------------------
// Client Detail Page
// ---------------------------------------------------------------------------

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [loading, setLoading] = useState(true)
  const [clientData, setClientData] = useState<any>(null)
  const [dashboard, setDashboard] = useState<any>(null)

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetch(`${API}/clients/${id}`, { headers: getHeaders() }).then(r => r.json()).catch(() => null),
      fetch(`${API}/clients/${id}/dashboard`, { headers: getHeaders() }).then(r => r.json()).catch(() => null),
    ]).then(([clientRes, dashboardRes]) => {
      setClientData(clientRes);
      setDashboard(dashboardRes);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Client not found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              The requested client could not be loaded.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const overviewStats = dashboard?.stats || [];
  const trafficHistory = dashboard?.traffic_history || [];
  const recentKeywords = dashboard?.recent_keywords || [];
  const brandKit = dashboard?.brand_kit || { colors: [], fonts: [], goals: [] };
  const competitors = dashboard?.competitors || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </button>

        {/* Client Header */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 text-xl font-bold text-white">
                {clientData.avatar || clientData.name?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {clientData.name}
                  </h1>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {clientData.status || 'active'}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5" />
                    {clientData.domain}
                    <ExternalLink className="h-3 w-3" />
                  </span>
                  {clientData.industry && <span>{clientData.industry}</span>}
                  {clientData.joinedDate && <span>Client since {clientData.joinedDate}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                Edit Client
              </button>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                Run Audit
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex gap-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium transition ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content - Overview */}
        {activeTab === 'Overview' && (
          <div className="space-y-8">
            {/* Stats Row */}
            {overviewStats.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {overviewStats.map((stat: any) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </p>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    {stat.change && (
                      <p className="mt-1 flex items-center text-sm text-emerald-600">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        {stat.change} vs last month
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Traffic Chart */}
            {trafficHistory.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Organic Traffic
                </h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trafficHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#f9fafb',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="traffic"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Recent Keywords + Brand Kit */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Recent Keywords */}
              {recentKeywords.length > 0 && (
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Keywords
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Keyword</th>
                          <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Pos</th>
                          <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Change</th>
                          <th className="pb-3 font-medium text-gray-500 dark:text-gray-400">Volume</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {recentKeywords.map((kw: any) => (
                          <tr key={kw.keyword} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="py-2.5 font-medium text-gray-900 dark:text-white">
                              {kw.keyword}
                            </td>
                            <td className="py-2.5">
                              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                #{kw.position}
                              </span>
                            </td>
                            <td className="py-2.5">
                              {kw.change > 0 ? (
                                <span className="flex items-center text-emerald-600">
                                  <TrendingUp className="mr-1 h-3 w-3" />+{kw.change}
                                </span>
                              ) : kw.change < 0 ? (
                                <span className="flex items-center text-rose-600">
                                  <TrendingDown className="mr-1 h-3 w-3" />{kw.change}
                                </span>
                              ) : (
                                <span className="text-gray-400">--</span>
                              )}
                            </td>
                            <td className="py-2.5 text-gray-600 dark:text-gray-300">
                              {(kw.volume || 0).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Brand Kit + Competitors */}
              <div className="space-y-6">
                {(brandKit.colors?.length > 0 || brandKit.fonts?.length > 0 || brandKit.goals?.length > 0) && (
                  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                      Brand Kit
                    </h2>
                    {brandKit.colors?.length > 0 && (
                      <div className="mb-5">
                        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Palette className="h-4 w-4" /> Brand Colors
                        </p>
                        <div className="flex gap-2">
                          {brandKit.colors.map((color: string) => (
                            <div key={color} className="group relative">
                              <div
                                className="h-10 w-10 rounded-lg border border-gray-200 shadow-sm dark:border-gray-600"
                                style={{ backgroundColor: color }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {brandKit.fonts?.length > 0 && (
                      <div className="mb-5">
                        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Type className="h-4 w-4" /> Fonts
                        </p>
                        <div className="flex gap-2">
                          {brandKit.fonts.map((font: string) => (
                            <span
                              key={font}
                              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                            >
                              {font}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {brandKit.goals?.length > 0 && (
                      <div>
                        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <Crosshair className="h-4 w-4" /> Goals
                        </p>
                        <ul className="space-y-2">
                          {brandKit.goals.map((goal: string) => (
                            <li
                              key={goal}
                              className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                              {goal}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {competitors.length > 0 && (
                  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                      <Users className="h-5 w-5" /> Competitors
                    </h2>
                    <div className="space-y-3">
                      {competitors.map((comp: any) => (
                        <div
                          key={comp.name}
                          className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-700"
                        >
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{comp.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{comp.domain}</p>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="text-center">
                              <p className="font-semibold text-gray-900 dark:text-white">{comp.da}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">DA</p>
                            </div>
                            <div className="text-center">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {comp.traffic}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Traffic</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Empty state when no dashboard data */}
            {overviewStats.length === 0 && trafficHistory.length === 0 && recentKeywords.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <BarChart3 className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No dashboard data yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Run an audit or add keywords to start collecting data for this client.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'Overview' && (
          <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-3 text-lg font-medium text-gray-900 dark:text-white">{activeTab}</p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                This section is under development.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
