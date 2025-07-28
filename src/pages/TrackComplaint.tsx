import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, CheckCircle2, AlertCircle, XCircle, FileText, Calendar } from "lucide-react";
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

const TrackComplaint = () => {
  const [complaintId, setComplaintId] = useState("");
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="h-4 w-4" />;
      case "under_review":
        return <Search className="h-4 w-4" />;
      case "in_progress":
        return <AlertCircle className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />;
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "submitted":
        return "Submitted";
      case "under_review":
        return "Under Review";
      case "in_progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      default:
        return "Unknown";
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

  const handleSearch = async () => {
    if (!complaintId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a complaint ID",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setNotFound(false);
    setComplaint(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get complaints from localStorage
      const complaints = JSON.parse(localStorage.getItem("complaints") || "[]");
      const foundComplaint = complaints.find((c: Complaint) => c.id === complaintId.toUpperCase());
      
      if (foundComplaint) {
        setComplaint(foundComplaint);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search complaint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
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

  const statusTimeline = [
    { status: "submitted", label: "Submitted", description: "Complaint received and logged" },
    { status: "under_review", label: "Under Review", description: "Complaint is being reviewed by relevant department" },
    { status: "in_progress", label: "In Progress", description: "Action is being taken to resolve the complaint" },
    { status: "resolved", label: "Resolved", description: "Complaint has been addressed and resolved" },
  ];

  const getCurrentStatusIndex = (currentStatus: string) => {
    return statusTimeline.findIndex(item => item.status === currentStatus);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-primary" />
                <span>Track Your Complaint</span>
              </CardTitle>
              <CardDescription>
                Enter your 8-digit complaint ID to check the current status and timeline.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Enter Complaint ID (e.g., ABC12345)"
                  value={complaintId}
                  onChange={(e) => setComplaintId(e.target.value.toUpperCase())}
                  className="flex-1"
                  maxLength={8}
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? "Searching..." : "Track Complaint"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Complaint Details */}
          {complaint && (
            <div className="space-y-6">
              {/* Status Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Complaint Details</CardTitle>
                    <Badge className={getStatusColor(complaint.status)} variant="outline">
                      {getStatusIcon(complaint.status)}
                      <span className="ml-1">{getStatusText(complaint.status)}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Complaint ID</p>
                      <p className="font-mono font-semibold">{complaint.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-semibold">{complaint.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Priority</p>
                      <Badge className={getPriorityColor(complaint.priority)} variant="outline">
                        {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p className="font-semibold flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(complaint.createdAt)}</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Title</p>
                    <p className="font-semibold">{complaint.title}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                    <p className="text-sm leading-relaxed">{complaint.description}</p>
                  </div>

                  {complaint.files && complaint.files.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Attached Files</p>
                      <div className="space-y-1">
                        {complaint.files.map((file, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <FileText className="h-4 w-4 text-primary" />
                            <span>{file}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Status Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Timeline</CardTitle>
                  <CardDescription>
                    Track the progress of your complaint through different stages.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {statusTimeline.map((item, index) => {
                      const currentIndex = getCurrentStatusIndex(complaint.status);
                      const isCompleted = index <= currentIndex;
                      const isCurrent = index === currentIndex;

                      return (
                        <div key={item.status} className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCompleted 
                              ? isCurrent 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-success text-success-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {isCompleted && !isCurrent ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <span className="text-xs font-bold">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center space-x-2">
                              <h4 className={`font-semibold ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                                {item.label}
                              </h4>
                              {isCurrent && (
                                <Badge variant="outline" className="text-xs">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <p className={`text-sm ${isCompleted ? "text-muted-foreground" : "text-muted-foreground/60"}`}>
                              {item.description}
                            </p>
                            {isCompleted && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {index === currentIndex ? `Updated: ${formatDate(complaint.updatedAt)}` : "Completed"}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Not Found Message */}
          {notFound && (
            <Card>
              <CardContent className="text-center py-8">
                <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Complaint Not Found</h3>
                <p className="text-muted-foreground mb-4">
                  No complaint found with ID: <span className="font-mono">{complaintId}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Please check your complaint ID and try again. If you continue to have issues, 
                  please contact the administration office.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackComplaint;