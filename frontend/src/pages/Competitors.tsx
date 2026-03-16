import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Target,
  FileText,
  Link2,
  Eye,
  Sparkles,
  ExternalLink,
  Mail,
} from "lucide-react";

const API = '/api/v1';
const getHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

// ---------------------------------------------------------------------------
// Shared Helper Components
// ---------------------------------------------------------------------------

function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h1>
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "destructive" | "warning" | "secondary" | "outline" }) {
  const colors: Record<string, string> = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    destructive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    secondary: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    outline: "border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[variant]}`}>
      {children}
    </span>
  );
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return n.toLocaleString();
}

function ComparisonIndicator({ value, compare }: { value: number; compare: number }) {
  if (value > compare) {
    return (
      <span className="inline-flex items-center text-xs text-green-600 dark:text-green-400">
        <ArrowUpRight className="h-3 w-3" />
        higher
      </span>
    );
  }
  if (value < compare) {
    return (
      <span className="inline-flex items-center text-xs text-red-500 dark:text-red-400">
        <ArrowDownRight className="h-3 w-3" />
        lower
      </span>
    );
  }
  return <span className="text-xs text-gray-400">equal</span>;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function Competitors() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [competitors, setCompetitors] = useState<any[]>([]);
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
    fetch(`${API}/competitors/${selectedClient}/competitors`, { headers: getHeaders() })
      .then(r => r.json())
      .then(d => {
        const comps = d.competitors || d || [];
        setCompetitors(Array.isArray(comps) ? comps : []);
      })
      .catch(() => setCompetitors([]))
      .finally(() => setLoading(false));
  }, [selectedClient]);

  if (clients.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 lg:p-8">
        <PageHeader title="Competitor Intelligence" />
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Select a client first</h3>
          <p className="mt-1 text-sm text-gray-500">Add a client to start competitor analysis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 lg:p-8">
      {/* Header */}
      <PageHeader title="Competitor Intelligence">
        {clients.length > 0 && (
          <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
            {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-700 transition-colors">
          <Plus className="h-4 w-4" />
          Add Competitor
        </button>
      </PageHeader>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      )}

      {!loading && competitors.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No competitors tracked yet</h3>
          <p className="mt-1 text-sm text-gray-500">Add competitors to start tracking their performance.</p>
        </div>
      )}

      {!loading && competitors.length > 0 && (
        <>
          {/* Competitor Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {competitors.map((comp: any) => (
              <div key={comp.domain || comp.id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{comp.domain || comp.name}</span>
                </div>
                <div className="space-y-2 text-sm">
                  {comp.da != null && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Domain Authority</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{comp.da}</span>
                    </div>
                  )}
                  {comp.organicTraffic != null && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Organic Traffic</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{typeof comp.organicTraffic === 'number' ? formatNumber(comp.organicTraffic) : comp.organicTraffic}</span>
                    </div>
                  )}
                  {comp.totalKeywords != null && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Total Keywords</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{typeof comp.totalKeywords === 'number' ? formatNumber(comp.totalKeywords) : comp.totalKeywords}</span>
                    </div>
                  )}
                  {comp.totalBacklinks != null && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Total Backlinks</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{typeof comp.totalBacklinks === 'number' ? formatNumber(comp.totalBacklinks) : comp.totalBacklinks}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
