import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ComplaintFormData {
  title: string;
  description: string;
  department: string;
  priority: string;
  contactMethod: string;
  contactValue: string;
  agreeTerms: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  department?: string;
  agreeTerms?: string;
}

interface ComplaintFormProps {
  onSubmitSuccess: (complaintId: string) => void;
}

const ComplaintForm = ({ onSubmitSuccess }: ComplaintFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ComplaintFormData>({
    title: "",
    description: "",
    department: "",
    priority: "medium",
    contactMethod: "",
    contactValue: "",
    agreeTerms: false,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const departments = [
    "Academic Affairs",
    "Administration",
    "Facilities & Maintenance",
    "Hostel & Accommodation",
    "Library Services",
    "Canteen & Food Services",
    "Transportation",
    "Student Welfare",
    "IT Services",
    "Security",
    "Harassment/Misconduct",
    "Other"
  ];

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    } else if (formData.description.length > 2000) {
      newErrors.description = "Description must be less than 2000 characters";
    }

    if (!formData.department) {
      newErrors.department = "Please select a department";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateComplaintId = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles = selectedFiles.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });
    setFiles(prev => [...prev, ...validFiles].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const complaintId = generateComplaintId();
      
      // Store complaint in localStorage (in real app, this would be API call)
      const complaint = {
        id: complaintId,
        ...formData,
        files: files.map(f => f.name),
        status: "submitted",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const existingComplaints = JSON.parse(localStorage.getItem("complaints") || "[]");
      localStorage.setItem("complaints", JSON.stringify([...existingComplaints, complaint]));

      toast({
        title: "Complaint Submitted Successfully",
        description: `Your complaint ID is ${complaintId}. Please save this for tracking.`,
      });

      onSubmitSuccess(complaintId);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <span>Submit New Complaint</span>
        </CardTitle>
        <CardDescription>
          Submit your complaint anonymously. You'll receive a tracking ID to check the status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Complaint Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief title describing your complaint"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.title}</span>
              </p>
            )}
            <p className="text-xs text-muted-foreground">{formData.title.length}/200 characters</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Please provide detailed information about your complaint. Include relevant dates, locations, and circumstances."
              className={`min-h-32 ${errors.description ? "border-destructive" : ""}`}
            />
            {errors.description && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.description}</span>
              </p>
            )}
            <p className="text-xs text-muted-foreground">{formData.description.length}/2000 characters</p>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label>Department *</Label>
            <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
              <SelectTrigger className={errors.department ? "border-destructive" : ""}>
                <SelectValue placeholder="Select the relevant department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && (
              <p className="text-sm text-destructive flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.department}</span>
              </p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <Label>Priority Level</Label>
            <RadioGroup 
              value={formData.priority} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="cursor-pointer">Low</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="cursor-pointer">Medium</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="cursor-pointer">High</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="urgent" id="urgent" />
                <Label htmlFor="urgent" className="cursor-pointer">Urgent</Label>
              </div>
            </RadioGroup>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <Label>Supporting Documents (Optional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload files (Images, PDF, Documents)
                </span>
                <span className="text-xs text-muted-foreground">
                  Max 5 files, 5MB each
                </span>
              </Label>
            </div>
            
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Method */}
          <div className="space-y-3">
            <Label>Contact Method for Updates (Optional)</Label>
            <p className="text-xs text-muted-foreground">
              Providing contact information is optional and will be stored separately from your complaint for privacy.
            </p>
            <Select value={formData.contactMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, contactMethod: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Choose how you'd like to receive updates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone/SMS</SelectItem>
                <SelectItem value="none">No updates needed</SelectItem>
              </SelectContent>
            </Select>
            
            {formData.contactMethod && formData.contactMethod !== "none" && (
              <Input
                value={formData.contactValue}
                onChange={(e) => setFormData(prev => ({ ...prev, contactValue: e.target.value }))}
                placeholder={formData.contactMethod === "email" ? "your.email@example.com" : "Your phone number"}
                type={formData.contactMethod === "email" ? "email" : "tel"}
              />
            )}
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={formData.agreeTerms}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreeTerms: checked === true }))}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                I agree to the terms and conditions
              </Label>
              <p className="text-xs text-muted-foreground">
                I confirm that the information provided is accurate and I agree to the college's complaint handling policy.
              </p>
              {errors.agreeTerms && (
                <p className="text-sm text-destructive flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.agreeTerms}</span>
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            size="lg" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Submit Complaint
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ComplaintForm;