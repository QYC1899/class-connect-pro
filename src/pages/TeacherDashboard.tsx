import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <Card className="p-8 text-center">
        <BookOpen size={48} className="mx-auto text-primary mb-4" />
        <h2 className="text-xl font-bold">Welcome, {user.name}</h2>
        <p className="text-muted-foreground mt-2">
          Please go to the <strong>Homework Management</strong> page to view and publish content.
        </p>
      </Card>
    </div>
  );
};

export default TeacherDashboard;
