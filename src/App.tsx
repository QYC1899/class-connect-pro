import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { HomeworkProvider } from "@/context/HomeworkContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import StudentList from "./pages/StudentList";
import Instructors from "./pages/Instructors";
import Timetable from "./pages/Timetable";
import LoginPage from "./pages/LoginPage";
import HomeworkPage from "./pages/HomeworkPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <HomeworkProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/homework" element={<HomeworkPage />} />
                  <Route path="/student" element={<StudentList />} />
                  <Route path="/instructors" element={<Instructors />} />
                  <Route path="/timetable" element={<Timetable />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </HomeworkProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
