import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, GraduationCap, ArrowRight, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LoginPage: React.FC = () => {
  const { loginAsStudent, loginAsTeacher, quickLogin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Student Form
  const [studentId, setStudentId] = useState("");
  const [seatNumber, setSeatNumber] = useState("");

  // Teacher Form
  const [teacherId, setTeacherId] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!seatNumber) {
      setErrorMessage(t("login.error_required_seat"));
      return;
    }
    const res = loginAsStudent(studentId, seatNumber);
    if (res.success) {
      toast({ title: t("login.success_student"), description: res.message });
      navigate("/");
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!teacherId) {
      setErrorMessage(t("login.error_required_teacher"));
      return;
    }
    const res = loginAsTeacher(teacherId, teacherPassword);
    if (res.success) {
      toast({ title: t("login.success_teacher"), description: res.message });
      navigate("/");
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleQuickLogin = (type: "student" | "teacher", id: string, seatNo?: number) => {
    quickLogin(type, id, seatNo);
    toast({ title: t("login.quick_success"), description: t("login.quick_desc") });
    navigate("/");
  };

  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center py-6 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-2xl shadow-lg">
            J203
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Class Connect Pro
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("app.subtitle")}
          </p>
        </div>

        {/* Login Tabs */}
        <Card className="shadow-xl border-border/60 backdrop-blur-sm bg-card/95">
          <CardHeader className="pb-3 text-center">
            <CardTitle className="text-lg">{t("login.title")}</CardTitle>
            <CardDescription className="text-xs">
              {t("login.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Tabs defaultValue="student" className="w-full" onValueChange={() => setErrorMessage("")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student" className="text-xs py-2 gap-1">
                  <GraduationCap size={14} />
                  {t("login.student_tab")}
                </TabsTrigger>
                <TabsTrigger value="teacher" className="text-xs py-2 gap-1">
                  <UserCheck size={14} />
                  {t("login.teacher_tab")}
                </TabsTrigger>
              </TabsList>

              {/* Student Login Form */}
              <TabsContent value="student">
                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="studentId" className="text-xs font-medium">
                      {t("login.student_id")}
                    </Label>
                    <Input
                      id="studentId"
                      placeholder={t("login.student_id_placeholder")}
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="h-10 text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      {t("login.student_id_hint")}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="seatNumber" className="text-xs font-medium">
                      {t("login.seat_number")} <span className="text-destructive">*</span>
                    </Label>

                    <Input
                      id="seatNumber"
                      type="number"
                      placeholder={t("login.seat_placeholder")}
                      value={seatNumber}
                      onChange={(e) => setSeatNumber(e.target.value)}
                      min={1}
                      max={46}
                      required
                      className="h-10 text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      {t("login.seat_hint")}
                    </p>
                  </div>

                  <Button type="submit" className="w-full h-10 font-semibold gap-2">
                    {t("login.student_submit")} <ArrowRight size={16} />
                  </Button>
                </form>
              </TabsContent>

              {/* Teacher Login Form */}
              <TabsContent value="teacher">
                <form onSubmit={handleTeacherSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="teacherId" className="text-xs font-medium">
                      {t("login.teacher_id")} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="teacherId"
                      placeholder={t("login.teacher_id_placeholder")}
                      value={teacherId}
                      onChange={(e) => setTeacherId(e.target.value)}
                      required
                      className="h-10 text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      {t("login.teacher_id_hint")}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="teacherPassword" className="text-xs font-medium">
                      {t("login.password")}
                    </Label>
                    <Input
                      id="teacherPassword"
                      type="password"
                      placeholder={t("login.password_placeholder")}
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      className="h-10 text-sm"
                    />
                  </div>

                  <Button type="submit" className="w-full h-10 font-semibold gap-2">
                    {t("login.teacher_submit")} <ArrowRight size={16} />
                  </Button>
                </form>
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;

