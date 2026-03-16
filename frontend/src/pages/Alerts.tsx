import React, { useState, useEffect } from "react";
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  Check,
  X,
  Settings,
  ChevronDown,
  ChevronUp,
  Eye,
  Mail,
  MessageSquare,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import PageHeader from "@/components/layout/PageHeader";
import StatsCard from "@/components/layout/StatsCard";

const API = '/api/v1';
const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

type AlertSeverity = "critical" | "warning" | "info";
type AlertType = "ranking_drop" | "backlink_loss" | "traffic_drop" | "campaign_issue" | "milestone" | "new_backlink";
type AlertStatus = "unread" | "read";

interface Alert {
  id: string;
  severity: AlertSeverity;
  type: AlertType;
  title: string;
  message: string;
  client: string;
  timestamp: string;
  dateGroup: string;
  status: AlertStatus;
  details?: string;
}

const SEVERITY_CONFIG: Record<AlertSeverity, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  critical: { icon: <AlertCircle className="h-5 w-5 text-red-500" />, color: "text-red-700", bg: "bg-red-50 border-red-200", label: "Critical" },
  warning: { icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />, color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200", label: "Warning" },
  info: { icon: <Info className="h-5 w-5 text-blue-500" />, color: "text-blue-700", bg: "bg-blue-50 border-blue-200", label: "Info" },
};

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  ranking_drop: { label: "Ranking Drop", color: "bg-red-100 text-red-700 border-red-200" },
  backlink_loss: { label: "Backlink Loss", color: "bg-orange-100 text-orange-700 border-orange-200" },
  traffic_drop: { label: "Traffic Drop", color: "bg-rose-100 text-rose-700 border-rose-200" },
  campaign_issue: { label: "Campaign Issue", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  milestone: { label: "Milestone", color: "bg-green-100 text-green-700 border-green-200" },
  new_backlink: { label: "New Backlink", color: "bg-blue-100 text-blue-700 border-blue-200" },
};

const DATE_GROUP_LABELS: Record<string, string> = {
  today: "Today",
  yesterday: "Yesterday",
  this_week: "This Week",
  earlier: "Earlier",
};

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState(true);

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
    fetch(`${API}/alerts/${selectedClient}/alerts`, { headers: getHeaders() })
      .then(r => r.json())
      .then(d => {
        const items = d.alerts || d || [];
        setAlerts(Array.isArray(items) ? items : []);
      })
      .catch(() => setAlerts([]))
      .finally(() => setLoading(false));
  }, [selectedClient]);

  const filteredAlerts = alerts.filter((alert) => {
    if (typeFilter !== "all") {
      const typeMap: Record<string, string[]> = {
        ranking_drops: ["ranking_drop"],
        backlink_loss: ["backlink_loss"],
        traffic_drop: ["traffic_drop"],
        campaign_issues: ["campaign_issue"],
      };
      if (typeMap[typeFilter] && !typeMap[typeFilter].includes(alert.type)) return false;
    }
    if (severityFilter !== "all" && alert.severity !== severityFilter) return false;
    if (statusFilter !== "all" && alert.status !== statusFilter) return false;
    return true;
  });

  const dateGroups = ["today", "yesterday", "this_week", "earlier"];
  const groupedAlerts = dateGroups
    .map((group) => ({
      group,
      label: DATE_GROUP_LABELS[group] || group,
      items: filteredAlerts.filter((a) => a.dateGroup === group),
    }))
    .filter((g) => g.items.length > 0);

  // If alerts don't have dateGroup, show them ungrouped
  const ungroupedAlerts = filteredAlerts.filter(a => !a.dateGroup);

  const markAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, status: "read" as AlertStatus })));
  };

  const markAsRead = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: "read" as AlertStatus } : a)));
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const totalAlerts = alerts.length;
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;
  const unreadCount = alerts.filter((a) => a.status === "unread").length;

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Alerts & Monitoring"
        action={
          <div className="flex gap-2">
            {clients.length > 0 && (
              <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
                {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
            <Button variant="outline" onClick={markAllRead}><Check className="mr-2 h-4 w-4" /> Mark All Read</Button>
            <Button variant="outline" size="icon" onClick={() => setSettingsOpen(true)}><Settings className="h-4 w-4" /></Button>
          </div>
        }
      />

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      )}

      {!loading && alerts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Bell className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No alerts yet</h3>
          <p className="mt-1 text-sm text-gray-500">Alerts will appear here when important changes are detected.</p>
        </div>
      )}

      {!loading && alerts.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatsCard title="Total Alerts" value={String(totalAlerts)} icon={<Bell className="h-5 w-5 text-blue-500" />} />
            <StatsCard title="Critical" value={String(criticalCount)} icon={<AlertCircle className="h-5 w-5 text-red-500" />} />
            <StatsCard title="Warnings" value={String(warningCount)} icon={<AlertTriangle className="h-5 w-5 text-yellow-500" />} />
            <StatsCard title="Unread" value={String(unreadCount)} icon={<Mail className="h-5 w-5 text-purple-500" />} />
          </div>

          <Card>
            <CardContent className="flex flex-wrap items-center gap-3 py-3">
              <span className="text-sm font-medium text-gray-500">Filters:</span>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Alert Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ranking_drops">Ranking Drops</SelectItem>
                  <SelectItem value="backlink_loss">Backlink Loss</SelectItem>
                  <SelectItem value="traffic_drop">Traffic Drop</SelectItem>
                  <SelectItem value="campaign_issues">Campaign Issues</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Severity" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {groupedAlerts.map((group) => (
              <div key={group.group}>
                <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">{group.label}</h3>
                <div className="space-y-2">
                  {group.items.map((alert) => {
                    const severity = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
                    const typeLabel = TYPE_LABELS[alert.type] || { label: alert.type, color: "bg-gray-100 text-gray-700" };
                    const isExpanded = expandedAlert === alert.id;

                    return (
                      <Card key={alert.id} className={`transition-colors ${alert.status === "unread" ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""}`}>
                        <CardContent className="py-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0">{severity.icon}</div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                                {alert.status === "unread" && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                              </div>
                              <p className="mt-0.5 text-sm text-gray-600">{alert.message}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className={typeLabel.color}>{typeLabel.label}</Badge>
                                <span className="text-xs text-gray-400">&middot;</span>
                                <span className="text-xs font-medium text-gray-500">{alert.client}</span>
                                <span className="text-xs text-gray-400">&middot;</span>
                                <span className="text-xs text-gray-400">{alert.timestamp}</span>
                              </div>
                              {isExpanded && alert.details && (
                                <div className="mt-3 rounded-lg border bg-gray-50 p-3 text-sm text-gray-600 leading-relaxed">{alert.details}</div>
                              )}
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                              <Button variant="ghost" size="sm" onClick={() => setExpandedAlert(isExpanded ? null : alert.id)} className="text-gray-400 hover:text-gray-600">
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                <span className="ml-1 text-xs">Details</span>
                              </Button>
                              {alert.status === "unread" && (
                                <Button variant="ghost" size="sm" onClick={() => markAsRead(alert.id)} className="text-gray-400 hover:text-blue-600"><Eye className="h-4 w-4" /></Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => dismissAlert(alert.id)} className="text-gray-400 hover:text-red-600"><X className="h-4 w-4" /></Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Ungrouped alerts */}
            {ungroupedAlerts.length > 0 && groupedAlerts.length === 0 && (
              <div className="space-y-2">
                {ungroupedAlerts.map((alert) => {
                  const severity = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.info;
                  const typeLabel = TYPE_LABELS[alert.type] || { label: alert.type, color: "bg-gray-100 text-gray-700" };
                  return (
                    <Card key={alert.id} className={`transition-colors ${alert.status === "unread" ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""}`}>
                      <CardContent className="py-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 shrink-0">{severity.icon}</div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                            <p className="mt-0.5 text-sm text-gray-600">{alert.message}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className={typeLabel.color}>{typeLabel.label}</Badge>
                              <span className="text-xs text-gray-400">{alert.timestamp}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => dismissAlert(alert.id)} className="text-gray-400 hover:text-red-600"><X className="h-4 w-4" /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {filteredAlerts.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Bell className="mb-3 h-10 w-10" />
                  <p className="text-lg font-medium">No alerts found</p>
                  <p className="text-sm">Try adjusting your filters</p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Alert Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Alert Settings</DialogTitle></DialogHeader>
          <div className="space-y-6 py-2">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Notification Channels</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-500" /><label className="text-sm text-gray-600">Email notifications</label></div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-gray-500" /><label className="text-sm text-gray-600">Slack notifications</label></div>
                  <Switch checked={slackNotifications} onCheckedChange={setSlackNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-gray-500" /><label className="text-sm text-gray-600">In-app notifications</label></div>
                  <Switch checked={inAppNotifications} onCheckedChange={setInAppNotifications} />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>Cancel</Button>
            <Button onClick={() => setSettingsOpen(false)}>Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Alerts;
