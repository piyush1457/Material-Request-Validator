import type { MaterialRequest } from '../types';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';

interface RequestTableProps {
  requests: MaterialRequest[];
  onViewDetail?: (request: MaterialRequest) => void;
  filterStatus?: MaterialRequest['status'] | 'ALL';
  onFilterChange?: (status: MaterialRequest['status'] | 'ALL') => void;
}

export function RequestTable({ 
  requests, 
  onViewDetail, 
  filterStatus = 'ALL',
  onFilterChange 
}: RequestTableProps) {
  const filteredRequests = filterStatus === 'ALL' 
    ? requests 
    : requests.filter(r => r.status === filterStatus);

  if (filteredRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">No requests found{filterStatus !== 'ALL' ? ` with status "${filterStatus}"` : ''}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {onFilterChange && (
        <div className="p-4 border-b border-border bg-slate-50">
          <label htmlFor="status-filter" className="block text-sm font-medium text-text mb-2">
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value as MaterialRequest['status'] | 'ALL')}
            className="w-full max-w-xs px-3 py-2 border border-border rounded-lg bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="ALL">All Statuses</option>
            <option value="NORMAL">Normal</option>
            <option value="REVIEW">Review</option>
            <option value="FLAG">Flagged</option>
          </select>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Project</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Task</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Material</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-text-muted uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Severity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">AI Message</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredRequests.map((request) => (
              <tr key={request.id} className="hover:bg-slate-50 transition-colors" onClick={() => onViewDetail?.(request)}>
                <td className="px-4 py-3 text-sm text-text">{request.projectName}</td>
                <td className="px-4 py-3 text-sm text-text">{request.taskName}</td>
                <td className="px-4 py-3 text-sm text-text">{request.materialName}</td>
                <td className="px-4 py-3 text-sm font-medium text-text text-right">{request.requestedQuantity} {request.unit}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(request.severity)}`}>
                    {getSeverityLabel(request.severity)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-text-muted max-w-xs truncate" title={request.aiAnalysis?.message}>
                  {request.aiAnalysis?.message}
                </td>
                <td className="px-4 py-3 text-sm text-text-muted">
                  {new Date(request.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  {onViewDetail && (
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onViewDetail(request); }}>
                      View
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'LOW': return 'bg-green-100 text-green-700';
    case 'MEDIUM': return 'bg-amber-100 text-amber-700';
    case 'HIGH': return 'bg-orange-100 text-orange-700';
    case 'CRITICAL': return 'bg-red-100 text-red-700';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function getSeverityLabel(severity: string): string {
  switch (severity) {
    case 'LOW': return 'Normal';
    case 'MEDIUM': return 'Review';
    case 'HIGH': return 'Action Required';
    case 'CRITICAL': return 'Critical';
    default: return 'Unknown';
  }
}