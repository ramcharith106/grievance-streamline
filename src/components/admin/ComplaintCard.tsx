import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Calendar, Eye, Clock, CheckCircle, XCircle, AlertCircle, User } from "lucide-react";
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
}

interface ComplaintCardProps {
  complaint: Complaint;
  onStatusChange: (complaintId: string, newStatus: string) => void;
  onViewDetails: (complaint: Complaint) => void;
}

const ComplaintCard = ({ complaint, onStatusChange, onViewDetails }: ComplaintCardProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="h-4 w-4" />;
      case "under_review":
        return <Eye className="h-4 w-4" />;
      case "in_progress":
        return <AlertCircle className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "closed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

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
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onStatusChange(complaint.id, newStatus);
      toast({
        title: "Status Updated",
        description: `Complaint ${complaint.id} status changed to ${newStatus.replace("_", " ")}`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update complaint status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const statusOptions = [
    { value: "submitted", label: "Submitted" },
    { value: "under_review", label: "Under Review" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-mono font-semibold text-sm">{complaint.id}</span>
              <Badge variant="outline" className={getPriorityColor(complaint.priority)}>
                {complaint.priority.toUpperCase()}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg leading-tight">{complaint.title}</h3>
          </div>
          <Badge variant="outline" className={getStatusColor(complaint.status)}>
            {getStatusIcon(complaint.status)}
            <span className="ml-1">{complaint.status.replace("_", " ")}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {complaint.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Building className="h-3 w-3" />
              <span>{complaint.department}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(complaint.createdAt)}</span>
            </span>
            {complaint.files && complaint.files.length > 0 && (
              <span className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{complaint.files.length} file(s)</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Select
            value={complaint.status}
            onValueChange={handleStatusChange}
            disabled={isUpdating}
          >
            <SelectTrigger className="flex-1">
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
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(complaint)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplaintCard;