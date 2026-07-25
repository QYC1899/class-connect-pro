import React from "react";
import { useAuth } from "@/context/AuthContext";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";
import LoginPage from "./LoginPage";

const HomeworkPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  if (user.role === "teacher" || user.role === "assistant") {
    return <TeacherDashboard />;
  }

  return <StudentDashboard />;
};

export default HomeworkPage;
