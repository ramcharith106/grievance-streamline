import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Shield, Users, Clock, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const stats = [
    { label: "Total Complaints", value: "1,234", icon: FileText, color: "text-blue-600" },
    { label: "Resolved This Month", value: "89", icon: CheckCircle, color: "text-green-600" },
    { label: "Average Resolution", value: "3.2 days", icon: Clock, color: "text-orange-600" },
    { label: "Satisfaction Rate", value: "94%", icon: TrendingUp, color: "text-purple-600" },
  ];

  const features = [
    {
      icon: FileText,
      title: "Anonymous Submission",
      description: "Submit complaints safely and anonymously with unique tracking IDs."
    },
    {
      icon: Search,
      title: "Real-time Tracking",
      description: "Track your complaint status with detailed timeline and updates."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security measures."
    },
    {
      icon: Users,
      title: "Multi-department",
      description: "Route complaints to the right department for faster resolution."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Digital Complaint Management System
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Your Voice <span className="text-primary">Matters</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Submit, track, and resolve complaints efficiently through our secure digital platform. 
              Your concerns are our priority.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/submit">
                <FileText className="h-5 w-5 mr-2" />
                Submit Complaint
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/track">
                <Search className="h-5 w-5 mr-2" />
                Track Status
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 rounded-full bg-muted">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've built a comprehensive system that prioritizes your privacy, security, and satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary/5 to-primary-glow/5 border-primary/20">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Submit Your Complaint?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our team is standing by to help resolve your concerns. Start the process today and 
              experience our commitment to student satisfaction.
            </p>
            <Button size="lg" asChild>
              <Link to="/submit">
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 College Digital Complaint Management System. All rights reserved.</p>
            <p className="mt-2 text-sm">
              For technical support, contact: support@college.edu | Emergency: 1800-XXX-XXXX
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
