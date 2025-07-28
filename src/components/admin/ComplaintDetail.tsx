import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Building, Calendar, FileText, User, Clock, MessageSquare, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Complaint {
  id: string;
  title: string;
  description: string;
  department: string;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  files?: string[];
  adminNotes?: string;
}

interface ComplaintDetailProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (complaintId: string, newStatus: string) => void;
  onAddNote: (complaintId: string, note: string) => void;
}

const ComplaintDetail = ({ complaint, isOpen, onClose, onStatusChange, onAddNote }: ComplaintDetailProps) => {
  const [newNote, setNewNote] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  if (!complaint) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "under_review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Update status if changed
      if (selectedStatus && selectedStatus !== complaint.status) {
        await onStatusChange(complaint.id, selectedStatus);
      }

      // Add note if provided
      if (newNote.trim()) {
        await onAddNote(complaint.id, newNote.trim());
        setNewNote("");
      }

      toast({
        title: "Changes Saved",
        description: "Complaint has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const statusOptions = [
    { value: "submitted", label: "Submitted" },
    { value: "under_review", label: "Under Review" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ];

  const statusTimeline = [
    { status: "submitted", label: "Submitted", description: "Complaint received" },
    { status: "under_review", label: "Under Review", description: "Being reviewed by department" },
    { status: "in_progress", label: "In Progress", description: "Action being taken" },
    { status: "resolved", label: "Resolved", description: "Issue addressed" },
  ];

  const getCurrentStatusIndex = (currentStatus: string) => {
    return statusTimeline.findIndex(item => item.status === currentStatus);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Complaint Details - {complaint.id}</span>
            <Badge variant="outline" className={getStatusColor(complaint.status)}>
              {complaint.status.replace("_", " ")}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Complaint ID</Label>
              <p className="font-mono text-sm p-2 bg-muted rounded">{complaint.id}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority</Label>
              <Badge className={getPriorityColor(complaint.priority)} variant="outline">
                {complaint.priority.toUpperCase()}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Department</Label>
              <p className="text-sm p-2 bg-muted rounded flex items-center">
                <Building className="h-4 w-4 mr-2" />
                {complaint.department}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Submitted</Label>
              <p className="text-sm p-2 bg-muted rounded flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(complaint.createdAt)}
              </p>
            </div>
          </div>

          {/* Title and Description */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Title</Label>
              <p className="text-lg font-semibold mt-1">{complaint.title}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <div className="mt-1 p-3 bg-muted rounded-md text-sm leading-relaxed">
                {complaint.description}
              </div>
            </div>
          </div>

          {/* Files */}
          {complaint.files && complaint.files.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Attached Files</Label>
              <div className="space-y-2">
                {complaint.files.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-muted rounded text-sm">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Timeline */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Progress Timeline</Label>
            <div className="space-y-3">
              {statusTimeline.map((item, index) => {
                const currentIndex = getCurrentStatusIndex(complaint.status);
                const isCompleted = index <= currentIndex;
                const isCurrent = index === currentIndex;

                return (
                  <div key={item.status} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isCompleted 
                        ? isCurrent 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium text-sm ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                        {item.label}
                      </h4>
                      <p className={`text-xs ${isCompleted ? "text-muted-foreground" : "text-muted-foreground/60"}`}>
                        {item.description}
                      </p>
                    </div>
                    {isCurrent && (
                      <Badge variant="outline" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Admin Actions */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Admin Actions</Label>
            
            {/* Status Update */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status-select" className="text-sm">Update Status</Label>
                <Select
                  value={selectedStatus || complaint.status}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger id="status-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="space-y-2">
              <Label htmlFor="admin-note" className="text-sm">Add Admin Note</Label>
              <Textarea
                id="admin-note"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note about this complaint, actions taken, or resolution details..."
                className="min-h-24"
              />
            </div>

            {/* Previous Notes */}
            {complaint.adminNotes && (
              <div className="space-y-2">
                <Label className="text-sm">Previous Admin Notes</Label>
                <div className="p-3 bg-muted rounded text-sm">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p>{complaint.adminNotes}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last updated: {formatDate(complaint.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button 
              onClick={handleSaveChanges} 
              disabled={isSaving || (!selectedStatus || selectedStatus === complaint.status) && !newNote.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintDetail;