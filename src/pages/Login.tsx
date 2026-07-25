import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, User, IdCard, Hash, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Login = () => {
  const navigate = useNavigate();
  const { loginStudent, loginTeacher } = useAuth();

  const [studentId, setStudentId] = useState("");
  const [seatNo, setSeatNo] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const handleStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginStudent(studentId, seatNo);
    if (res.ok) {
      toast.success("登录成功，欢迎回来！");
      navigate("/dashboard");
    } else {
      toast.error(res.message ?? "登录失败");
    }
  };

  const handleTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginTeacher(teacherId);
    if (res.ok) {
      toast.success("登录成功，欢迎回来！");
      navigate("/dashboard");
    } else {
      toast.error(res.message ?? "登录失败");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* 品牌 */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <GraduationCap className="text-primary" size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Class Connect Pro
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            J203 班级教学管理系统
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="student" className="gap-1.5">
                <User size={15} />
                学生登录
              </TabsTrigger>
              <TabsTrigger value="teacher" className="gap-1.5">
                <GraduationCap size={15} />
                教师登录
              </TabsTrigger>
            </TabsList>

            {/* 学生 */}
            <TabsContent value="student">
              <form onSubmit={handleStudent} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">学生编号</Label>
                  <div className="relative">
                    <IdCard
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      id="studentId"
                      placeholder="例如：250095"
                      className="pl-9"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seatNo">座号</Label>
                  <div className="relative">
                    <Hash
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      id="seatNo"
                      inputMode="numeric"
                      placeholder="例如：1"
                      className="pl-9"
                      value={seatNo}
                      onChange={(e) => setSeatNo(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  登录
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  使用学生编号与座号登录，无需密码
                </p>
              </form>
            </TabsContent>

            {/* 教师 */}
            <TabsContent value="teacher">
              <form onSubmit={handleTeacher} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teacherId">教师编号</Label>
                  <div className="relative">
                    <KeyRound
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      size={16}
                    />
                    <Input
                      id="teacherId"
                      placeholder="例如：T004"
                      className="pl-9"
                      value={teacherId}
                      onChange={(e) => setTeacherId(e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  登录
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  教师编号范围 T001 - T011，无需密码
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          班长同学登录后将自动获得助教（班干部）管理权限
        </p>
      </div>
    </div>
  );
};

export default Login;
