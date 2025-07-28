import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import ComplaintForm from "@/components/forms/ComplaintForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const SubmitComplaint = () => {
  const [submittedComplaintId, setSubmittedComplaintId] = useState<string | null>(null);
  const { toast } = useToast();

  const copyComplaintId = () => {
    if (submittedComplaintId) {
      navigator.clipboard.writeText(submittedComplaintId);
      toast({
        title: "Copied!",
        description: "Complaint ID copied to clipboard",
      });
    }
  };

  if (submittedComplaintId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="w-full max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <CardTitle className="text-2xl text-success">Complaint Submitted Successfully!</CardTitle>
              <CardDescription>
                Your complaint has been received and is being processed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Your Complaint ID</p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl font-mono font-bold text-primary">
                    {submittedComplaintId}
                  </span>
                  <Button variant="outline" size="sm" onClick={copyComplaintId}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Save this ID to track your complaint status
                </p>
              </div>

              <div className="text-left space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>Your complaint will be reviewed within 24-48 hours</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>You can track the status using your complaint ID</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p>Updates will be posted to your complaint timeline</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/track">
                    Track Status
                  </Link>
                </Button>
                <Button asChild className="flex-1">
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <ComplaintForm onSubmitSuccess={setSubmittedComplaintId} />
      </div>
    </div>
  );
};

export default SubmitComplaint;