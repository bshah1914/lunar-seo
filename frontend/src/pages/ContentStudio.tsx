import React, { useState, useEffect } from "react";
import {
  FileText,
  Sparkles,
  Trash2,
  Grid,
  List,
  PenTool,
  Search,
  Plus,
  Check,
  X,
  Eye,
  ChevronLeft,
  Tag,
  Mail,
  Megaphone,
  Layout,
  MessageSquare,
  Save,
  Send,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

const API = '/api/v1';
const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ContentType = "blog" | "landing-page" | "email" | "ad-copy" | "social";
type ContentStatus = "draft" | "review" | "published";
type Tone = "professional" | "casual" | "persuasive" | "educational" | "humorous";
type ContentLength = "short" | "medium" | "long";

interface ContentPiece {
  id: string;
  type: ContentType;
  title: string;
  body: string;
  seoScore: number;
  readabilityScore: number;
  status: ContentStatus;
  keywords: string[];
  createdAt: string;
  metaTitle: string;
  metaDescription: string;
}

interface SeoCheckItem {
  label: string;
  passed: boolean;
}

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------

const TYPE_CONFIG: Record<ContentType, { label: string; color: string; icon: React.ElementType }> = {
  blog: { label: "Blog", color: "bg-blue-100 text-blue-700", icon: FileText },
  "landing-page": { label: "Landing Page", color: "bg-purple-100 text-purple-700", icon: Layout },
  email: { label: "Email", color: "bg-amber-100 text-amber-700", icon: Mail },
  "ad-copy": { label: "Ad Copy", color: "bg-rose-100 text-rose-700", icon: Megaphone },
  social: { label: "Social Post", color: "bg-teal-100 text-teal-700", icon: MessageSquare },
};

const STATUS_COLOR: Record<ContentStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  review: "bg-yellow-100 text-yellow-700",
  published: "bg-green-100 text-green-700",
};

function seoChecklist(piece: ContentPiece): SeoCheckItem[] {
  return [
    { label: "Title tag optimized", passed: piece.metaTitle?.length > 0 && piece.metaTitle?.length <= 60 },
    { label: "Meta description present", passed: (piece.metaDescription?.length || 0) >= 50 },
    { label: "Keyword density (1-3%)", passed: piece.seoScore >= 70 },
    { label: "Heading structure (H1-H3)", passed: piece.readabilityScore >= 80 },
    { label: "Internal links included", passed: piece.type === "blog" || piece.type === "landing-page" },
    { label: "Image alt text present", passed: piece.seoScore >= 85 },
  ];
}

function SeoScoreMini({ score }: { score: number }) {
  const color = score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-500";
  return (
    <div className="relative inline-flex items-center justify-center w-10 h-10">
      <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15" fill="none" className="stroke-gray-200" strokeWidth="3" />
        <circle cx="18" cy="18" r="15" fill="none" className={color.replace("text-", "stroke-")} strokeWidth="3" strokeDasharray={`${(score / 100) * 94.2} 94.2`} strokeLinecap="round" />
      </svg>
      <span className={`absolute text-[10px] font-bold ${color}`}>{score}</span>
    </div>
  );
}

function ContentCard({ piece, viewMode, onEdit, onDelete }: { piece: ContentPiece; viewMode: "grid" | "list"; onEdit: (id: string) => void; onDelete: (id: string) => void; }) {
  const config = TYPE_CONFIG[piece.type] || TYPE_CONFIG.blog;
  const TypeIcon = config.icon;
  const preview = piece.body?.length > 100 ? piece.body.slice(0, 100) + "..." : piece.body || "";

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="flex items-center gap-4 py-3 px-4">
          <Badge className={`${config.color} shrink-0`}><TypeIcon className="w-3 h-3 mr-1" />{config.label}</Badge>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{piece.title}</p>
            <p className="text-xs text-gray-500 truncate">{preview}</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <SeoScoreMini score={piece.seoScore || 0} />
            <Badge className={STATUS_COLOR[piece.status] || STATUS_COLOR.draft} variant="secondary">{piece.status}</Badge>
            <span className="text-xs text-gray-400">{piece.createdAt}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge className={config.color}><TypeIcon className="w-3 h-3 mr-1" />{config.label}</Badge>
          <Badge className={STATUS_COLOR[piece.status] || STATUS_COLOR.draft} variant="secondary">{piece.status}</Badge>
        </div>
        <CardTitle className="text-sm font-semibold leading-tight mt-2">{piece.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between gap-3">
        <p className="text-xs text-gray-500 leading-relaxed">{preview}</p>
        <div className="flex items-center justify-between">
          <SeoScoreMini score={piece.seoScore || 0} />
          <div className="text-right">
            <p className="text-[10px] text-gray-400">Readability</p>
            <p className="text-sm font-semibold">{piece.readabilityScore || 0}</p>
          </div>
        </div>
        {piece.keywords && piece.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {piece.keywords.map((kw) => (
              <span key={kw} className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                <Tag className="w-2.5 h-2.5 mr-0.5" />{kw}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-[10px] text-gray-400">{piece.createdAt}</span>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => onEdit(piece.id)}><PenTool className="w-3.5 h-3.5" /></Button>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => onDelete(piece.id)}><Trash2 className="w-3.5 h-3.5 text-red-500" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function ContentStudio() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [content, setContent] = useState<ContentPiece[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');

  // Create form state
  const [newType, setNewType] = useState<ContentType>("blog");
  const [newTitle, setNewTitle] = useState("");
  const [newKeywords, setNewKeywords] = useState("");
  const [newTone, setNewTone] = useState<Tone>("professional");
  const [newLength, setNewLength] = useState<ContentLength>("medium");
  const [newInstructions, setNewInstructions] = useState("");

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
    fetch(`${API}/content/${selectedClient}/content`, { headers: getHeaders() })
      .then(r => r.json())
      .then(d => {
        const items = d.content || d || [];
        setContent(Array.isArray(items) ? items : []);
      })
      .catch(() => setContent([]))
      .finally(() => setLoading(false));
  }, [selectedClient]);

  // Stats
  const totalContent = content.length;
  const published = content.filter((c) => c.status === "published").length;
  const drafts = content.filter((c) => c.status === "draft").length;
  const avgSeo = content.length > 0 ? Math.round(content.reduce((sum, c) => sum + (c.seoScore || 0), 0) / content.length) : 0;

  const tabFilter: Record<string, ContentType | null> = { all: null, blog: "blog", "landing-pages": "landing-page", email: "email", "ad-copy": "ad-copy" };

  const filtered = content.filter((c) => {
    const typeMatch = tabFilter[activeTab] === null || c.type === tabFilter[activeTab];
    const searchMatch = searchQuery === "" || c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || (c.keywords || []).some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return typeMatch && searchMatch;
  });

  function handleDelete(id: string) {
    setContent((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Content Studio" description="Create, optimize, and manage all your marketing content with AI.">
        <div className="flex gap-2">
          {clients.length > 0 && (
            <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
          <Button onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4 mr-2" />Create Content</Button>
        </div>
      </PageHeader>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      )}

      {!loading && content.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No content yet.</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first piece of content to get started.</p>
        </div>
      )}

      {!loading && content.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard title="Total Content" value={totalContent} icon={<FileText className="h-5 w-5" />} />
            <StatsCard title="Published" value={published} icon={<Send className="h-5 w-5" />} />
            <StatsCard title="Drafts" value={drafts} icon={<PenTool className="h-5 w-5" />} />
            <StatsCard title="Avg SEO Score" value={avgSeo} icon={<Sparkles className="h-5 w-5" />} />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Content</TabsTrigger>
                <TabsTrigger value="blog">Blog Articles</TabsTrigger>
                <TabsTrigger value="landing-pages">Landing Pages</TabsTrigger>
                <TabsTrigger value="email">Email Campaigns</TabsTrigger>
                <TabsTrigger value="ad-copy">Ad Copy</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                <Input className="pl-9 w-52" placeholder="Search content..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}><Grid className="w-4 h-4" /></Button>
              <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}><List className="w-4 h-4" /></Button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No content found</p>
                <p className="text-sm">Try adjusting your filters or create new content.</p>
              </CardContent>
            </Card>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((piece) => (
                <ContentCard key={piece.id} piece={piece} viewMode="grid" onEdit={setEditingId} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((piece) => (
                <ContentCard key={piece.id} piece={piece} viewMode="list" onEdit={setEditingId} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Content Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create New Content</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Content Type</label>
              <Select value={newType} onValueChange={(v) => setNewType(v as ContentType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog">Blog Article</SelectItem>
                  <SelectItem value="landing-page">Landing Page</SelectItem>
                  <SelectItem value="email">Email Campaign</SelectItem>
                  <SelectItem value="ad-copy">Ad Copy</SelectItem>
                  <SelectItem value="social">Social Post</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Topic / Title</label>
              <Input placeholder="e.g. How to Improve Website Speed" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Target Keywords</label>
              <Input placeholder="Comma separated" value={newKeywords} onChange={(e) => setNewKeywords(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button disabled={!newTitle.trim()}><Sparkles className="w-4 h-4 mr-2" />Generate with AI</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
