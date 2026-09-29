import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MaterialRequest, SeverityLevel } from '../types';
import { useRequests } from '../hooks';
import { Button, StatusBadge, AIChatModal } from '../components';
import { AlertTriangle, AlertCircle, CheckCircle, MessageSquare, Plus, X, Filter } from 'lucide-react';

export function RecentRequests() {
  const navigate = useNavigate();
  const location = useLocation();
  const { requests, loading, refresh } = useRequests();
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'NORMAL' | 'REVIEW' | 'FLAG'>('ALL');
  const [selectedRequest, setSelectedRequest] = useState<MaterialRequest | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  const state = location.state as { request?: MaterialRequest; analysis?: any } | undefined;

  useEffect(() => {
    if (state?.request) {
      setSelectedRequest(state.request);
      setShowDetail(true);
    }
  }, [state]);

  const filteredRequests = filterStatus === 'ALL' 
    ? requests 
    : requests.filter(r => r.status === filterStatus);

  const handleViewDetail = (request: MaterialRequest) => {
    setSelectedRequest(request);
    setShowDetail(true);
  };

  const handleOpenAIChat = (request: MaterialRequest) => {
    setSelectedRequest(request);
    setShowAIChat(true);
  };

  const getActionButtonText = (severity: SeverityLevel) => {
    switch (severity) {
      case 'LOW': return 'View Details';
      case 'MEDIUM': return 'Review Required';
      case 'HIGH': return 'Action Required';
      case 'CRITICAL': return 'Urgent Review';
      default: return 'View Details';
    }
  };

  const getActionButtonVariant = (severity: SeverityLevel) => {
    switch (severity) {
      case 'LOW': return 'secondary';
      case 'MEDIUM': return 'secondary';
      case 'HIGH': return 'primary';
      case 'CRITICAL': return 'danger';
      default: return 'secondary';
    }
  };

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
            <p className="text-caption text-ash mb-2">REQUESTS</p>
            <h1 className="text-display font-semibold text-white tracking-[-2.3px]">Recent Requests</h1>
            <p className="text-body text-ash mt-2">All material requests with AI severity analysis</p>
          </div>
          <Button onClick={() => navigate('/requests')}>
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>

        <div className="bg-card-carbon border border-steel-border rounded-[8px] p-4">
          <div className="flex items-center gap-4">
            <label className="text-body-sm text-ash mb-0">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'ALL' | 'NORMAL' | 'REVIEW' | 'FLAG')}
              className="w-full max-w-xs px-4 py-3 bg-deep-coal border border-graphite rounded-[8px] text-white focus:outline-none focus:ring-2 focus:ring-blue-cornflower focus:border-blue-cornflower transition-colors"
            >
              <option value="ALL">All Statuses</option>
              <option value="NORMAL">Normal</option>
              <option value="REVIEW">Review</option>
              <option value="FLAG">Flagged</option>
            </select>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-ash">No requests found</p>
          </div>
        ) : (
          <div className="bg-card-carbon border border-steel-border rounded-[8px] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-steel-border">
                    <th className="px-6 py-4 text-left text-caption text-ash uppercase tracking-wider w-[22%]">Project</th>
                    <th className="px-6 py-4 text-left text-caption text-ash uppercase tracking-wider w-[15%]">Task</th>
                    <th className="px-6 py-4 text-left text-caption text-ash uppercase tracking-wider w-[15%]">Material</th>
                    <th className="px-6 py-4 text-right text-caption text-ash uppercase tracking-wider w-[12%]">Quantity</th>
                    <th className="px-6 py-4 text-left text-caption text-ash uppercase tracking-wider w-[16%]">Severity</th>
                    <th className="px-6 py-4 text-left text-caption text-ash uppercase tracking-wider w-[10%] whitespace-nowrap">Date</th>
                    <th className="px-6 py-4 text-left text-caption text-ash uppercase tracking-wider w-[10%]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-steel-border/50">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-deep-coal/50 transition-colors">
                      <td className="px-6 py-4 text-body text-white">{request.projectName}</td>
                      <td className="px-6 py-4 text-body text-white">{request.taskName}</td>
                      <td className="px-6 py-4 text-body text-white">{request.materialName}</td>
                      <td className="px-6 py-4 text-body font-medium text-white text-right">{request.requestedQuantity} {request.unit}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-[8px] text-body-sm font-medium ${getSeverityColor(request.severity)}`}>
                            {getSeverityLabel(request.severity)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleOpenAIChat(request); }}
                            className="px-2 py-1.5 text-caption h-auto"
                            title="Talk with AI about this request"
                          >
                            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                            Talk with AI
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-body text-ash whitespace-nowrap">
                        {new Date(request.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4">
                        <Button 
                          variant={getActionButtonVariant(request.severity)} 
                          size="sm" 
                          onClick={(e) => { e.stopPropagation(); handleViewDetail(request); }}
                          className="w-full"
                        >
                          {getActionButtonText(request.severity)}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedRequest && showAIChat && (
          <AIChatModal 
            isOpen={showAIChat} 
            onClose={() => setShowAIChat(false)} 
            request={selectedRequest} 
          />
        )}

        {showDetail && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-page-ink/80" onClick={() => setShowDetail(false)}>
            <div className="bg-card-carbon border border-steel-border rounded-[8px] max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-steel-border flex items-center justify-between">
                <h2 className="text-subheading font-semibold text-white">Request Details</h2>
                <button onClick={() => setShowDetail(false)} className="p-1 text-ash hover:text-white hover:bg-white/5 rounded-[8px] transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-body-sm text-ash mb-1">Project</p>
                    <p className="font-medium text-white">{selectedRequest.projectName}</p>
                  </div>
                  <div>
                    <p className="text-body-sm text-ash mb-1">Task</p>
                    <p className="font-medium text-white">{selectedRequest.taskName}</p>
                  </div>
                  <div>
                    <p className="text-body-sm text-ash mb-1">Material</p>
                    <p className="font-medium text-white">{selectedRequest.materialName}</p>
                  </div>
                  <div>
                    <p className="text-body-sm text-ash mb-1">Quantity</p>
                    <p className="font-medium text-white">{selectedRequest.requestedQuantity} {selectedRequest.unit}</p>
                  </div>
<div>
                      <p className="text-body-sm text-ash mb-1">Status</p>
                      <p className="font-medium text-white">
                        <StatusBadge severity={selectedRequest.severity} size="md" />
                      </p>
                    </div>
                  <div>
                    <p className="text-body-sm text-ash mb-1">Severity</p>
                    <p className="font-medium text-white">
                      <span className={`px-3 py-1 rounded-[8px] text-body-sm font-medium ${getSeverityColor(selectedRequest.severity)}`}>
                        {getSeverityLabel(selectedRequest.severity)}
                      </span>
                    </p>
                  </div>
                </div>

                {selectedRequest.aiAnalysis && (
                  <div className="space-y-4 mb-6">
                    <h4 className="text-body-sm font-medium text-white flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      AI Analysis
                    </h4>
                    <div className="bg-deep-coal border border-steel-border rounded-[8px] p-5">
                      <p className="text-body text-ash mb-3"><strong className="text-white">Issue:</strong> {selectedRequest.aiAnalysis.issue}</p>
                      <p className="text-body text-ash mb-3"><strong className="text-white">Recommendation:</strong> {selectedRequest.aiAnalysis.recommendation}</p>
                      {selectedRequest.aiAnalysis.wasteFactors && selectedRequest.aiAnalysis.wasteFactors.length > 0 && (
                        <div className="text-body text-ash">
                          <strong className="text-white">Waste Factors:</strong>
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            {selectedRequest.aiAnalysis.wasteFactors.map((factor, i) => (
                              <li key={i}>{factor}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {selectedRequest.aiAnalysis.estimatedWaste && (
                        <p className="text-body text-ash mt-2"><strong className="text-white">Estimated Waste:</strong> {selectedRequest.aiAnalysis.estimatedWaste}</p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button variant="secondary" onClick={() => { setShowDetail(false); setShowAIChat(true); }} className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Ask AI Assistant
                      </Button>
                      {selectedRequest.severity === 'HIGH' || selectedRequest.severity === 'CRITICAL' ? (
                        <Button variant="danger" onClick={() => alert('Escalation sent to Project Manager')} className="flex-1">
                          Escalate to PM
                        </Button>
                      ) : (
                        <Button variant="secondary" onClick={() => alert('Marked as reviewed')} className="flex-1">
                          Mark Reviewed
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {selectedRequest.reason && (
                  <div className="pt-6 border-t border-steel-border">
                    <p className="text-body text-ash"><strong className="text-white">Exception Reason:</strong> {selectedRequest.reason.replace('_', ' ')}</p>
                    {selectedRequest.customReason && <p className="text-body text-ash mt-1">{selectedRequest.customReason}</p>}
                  </div>
                )}

                <p className="text-caption text-ash mt-6">
                  Created: {new Date(selectedRequest.createdAt).toLocaleString('en-GB')} by {selectedRequest.createdBy}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getSeverityColor(severity: SeverityLevel): string {
  switch (severity) {
    case 'LOW': return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'MEDIUM': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'HIGH': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'CRITICAL': return 'bg-red-500/10 text-red-400 border-red-500/20';
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
}

function getSeverityLabel(severity: SeverityLevel): string {
  switch (severity) {
    case 'LOW': return 'Normal';
    case 'MEDIUM': return 'Review';
    case 'HIGH': return 'Action Required';
    case 'CRITICAL': return 'Critical';
    default: return 'Unknown';
  }
}