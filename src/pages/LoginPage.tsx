import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, UserCheck, ShieldCheck, GraduationCap, ArrowRight, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LoginPage: React.FC = () => {
  const { loginAsStudent, loginAsTeacher, loginAsAssistant, quickLogin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Student Form
  const [studentId, setStudentId] = useState("");
  const [seatNumber, setSeatNumber] = useState("");

  // Teacher Form
  const [teacherId, setTeacherId] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");

  // Assistant Form
  const [assistantId, setAssistantId] = useState("");
  const [assistantPassword, setAssistantPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!seatNumber) {
      setErrorMessage("请填写座号");
      return;
    }
    const res = loginAsStudent(studentId, seatNumber);
    if (res.success) {
      toast({ title: "登录成功", description: res.message });
      navigate("/");
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!teacherId) {
      setErrorMessage("请填写教师编号 (T001 - T011)");
      return;
    }
    const res = loginAsTeacher(teacherId, teacherPassword);
    if (res.success) {
      toast({ title: "登录成功", description: res.message });
      navigate("/");
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleAssistantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!assistantId) {
      setErrorMessage("请填写助教编号 (如 TA001)");
      return;
    }
    const res = loginAsAssistant(assistantId, assistantPassword);
    if (res.success) {
      toast({ title: "登录成功", description: res.message });
      navigate("/");
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleQuickLogin = (type: "student" | "teacher" | "assistant", id: string, seatNo?: number) => {
    quickLogin(type, id, seatNo);
    toast({ title: "快速登录成功", description: "已以测试账号身份登录系统" });
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
            J203 教学管理平台 · 请选择身份并登录
          </p>
        </div>

        {/* Login Tabs */}
        <Card className="shadow-xl border-border/60 backdrop-blur-sm bg-card/95">
          <CardHeader className="pb-3 text-center">
            <CardTitle className="text-lg">身份验证</CardTitle>
            <CardDescription className="text-xs">
              学生无需密码，凭学生编号与座号验证登录
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
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="student" className="text-xs py-2 gap-1">
                  <GraduationCap size={14} />
                  学生登录
                </TabsTrigger>
                <TabsTrigger value="teacher" className="text-xs py-2 gap-1">
                  <UserCheck size={14} />
                  教师登录
                </TabsTrigger>
                <TabsTrigger value="assistant" className="text-xs py-2 gap-1">
                  <ShieldCheck size={14} />
                  助教登录
                </TabsTrigger>
              </TabsList>

              {/* Student Login Form */}
              <TabsContent value="student">
                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="studentId" className="text-xs font-medium">
                      学生编号 (Student ID)
                    </Label>
                    <Input
                      id="studentId"
                      placeholder="例：J203001 或 250095"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="h-10 text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      可输入学号（如 250095）或班级学号（如 J203001）
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="seatNumber" className="text-xs font-medium">
                      座号 (Seat Number) <span className="text-destructive">*</span>
                    </Label>

                    <Input
                      id="seatNumber"
                      type="number"
                      placeholder="例：01"
                      value={seatNumber}
                      onChange={(e) => setSeatNumber(e.target.value)}
                      min={1}
                      max={46}
                      required
                      className="h-10 text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      J203 班级座号范围为 1 至 46
                    </p>
                  </div>

                  <Button type="submit" className="w-full h-10 font-semibold gap-2">
                    登录学生主页 <ArrowRight size={16} />
                  </Button>
                </form>
              </TabsContent>

              {/* Teacher Login Form */}
              <TabsContent value="teacher">
                <form onSubmit={handleTeacherSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="teacherId" className="text-xs font-medium">
                      教师编号 (Teacher ID) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="teacherId"
                      placeholder="例：T004 (李佩清老师)"
                      value={teacherId}
                      onChange={(e) => setTeacherId(e.target.value)}
                      required
                      className="h-10 text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      教师编号范围：T001 至 T011
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="teacherPassword" className="text-xs font-medium">
                      密码
                    </Label>
                    <Input
                      id="teacherPassword"
                      type="password"
                      placeholder="默认密码：123456"
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      className="h-10 text-sm"
                    />
                  </div>

                  <Button type="submit" className="w-full h-10 font-semibold gap-2">
                    登录教师工作台 <ArrowRight size={16} />
                  </Button>
                </form>
              </TabsContent>

              {/* Assistant Login Form */}
              <TabsContent value="assistant">
                <form onSubmit={handleAssistantSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="assistantId" className="text-xs font-medium">
                      助教编号 (Assistant ID) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="assistantId"
                      placeholder="例：TA001"
                      value={assistantId}
                      onChange={(e) => setAssistantId(e.target.value)}
                      required
                      className="h-10 text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      例如：TA001（林美美助教）
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="assistantPassword" className="text-xs font-medium">
                      密码
                    </Label>
                    <Input
                      id="assistantPassword"
                      type="password"
                      placeholder="默认密码：123456"
                      value={assistantPassword}
                      onChange={(e) => setAssistantPassword(e.target.value)}
                      className="h-10 text-sm"
                    />
                  </div>

                  <Button type="submit" className="w-full h-10 font-semibold gap-2">
                    登录助教中心 <ArrowRight size={16} />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Demo Login Helpers */}
        <div className="rounded-xl border border-border/80 bg-secondary/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              ⚡ 快捷测试体验账号
            </span>
            <Badge variant="outline" className="text-[10px] bg-background">
              一键免密
            </Badge>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin("teacher", "T004")}
              className="text-xs h-auto py-2 flex flex-col items-center justify-center text-center bg-card hover:bg-primary/10 hover:border-primary"
            >
              <span className="font-semibold text-foreground">李佩清 老师</span>
              <span className="text-[10px] text-muted-foreground">T004 (数学)</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin("student", "250095", 1)}
              className="text-xs h-auto py-2 flex flex-col items-center justify-center text-center bg-card hover:bg-primary/10 hover:border-primary"
            >
              <span className="font-semibold text-foreground">陈伊萱 同学</span>
              <span className="text-[10px] text-muted-foreground">01号 (250095)</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickLogin("assistant", "TA001")}
              className="text-xs h-auto py-2 flex flex-col items-center justify-center text-center bg-card hover:bg-primary/10 hover:border-primary"
            >
              <span className="font-semibold text-foreground">林美美 助教</span>
              <span className="text-[10px] text-muted-foreground">TA001 (理科组)</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
