import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageHeader from "@/components/layout/PageHeader";
import StatsCard from "@/components/layout/StatsCard";
import {
  Plus,
  DollarSign,
  Eye,
  MousePointerClick,
  TrendingUp,
  Target,
  Pause,
  Play,
  MoreHorizontal,
  Search,
  RefreshCw,
  Unplug,
  Zap,
  BarChart3,
  Megaphone,
} from "lucide-react";

const API = '/api/v1';
const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

function formatNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function statusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-700">Active</Badge>;
    case "paused":
      return <Badge className="bg-yellow-100 text-yellow-700">Paused</Badge>;
    case "ended":
      return <Badge className="bg-gray-100 text-gray-600">Ended</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export default function AdsManager() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [adAccounts, setAdAccounts] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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
    Promise.all([
      fetch(`${API}/ads/${selectedClient}/ads/accounts`, { headers: getHeaders() }).then(r => r.json()).catch(() => []),
      fetch(`${API}/ads/${selectedClient}/ads/campaigns`, { headers: getHeaders() }).then(r => r.json()).catch(() => []),
    ]).then(([acctRes, campRes]) => {
      const accts = acctRes.accounts || acctRes || [];
      setAdAccounts(Array.isArray(accts) ? accts : []);
      const camps = campRes.campaigns || campRes || [];
      setCampaigns(Array.isArray(camps) ? camps : []);
    }).finally(() => setLoading(false));
  }, [selectedClient]);

  const filtered = campaigns.filter((c: any) => {
    if (search && !c.name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (platformFilter !== "all" && c.platform !== platformFilter) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Ads Manager">
        <div className="flex gap-2">
          {clients.length > 0 && (
            <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          <Button><Plus className="w-4 h-4 mr-2" /> Create Campaign</Button>
        </div>
      </PageHeader>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      )}

      {!loading && campaigns.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Megaphone className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No ad campaigns yet</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first ad campaign to get started.</p>
        </div>
      )}

      {!loading && campaigns.length > 0 && (
        <>
          <Tabs defaultValue="campaigns">
            <TabsList>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="mt-4">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search campaigns..." className="pl-8 w-[220px]" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <Select value={platformFilter} onValueChange={setPlatformFilter}>
                    <SelectTrigger className="w-[150px]"><SelectValue placeholder="Platform" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="Google">Google</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="ended">Ended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Campaign</TableHead>
                            <TableHead>Platform</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Budget</TableHead>
                            <TableHead className="text-right">Spend</TableHead>
                            <TableHead className="text-right">Clicks</TableHead>
                            <TableHead className="text-right">Conversions</TableHead>
                            <TableHead className="text-right">ROAS</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered.map((c: any) => (
                            <TableRow key={c.id}>
                              <TableCell className="font-medium">{c.name}</TableCell>
                              <TableCell><Badge variant="secondary">{c.platform}</Badge></TableCell>
                              <TableCell>{statusBadge(c.status)}</TableCell>
                              <TableCell className="text-right">${(c.budget || 0).toLocaleString()}</TableCell>
                              <TableCell className="text-right">${(c.spend || 0).toLocaleString()}</TableCell>
                              <TableCell className="text-right">{formatNum(c.clicks || 0)}</TableCell>
                              <TableCell className="text-right">{(c.conversions || 0).toLocaleString()}</TableCell>
                              <TableCell className="text-right">{c.roas || 0}x</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="accounts" className="mt-4">
              {adAccounts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Zap className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No ad accounts connected</h3>
                  <p className="mt-1 text-sm text-gray-500">Connect your ad accounts to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {adAccounts.map((acct: any) => (
                    <Card key={acct.id}>
                      <CardContent className="p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center text-blue-600">
                            <Zap className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{acct.platform}</p>
                            <p className="text-xs text-muted-foreground font-mono">{acct.accountId || acct.account_id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${acct.connected ? "bg-green-500" : "bg-gray-300"}`} />
                          <span className="text-xs text-muted-foreground">{acct.connected ? "Connected" : "Disconnected"}</span>
                        </div>
                        {acct.lastSynced && <p className="text-xs text-muted-foreground">Last synced: {acct.lastSynced}</p>}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1"><RefreshCw className="w-3.5 h-3.5 mr-1" /> Sync Now</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
