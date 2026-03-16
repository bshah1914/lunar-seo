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
import { Progress } from "@/components/ui/progress";
import PageHeader from "@/components/layout/PageHeader";
import StatsCard from "@/components/layout/StatsCard";
import {
  Plus,
  Rocket,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Eye,
  MousePointerClick,
  Target,
  Pause,
  Play,
  FileText,
  Edit,
  Megaphone,
  Search as SearchIcon,
  Mail,
  Share2,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const API = '/api/v1';
const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

const CAMPAIGN_TYPES: Record<string, { label: string; color: string }> = {
  seo: { label: "SEO", color: "bg-green-100 text-green-700" },
  content: { label: "Content", color: "bg-purple-100 text-purple-700" },
  ads: { label: "Ads", color: "bg-red-100 text-red-700" },
  social: { label: "Social", color: "bg-pink-100 text-pink-700" },
  email: { label: "Email", color: "bg-amber-100 text-amber-700" },
};

const CAMPAIGN_STATUSES: Record<string, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-600" },
  active: { label: "Active", color: "bg-green-100 text-green-700" },
  paused: { label: "Paused", color: "bg-yellow-100 text-yellow-700" },
  completed: { label: "Completed", color: "bg-blue-100 text-blue-700" },
};

function formatNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export default function Campaigns() {
  const [campaignsData, setCampaignsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/campaigns/`, { headers: getHeaders() })
      .then(r => r.json())
      .then(d => {
        const camps = d.campaigns || d || [];
        setCampaignsData(Array.isArray(camps) ? camps : []);
      })
      .catch(() => setCampaignsData([]))
      .finally(() => setLoading(false));
  }, []);

  const activeCampaigns = campaignsData.filter((c) => c.status === "active").length;
  const completedCampaigns = campaignsData.filter((c) => c.status === "completed").length;
  const totalBudget = campaignsData.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalSpent = campaignsData.reduce((sum, c) => sum + (c.spent || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Campaign Planner">
        <Button><Plus className="w-4 h-4 mr-2" /> New Campaign</Button>
      </PageHeader>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      )}

      {!loading && campaignsData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Rocket className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No campaigns yet.</h3>
          <p className="mt-1 text-sm text-gray-500">Create your first campaign to start tracking performance.</p>
        </div>
      )}

      {!loading && campaignsData.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard title="Active Campaigns" value={String(activeCampaigns)} icon={<Rocket className="h-5 w-5" />} />
            <StatsCard title="Completed" value={String(completedCampaigns)} icon={<CheckCircle2 className="h-5 w-5" />} />
            <StatsCard title="Total Budget" value={`$${totalBudget.toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} />
            <StatsCard title="Total Spent" value={`$${totalSpent.toLocaleString()}`} icon={<TrendingUp className="h-5 w-5" />} />
          </div>

          <div className="space-y-4">
            {campaignsData.map((campaign: any) => {
              const typeInfo = CAMPAIGN_TYPES[campaign.type] || { label: campaign.type || "Other", color: "bg-gray-100 text-gray-700" };
              const statusInfo = CAMPAIGN_STATUSES[campaign.status] || { label: campaign.status || "Unknown", color: "bg-gray-100 text-gray-600" };
              const spendPercent = campaign.budget > 0 ? Math.round(((campaign.spent || 0) / campaign.budget) * 100) : 0;
              const expanded = expandedId === campaign.id;

              return (
                <Card key={campaign.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-base">{campaign.name}</h3>
                          <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {campaign.startDate || campaign.start_date} &mdash; {campaign.endDate || campaign.end_date}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpandedId(expanded ? null : campaign.id)}>
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                    </div>

                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">${(campaign.spent || 0).toLocaleString()} / ${(campaign.budget || 0).toLocaleString()}</span>
                        <span className="font-medium">{spendPercent}%</span>
                      </div>
                      <Progress value={spendPercent} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center">
                        <p className="text-lg font-semibold">{formatNum(campaign.impressions || 0)}</p>
                        <p className="text-xs text-muted-foreground">Impressions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">{formatNum(campaign.clicks || 0)}</p>
                        <p className="text-xs text-muted-foreground">Clicks</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold">{formatNum(campaign.conversions || 0)}</p>
                        <p className="text-xs text-muted-foreground">Conversions</p>
                      </div>
                    </div>

                    {campaign.progress != null && (
                      <div className="mt-3 flex items-center gap-2">
                        <Progress value={campaign.progress} className="h-1.5 flex-1" />
                        <span className="text-xs font-medium text-muted-foreground">{campaign.progress}%</span>
                      </div>
                    )}

                    {expanded && campaign.milestones && campaign.milestones.length > 0 && (
                      <div className="mt-6 border-t pt-6">
                        <h4 className="text-sm font-semibold mb-3">Milestones</h4>
                        <div className="space-y-3">
                          {campaign.milestones.map((ms: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${ms.done ? "border-green-500 bg-green-500" : "border-gray-300 bg-white"}`}>
                                {ms.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                              </div>
                              <div>
                                <p className={`text-sm ${ms.done ? "line-through text-muted-foreground" : "font-medium"}`}>{ms.label}</p>
                                <p className="text-xs text-muted-foreground">{ms.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
