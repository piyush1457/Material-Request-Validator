import { useMemo } from 'react';
import { useRequests } from '../hooks';
import { KPICard, Button } from '../components';
import { Plus, ClipboardList, FileText, Bot, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { MaterialRequest } from '../types';

export function Dashboard() {
  const { requests, loading, getByStatus } = useRequests();

  const kpis = useMemo(() => {
    const total = requests.length;
    const normal = getByStatus('NORMAL').length;
    const review = getByStatus('REVIEW').length;
    const flagged = getByStatus('FLAG').length;
    return { total, normal, review, flagged };
  }, [requests, getByStatus]);

  if (loading) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-cornflower" />
      </div>
    );
  }

  return (
    <div className="flex-1 grid-wireframe min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-caption text-ash mb-2">OVERVIEW</p>
            <h1 className="text-display font-semibold text-white tracking-[-2.3px]">Dashboard</h1>
            <p className="text-body text-ash mt-2">Material request overview with AI severity analysis</p>
          </div>
          <Link to="/requests">
            <Button>
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Requests"
            value={kpis.total}
            icon={<ClipboardList className="h-6 w-6 text-blue-cornflower" />}
          />
          <KPICard
            title="Normal"
            value={kpis.normal}
            subtitle="Within expected range"
            trend={{ value: 12, label: 'vs last week' }}
            icon={<CheckCircle className="h-6 w-6 text-green-400" />}
          />
          <KPICard
            title="Review"
            value={kpis.review}
            subtitle="Above expected range"
            trend={{ value: -5, label: 'vs last week' }}
            icon={<AlertTriangle className="h-6 w-6 text-amber-400" />}
          />
          <KPICard
            title="Flagged"
            value={kpis.flagged}
            subtitle="Significantly above range"
            trend={{ value: 0, label: 'vs last week' }}
            icon={<AlertCircle className="h-6 w-6 text-red-400" />}
          />
        </div>

        <div className="bg-card-carbon border border-steel-border rounded-[8px] p-6">
          <p className="text-caption text-ash mb-4">QUICK ACTIONS</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/requests">
              <Button variant="secondary" className="h-28 flex flex-col items-center justify-center gap-2">
                <ClipboardList className="h-8 w-8 text-blue-cornflower" />
                <span className="text-body-sm font-medium">Create Request</span>
                <span className="text-caption text-ash">AI-powered validation</span>
              </Button>
            </Link>
            <Link to="/recent">
              <Button variant="secondary" className="h-28 flex flex-col items-center justify-center gap-2">
                <FileText className="h-8 w-8 text-amber-400" />
                <span className="text-body-sm font-medium">Recent Requests</span>
                <span className="text-caption text-ash">View all with severity</span>
              </Button>
            </Link>
            <Link to="/assistant">
              <Button variant="secondary" className="h-28 flex flex-col items-center justify-center gap-2">
                <Bot className="h-8 w-8 text-purple-400" />
                <span className="text-body-sm font-medium">AI Assistant</span>
                <span className="text-caption text-ash">Chat for insights</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-card-carbon border border-steel-border rounded-[8px] p-6">
          <p className="text-caption text-ash mb-4">SEVERITY BREAKDOWN</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card-carbon border border-green-500/20 rounded-[8px] p-5 text-center">
              <p className="text-heading font-semibold text-green-400">{kpis.normal}</p>
              <p className="text-body-sm text-green-400 mt-1">Normal (Low)</p>
              <p className="text-caption text-ash mt-2">No action needed</p>
            </div>
            <div className="bg-card-carbon border border-amber-500/20 rounded-[8px] p-5 text-center">
              <p className="text-heading font-semibold text-amber-400">{kpis.review}</p>
              <p className="text-body-sm text-amber-400 mt-1">Review (Medium)</p>
              <p className="text-caption text-ash mt-2">Verify measurements</p>
            </div>
            <div className="bg-card-carbon border border-orange-500/20 rounded-[8px] p-5 text-center">
              <p className="text-heading font-semibold text-orange-400">{requests.filter(r => r.severity === 'HIGH').length}</p>
              <p className="text-body-sm text-orange-400 mt-1">Action Required (High)</p>
              <p className="text-caption text-ash mt-2">Site verification needed</p>
            </div>
            <div className="bg-card-carbon border border-red-500/20 rounded-[8px] p-5 text-center">
              <p className="text-heading font-semibold text-red-400">{requests.filter(r => r.severity === 'CRITICAL').length}</p>
              <p className="text-body-sm text-red-400 mt-1">Critical</p>
              <p className="text-caption text-ash mt-2">Urgent PM review</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}