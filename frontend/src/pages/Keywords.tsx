import { useState, useEffect } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import StatsCard from '@/components/layout/StatsCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Key, Plus, Search, ArrowUp, ArrowDown, Minus, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const API = '/api/v1';
const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

function DifficultyBar({ value }: { value: number }) {
  const color = value < 30 ? 'bg-green-500' : value < 60 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-muted-foreground w-6">{value}</span>
    </div>
  )
}

function PositionChange({ current, previous }: { current: number; previous: number }) {
  const diff = previous - current
  if (diff > 0) return <span className="flex items-center text-green-600 text-sm"><ArrowUp className="h-3 w-3" />{diff}</span>
  if (diff < 0) return <span className="flex items-center text-red-600 text-sm"><ArrowDown className="h-3 w-3" />{Math.abs(diff)}</span>
  return <span className="flex items-center text-gray-400 text-sm"><Minus className="h-3 w-3" /></span>
}

export default function Keywords() {
  const [searchTerm, setSearchTerm] = useState('')
  const [clients, setClients] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState<string>('')
  const [keywords, setKeywords] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${API}/clients/`, { headers: getHeaders() })
      .then(r => r.json())
      .then(d => {
        const clientList = d.clients || d || [];
        const list = Array.isArray(clientList) ? clientList : [];
        setClients(list);
        if (list.length > 0) setSelectedClient(list[0].id);
      })
      .catch(() => setClients([]));
  }, []);

  useEffect(() => {
    if (!selectedClient) return;
    setLoading(true);
    fetch(`${API}/keywords/${selectedClient}/keywords`, { headers: getHeaders() })
      .then(r => r.json())
      .then(d => {
        const kwList = d.keywords || d || [];
        setKeywords(Array.isArray(kwList) ? kwList : []);
      })
      .catch(() => setKeywords([]))
      .finally(() => setLoading(false));
  }, [selectedClient]);

  if (clients.length === 0 && !loading) {
    return (
      <div>
        <PageHeader title="Keyword Intelligence" description="Track keyword rankings, discover opportunities, and monitor performance" />
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Key className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Select a client first</h3>
          <p className="mt-1 text-sm text-gray-500">Add a client to start tracking keywords.</p>
        </div>
      </div>
    );
  }

  const filtered = keywords.filter((k: any) => k.keyword?.toLowerCase().includes(searchTerm.toLowerCase()))
  const inTop10 = keywords.filter((k: any) => k.position <= 10).length
  const improved = keywords.filter((k: any) => k.position < (k.prevPosition || k.previous_position || k.position)).length
  const avgPosition = keywords.length > 0 ? (keywords.reduce((sum: number, k: any) => sum + (k.position || 0), 0) / keywords.length).toFixed(1) : '0'

  const distributionData = [
    { range: '1-3', count: keywords.filter((k: any) => k.position >= 1 && k.position <= 3).length, color: '#22c55e' },
    { range: '4-10', count: keywords.filter((k: any) => k.position >= 4 && k.position <= 10).length, color: '#3b82f6' },
    { range: '11-20', count: keywords.filter((k: any) => k.position >= 11 && k.position <= 20).length, color: '#eab308' },
    { range: '21-50', count: keywords.filter((k: any) => k.position >= 21 && k.position <= 50).length, color: '#f97316' },
  ]

  return (
    <div>
      <PageHeader
        title="Keyword Intelligence"
        description="Track keyword rankings, discover opportunities, and monitor performance"
        actions={
          <div className="flex gap-2">
            {clients.length > 0 && (
              <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
                {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
            <Button variant="outline"><Search className="h-4 w-4 mr-2" /> Research</Button>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Keywords</Button>
          </div>
        }
      />

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      )}

      {!loading && keywords.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Key className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No keywords tracked yet</h3>
          <p className="mt-1 text-sm text-gray-500">Add keywords to start tracking rankings.</p>
        </div>
      )}

      {!loading && keywords.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatsCard title="Total Keywords" value={keywords.length} icon={<Key className="h-5 w-5" />} />
            <StatsCard title="Avg Position" value={avgPosition} change={-8.5} trend="up" changeLabel="vs last month" />
            <StatsCard title="In Top 10" value={inTop10} change={15.2} trend="up" />
            <StatsCard title="Improved" value={improved} icon={<TrendingUp className="h-5 w-5" />} change={12} trend="up" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader><CardTitle>Ranking Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={distributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="count" nameKey="range" label={({ range, count }: any) => `${range}: ${count}`}>
                      {distributionData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Ranking Trend (Top Keyword)</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
                  Ranking history will appear once data is collected over time.
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tracked Keywords</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search keywords..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Keyword</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Position</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Change</th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">Volume</th>
                      <th className="text-center py-3 px-2 font-medium text-muted-foreground">Difficulty</th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">CPC</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">SERP Features</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((kw: any) => (
                      <tr key={kw.id || kw.keyword} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-2 font-medium">{kw.keyword}</td>
                        <td className="py-3 px-2 text-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${kw.position <= 3 ? 'bg-green-100 text-green-700' : kw.position <= 10 ? 'bg-blue-100 text-blue-700' : kw.position <= 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                            {kw.position}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center"><PositionChange current={kw.position} previous={kw.prevPosition || kw.previous_position || kw.position} /></td>
                        <td className="py-3 px-2 text-right">{(kw.volume || 0).toLocaleString()}</td>
                        <td className="py-3 px-2">{kw.difficulty != null && <DifficultyBar value={kw.difficulty} />}</td>
                        <td className="py-3 px-2 text-right">{kw.cpc != null ? `$${Number(kw.cpc).toFixed(2)}` : '-'}</td>
                        <td className="py-3 px-2">
                          <div className="flex gap-1 flex-wrap">
                            {(kw.serp || []).map((feature: string) => (
                              <Badge key={feature} variant="outline" className="text-xs whitespace-nowrap">{feature}</Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-xs text-muted-foreground max-w-[150px] truncate">{kw.url}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
