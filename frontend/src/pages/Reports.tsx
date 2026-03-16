import React, { useState, useEffect } from "react";
import {
  FileBarChart,
  Download,
  Send,
  Eye,
  Trash2,
  Plus,
  Calendar,
  TrendingUp,
  Search,
  ArrowLeft,
  Loader2,
  Clock,
  Mail,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

type ReportType = "SEO" | "Ads" | "Content" | "Competitor" | "Comprehensive";
type ReportStatus = "generating" | "ready" | "sent";

interface Report {
  id: string;
  title: string;
  type: ReportType;
  client: string;
  dateRange: string;
  generatedDate: string;
  status: ReportStatus;
}

const TYPE_STYLES: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  SEO: { color: "text-blue-700", bg: "bg-blue-100 text-blue-700 border-blue-200", icon: <Search className="h-5 w-5 text-blue-600" /> },
  Ads: { color: "text-green-700", bg: "bg-green-100 text-green-700 border-green-200", icon: <TrendingUp className="h-5 w-5 text-green-600" /> },
  Content: { color: "text-purple-700", bg: "bg-purple-100 text-purple-700 border-purple-200", icon: <FileBarChart className="h-5 w-5 text-purple-600" /> },
  Competitor: { color: "text-orange-700", bg: "bg-orange-100 text-orange-700 border-orange-200", icon: <Eye className="h-5 w-5 text-orange-600" /> },
  Comprehensive: { color: "text-indigo-700", bg: "bg-gradient-to-r from-blue-100 to-purple-100 text-indigo-700 border-indigo-200", icon: <FileBarChart className="h-5 w-5 text-indigo-600" /> },
};

const STATUS_STYLES: Record<string, { bg: string; label: string }> = {
  generating: { bg: "bg-yellow-100 text-yellow-700 border-yellow-200", label: "Generating" },
  ready: { bg: "bg-green-100 text-green-700 border-green-200", label: "Ready" },
  sent: { bg: "bg-blue-100 text-blue-700 border-blue-200", label: "Sent" },
};

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');

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
    fetch(`${API}/reports/${selectedClient}/reports`, { headers: getHeaders() })
      .then(r => r.json())
      .then(d => {
        const reps = d.reports || d || [];
        setReports(Array.isArray(reps) ? reps : []);
      })
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, [selectedClient]);

  const filteredReports = activeTab === "all"
    ? reports
    : reports.filter((r) => r.type?.toLowerCase() === activeTab);

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Reports"
        actions={
          <div className="flex gap-2">
            {clients.length > 0 && (
              <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
                {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
            <Button><Plus className="mr-2 h-4 w-4" /> Generate Report</Button>
          </div>
        }
      />

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      )}

      {!loading && reports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <FileBarChart className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No reports yet</h3>
          <p className="mt-1 text-sm text-gray-500">Generate your first report to get started.</p>
        </div>
      )}

      {!loading && reports.length > 0 && (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="ads">Ads</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="competitor">Competitor</TabsTrigger>
              <TabsTrigger value="comprehensive">Comprehensive</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredReports.map((report) => {
                  const typeStyle = TYPE_STYLES[report.type] || TYPE_STYLES.SEO;
                  const statusStyle = STATUS_STYLES[report.status] || STATUS_STYLES.ready;

                  return (
                    <Card key={report.id} className="flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {typeStyle.icon}
                            <Badge variant="outline" className={typeStyle.bg}>{report.type}</Badge>
                          </div>
                          <Badge variant="outline" className={statusStyle.bg}>
                            {report.status === "generating" && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                            {statusStyle.label}
                          </Badge>
                        </div>
                        <CardTitle className="mt-2 text-base">{report.title}</CardTitle>
                        <CardDescription className="text-xs">{report.client}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 space-y-2 pb-3">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{report.dateRange}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Generated {report.generatedDate}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-3">
                        <div className="flex w-full gap-1">
                          <Button variant="ghost" size="sm" className="flex-1" disabled={report.status === "generating"}>
                            <Eye className="mr-1 h-3.5 w-3.5" /> View
                          </Button>
                          <Button variant="ghost" size="sm" className="flex-1" disabled={report.status === "generating"}>
                            <Download className="mr-1 h-3.5 w-3.5" /> PDF
                          </Button>
                          <Button variant="ghost" size="sm" className="flex-1" disabled={report.status === "generating"}>
                            <Mail className="mr-1 h-3.5 w-3.5" /> Send
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Reports;
