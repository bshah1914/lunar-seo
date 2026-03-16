import React, { useState, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Zap,
  Brain,
  Shield,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  Settings,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Eye,
  Globe,
  FileText,
  Link2,
  Share2,
  BarChart3,
  DollarSign,
  Users,
  Search,
  Megaphone,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Activity,
  Cpu,
  Layers,
  Award,
  Wrench,
  PenTool,
  Hash,
  ExternalLink,
  AlertCircle,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const API = '/api/v1';
const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export default function SEOByAI() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [actionPlan, setActionPlan] = useState<any>(null);
  const [strategy, setStrategy] = useState<any>(null);
  const [predictions, setPredictions] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("insights");

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

  const fetchData = () => {
    if (!selectedClient) return;
    setLoading(true);
    Promise.all([
      fetch(`${API}/seo-by-ai/${selectedClient}/status`, { headers: getHeaders() }).then(r => r.json()).catch(() => null),
      fetch(`${API}/seo-by-ai/${selectedClient}/action-plan`, { headers: getHeaders() }).then(r => r.json()).catch(() => null),
      fetch(`${API}/seo-by-ai/${selectedClient}/strategy`, { headers: getHeaders() }).then(r => r.json()).catch(() => null),
      fetch(`${API}/seo-by-ai/${selectedClient}/predictions`, { headers: getHeaders() }).then(r => r.json()).catch(() => null),
    ]).then(([statusRes, actionRes, strategyRes, predictionsRes]) => {
      setStatus(statusRes);
      setActionPlan(actionRes);
      setStrategy(strategyRes);
      setPredictions(predictionsRes);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [selectedClient]);

  const insights = status?.ai_insights || status?.insights || [];
  const lifetimeStats = status?.lifetime_stats || {};
  const aiAgent = status?.ai_agent || {};
  const activeMonitors = status?.active_monitors || [];

  // action_plan.categories is an object like {technical_seo: {actions: [...]}, content: {...}, ...}
  const actionCategoriesObj = actionPlan?.categories || {};
  const actionCategories = Object.entries(actionCategoriesObj).map(([key, val]: [string, any]) => ({
    id: key,
    name: key.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
    icon: val?.icon || 'wrench',
    total: val?.total || val?.actions?.length || 0,
    completed: val?.completed || val?.actions?.filter((a: any) => a.status === 'completed').length || 0,
    actions: val?.actions || [],
  }));

  const strategyMatrix = strategy?.priority_matrix || [];
  const channelStrategy = strategy?.channel_strategy || {};
  const channelAllocation = Object.entries(channelStrategy).map(([key, val]: [string, any]) => ({
    name: key.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
    allocation: val?.allocation || 0,
    focus: val?.focus || '',
  }));
  const forecast90 = strategy?.['90_day_forecast'] || {};

  const trafficForecast = predictions?.traffic_forecast || [];
  const keywordPredictions = predictions?.keyword_predictions || [];
  const riskAlerts = predictions?.risk_alerts || [];

  const hasData = insights.length > 0 || actionCategories.length > 0 || strategyMatrix.length > 0 || trafficForecast.length > 0 || !!status;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
              <Brain className="h-6 w-6 text-white" />
            </div>
            SEO by AI
          </h1>
          <p className="text-sm text-muted-foreground mt-1">AI-powered SEO intelligence, strategy, and predictions</p>
        </div>
        <div className="flex gap-2">
          {clients.length > 0 && (
            <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          <Button variant="outline" onClick={fetchData}><RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh</Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
        </div>
      )}

      {!loading && !hasData && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Brain className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No AI analysis data yet</h3>
          <p className="mt-1 text-sm text-gray-500">Select a client and run AI analysis to get insights, strategy, and predictions.</p>
        </div>
      )}

      {!loading && hasData && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="action-plan">Action Plan</TabsTrigger>
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>

          {/* Insights Tab */}
          <TabsContent value="insights" className="mt-6 space-y-6">
            {insights.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">AI-Generated Insights</h2>
                {insights.map((insight: any, idx: number) => {
                  const typeColors: Record<string, string> = {
                    opportunity: 'border-l-green-500',
                    threat: 'border-l-red-500',
                    success: 'border-l-blue-500',
                    recommendation: 'border-l-yellow-500',
                  };
                  const typeBadgeColors: Record<string, string> = {
                    opportunity: 'bg-green-100 text-green-800',
                    threat: 'bg-red-100 text-red-800',
                    success: 'bg-blue-100 text-blue-800',
                    recommendation: 'bg-yellow-100 text-yellow-800',
                  };
                  return (
                  <Card key={idx} className={`border-l-4 ${typeColors[insight.type] || 'border-l-blue-500'}`}>
                    <CardContent className="py-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          {insight.type === "opportunity" && <Target className="h-5 w-5 text-green-500" />}
                          {insight.type === "threat" && <Shield className="h-5 w-5 text-red-500" />}
                          {insight.type === "success" && <TrendingUp className="h-5 w-5 text-blue-500" />}
                          {insight.type === "recommendation" && <Sparkles className="h-5 w-5 text-yellow-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={typeBadgeColors[insight.type] || 'bg-gray-100 text-gray-800'}>{insight.type?.charAt(0).toUpperCase() + insight.type?.slice(1)}</Badge>
                            {insight.confidence && <span className="text-xs text-muted-foreground">{Math.round(insight.confidence * 100)}% confidence</span>}
                          </div>
                          <p className="text-sm text-gray-700">{insight.message || insight.text}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            )}

            {/* Lifetime Stats */}
            {Object.keys(lifetimeStats).length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-purple-600">{lifetimeStats.total_actions_executed || 0}</p><p className="text-xs text-muted-foreground mt-1">Actions Taken</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{lifetimeStats.success_rate || 0}%</p><p className="text-xs text-muted-foreground mt-1">Success Rate</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">{lifetimeStats.traffic_increase_pct || 0}%</p><p className="text-xs text-muted-foreground mt-1">Traffic Increase</p></CardContent></Card>
                <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-orange-600">{lifetimeStats.estimated_value_created || '$0'}</p><p className="text-xs text-muted-foreground mt-1">Value Created</p></CardContent></Card>
              </div>
            )}

            {status?.overall_score != null && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-5 text-center">
                    <p className="text-sm text-muted-foreground">Overall AI Score</p>
                    <p className="text-4xl font-bold text-purple-600 mt-2">{status.overall_score}</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Action Plan Tab */}
          <TabsContent value="action-plan" className="mt-6 space-y-6">
            {actionCategories.length > 0 ? (
              actionCategories.map((cat: any, idx: number) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      {cat.name}
                      <Badge variant="secondary">{cat.completed || 0}/{cat.total || 0}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={cat.total > 0 ? (cat.completed / cat.total) * 100 : 0} className="mb-4 h-2" />
                    <div className="space-y-2">
                      {(cat.actions || []).map((action: any, aidx: number) => (
                        <div key={aidx} className="flex items-center gap-3 py-2 border-b last:border-0">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${action.status === 'completed' ? 'border-green-500 bg-green-500' : action.status === 'approval' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 bg-white'}`}>
                            {action.status === 'completed' && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                          <span className={`text-sm flex-1 ${action.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>{action.text}</span>
                          <Badge variant="outline" className="text-xs">{action.priority}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Wrench className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No action plan available</h3>
                <p className="mt-1 text-sm text-gray-500">AI will generate an action plan once analysis is complete.</p>
              </div>
            )}
          </TabsContent>

          {/* Strategy Tab */}
          <TabsContent value="strategy" className="mt-6 space-y-6">
            {strategyMatrix.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Priority Matrix</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-medium text-muted-foreground">Action</th>
                          <th className="text-center py-3 px-2 font-medium text-muted-foreground">Impact</th>
                          <th className="text-center py-3 px-2 font-medium text-muted-foreground">Effort</th>
                          <th className="text-center py-3 px-2 font-medium text-muted-foreground">Timeline</th>
                          <th className="text-right py-3 px-2 font-medium text-muted-foreground">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {strategyMatrix.map((item: any, idx: number) => (
                          <tr key={idx} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-2 font-medium">{item.action}</td>
                            <td className="py-3 px-2 text-center"><Badge>{item.impact}</Badge></td>
                            <td className="py-3 px-2 text-center">{item.effort}</td>
                            <td className="py-3 px-2 text-center">{item.timeline}</td>
                            <td className="py-3 px-2 text-right font-semibold text-green-600">{item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {channelAllocation.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Channel Allocation</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={channelAllocation} cx="50%" cy="50%" innerRadius={60} outerRadius={120} dataKey="value" nameKey="name" label={({ name, value }: any) => `${name}: ${value}%`}>
                        {channelAllocation.map((entry: any, idx: number) => (
                          <Cell key={idx} fill={entry.color || `hsl(${idx * 50}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {strategyMatrix.length === 0 && channelAllocation.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Layers className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No strategy data available</h3>
                <p className="mt-1 text-sm text-gray-500">AI will generate strategy recommendations once analysis is complete.</p>
              </div>
            )}
          </TabsContent>

          {/* Predictions Tab */}
          <TabsContent value="predictions" className="mt-6 space-y-6">
            {trafficForecast.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {trafficForecast.map((card: any, idx: number) => (
                  <Card key={idx}>
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-muted-foreground">{card.label}</p>
                      <p className="text-lg font-bold mt-1">{card.current}</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600">{card.change}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Predicted: {card.predicted}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {trafficForecast.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Traffic Forecast</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trafficForecast}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="actual" stroke="#6366f1" fill="#818cf8" fillOpacity={0.3} name="Actual" />
                      <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" fill="#a78bfa" fillOpacity={0.2} name="Predicted" strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {keywordPredictions.length > 0 && (
              <Card>
                <CardHeader><CardTitle>Keyword Ranking Predictions</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 font-medium text-muted-foreground">Keyword</th>
                          <th className="text-center py-3 px-2 font-medium text-muted-foreground">Current</th>
                          <th className="text-center py-3 px-2 font-medium text-muted-foreground">Predicted</th>
                          <th className="text-center py-3 px-2 font-medium text-muted-foreground">Confidence</th>
                          <th className="text-right py-3 px-2 font-medium text-muted-foreground">Volume</th>
                        </tr>
                      </thead>
                      <tbody>
                        {keywordPredictions.map((kw: any, idx: number) => (
                          <tr key={idx} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-2 font-medium">{kw.keyword}</td>
                            <td className="py-3 px-2 text-center">#{kw.current}</td>
                            <td className="py-3 px-2 text-center text-green-600 font-semibold">#{kw.predicted}</td>
                            <td className="py-3 px-2 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Progress value={kw.confidence} className="w-16 h-2" />
                                <span className="text-xs">{kw.confidence}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-2 text-right">{(kw.volume || 0).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {trafficForecast.length === 0 && trafficForecast.length === 0 && keywordPredictions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Activity className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No predictions available</h3>
                <p className="mt-1 text-sm text-gray-500">AI will generate predictions once enough historical data is collected.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
