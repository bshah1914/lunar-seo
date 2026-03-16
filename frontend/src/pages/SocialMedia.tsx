import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import PageHeader from "@/components/layout/PageHeader";
import StatsCard from "@/components/layout/StatsCard";
import {
  Plus,
  Link2,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Heart,
  MessageCircle,
  Share2,
  Edit,
  Trash2,
  Send,
  Image,
  Video,
  Sparkles,
  Calendar,
  Upload,
  Clock,
  TrendingUp,
  Users,
  BarChart3,
  Eye,
} from "lucide-react";

const API = '/api/v1';
const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

function getStatusBadge(status: string) {
  switch (status) {
    case "published":
      return <Badge className="bg-green-100 text-green-700">Published</Badge>;
    case "scheduled":
      return <Badge className="bg-blue-100 text-blue-700">Scheduled</Badge>;
    case "draft":
      return <Badge className="bg-gray-100 text-gray-600">Draft</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export default function SocialMedia() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
      fetch(`${API}/social/${selectedClient}/accounts`, { headers: getHeaders() }).then(r => r.json()).catch(() => []),
      fetch(`${API}/social/${selectedClient}/posts`, { headers: getHeaders() }).then(r => r.json()).catch(() => []),
    ]).then(([acctRes, postsRes]) => {
      const accts = acctRes.accounts || acctRes || [];
      setAccounts(Array.isArray(accts) ? accts : []);
      const psts = postsRes.posts || postsRes || [];
      setPosts(Array.isArray(psts) ? psts : []);
    }).finally(() => setLoading(false));
  }, [selectedClient]);

  const [platformFilter, setPlatformFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = posts.filter((p: any) => {
    if (platformFilter !== "all" && p.platform !== platformFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Social Media">
        <div className="flex gap-2">
          {clients.length > 0 && (
            <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          <Button><Plus className="w-4 h-4 mr-2" /> Create Post</Button>
          <Button variant="outline"><Link2 className="w-4 h-4 mr-2" /> Connect Account</Button>
        </div>
      </PageHeader>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      )}

      {!loading && (
        <>
          {/* Connected Accounts */}
          {accounts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {accounts.map((acct: any, idx: number) => (
                <Card key={acct.id || idx} className="relative overflow-hidden">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{acct.platform}</p>
                      <p className="text-xs text-muted-foreground truncate">{acct.handle}</p>
                      {acct.followers && <p className="text-xs text-muted-foreground">{acct.followers} followers</p>}
                    </div>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${acct.connected ? "bg-green-500" : "bg-gray-300"}`} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Share2 className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No social posts yet</h3>
              <p className="mt-1 text-sm text-gray-500">Create your first social media post to get started.</p>
            </div>
          ) : (
            <>
              {/* Filter bar */}
              <div className="flex flex-wrap gap-3">
                <Select value={platformFilter} onValueChange={setPlatformFilter}>
                  <SelectTrigger className="w-[160px]"><SelectValue placeholder="Platform" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filtered.map((post: any) => (
                  <Card key={post.id}>
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className="bg-blue-600 w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0">
                        <Share2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-sm line-clamp-2">{post.content}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {post.scheduledDate && (
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.scheduledDate}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {getStatusBadge(post.status)}
                        {post.status === "published" && (
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.likes || 0}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.comments || 0}</span>
                            <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {post.shares || 0}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
