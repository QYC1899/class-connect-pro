import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useHomework } from "@/context/HomeworkContext";
import { ALL_STUDENTS, TEACHERS_LIST } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  GraduationCap,
  Crown,
  BookOpen,
  LogIn,
  ArrowRight,
  CheckCircle2,
  CalendarDays
} from "lucide-react";

const Index: React.FC = () => {
  const { user } = useAuth();
  const { homeworks, submissions } = useHomework();
  const navigate = useNavigate();

  return (
    <div className="space-y-10 py-6">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-primary/10 via-background to-secondary/40 p-8 sm:p-12 border shadow-sm text-center">
        <div className="relative z-10 mx-auto max-w-3xl space-y-4">
          <Badge variant="outline" className="px-3 py-1 text-xs border-primary/30 text-primary font-semibold bg-background/80">
            ✨ J203 教学与作业管理平台 · Class Connect Pro
          </Badge>

          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl">
            J203 智能教学平台
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            高效便捷的班级作业发布、在线提交、成绩追踪与学生信息管理系统。
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {user ? (
              <Button
                size="lg"
                onClick={() => navigate("/homework")}
                className="gap-2 font-bold shadow-md hover:shadow-lg transition-all"
              >
                <BookOpen size={18} />
                进入我的作业主页
                <ArrowRight size={16} />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="gap-2 font-bold shadow-md hover:shadow-lg transition-all"
              >
                <LogIn size={18} />
                登录 Class Connect Pro
                <ArrowRight size={16} />
              </Button>
            )}

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/student")}
              className="gap-2 font-semibold"
            >
              <Users size={18} />
              查看 J203 班级名单
            </Button>
          </div>
        </div>
      </div>

      {/* User Login Card / Status Banner */}
      {user ? (
        <Card className="border-primary/30 bg-primary/5 shadow-sm">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-xl">
                {user.name.slice(0, 1)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">欢迎回来，{user.name}</h3>
                  <Badge variant="default" className="text-xs">
                    {user.role === "teacher" ? "教师" : user.role === "assistant" ? "助教" : "学生"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {user.role === "student" && `J203 班级 · 座号 ${user.seatNumber} 号 · 学号 ${user.studentId}`}
                  {user.role === "teacher" && `教师 ID: ${user.teacherId} · 负责科目: ${user.subjects?.join("、")}`}
                  {user.role === "assistant" && `助教 ID: ${user.teacherId} · 协助管理组: ${user.subjects?.join("、")}`}
                </p>
              </div>
            </div>

            <Button onClick={() => navigate("/homework")} className="gap-2 font-semibold">
              <BookOpen size={16} />
              前往作业工作台
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border bg-card/60 shadow-sm">
          <CardContent className="p-6 text-center space-y-2">
            <p className="text-sm font-medium text-foreground">
              💡 提示：学生凭学生编号与座号登录，教师凭教师编号（T001 - T011）登录。
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <Button variant="link" size="sm" onClick={() => navigate("/login")} className="text-xs text-primary font-semibold">
                点击前往登录页面 →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Class Statistics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">J203 全班人数</CardTitle>
            <Users className="text-primary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ALL_STUDENTS.length} 人</div>
            <p className="text-[11px] text-muted-foreground mt-1">班长：施妮 · 郑子宸</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">科任教师团队</CardTitle>
            <GraduationCap className="text-blue-500" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{TEACHERS_LIST.length} 位</div>
            <p className="text-[11px] text-muted-foreground mt-1">涵盖 11 门核心课程</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">已发布作业</CardTitle>
            <BookOpen className="text-emerald-500" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{homeworks.length} 份</div>
            <p className="text-[11px] text-muted-foreground mt-1">实时同步学生端</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">系统提交总数</CardTitle>
            <CheckCircle2 className="text-amber-500" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submissions.length} 份</div>
            <p className="text-[11px] text-muted-foreground mt-1">包含按时及补交记录</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Navigation Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          to="/homework"
          className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md"
        >
          <BookOpen className="mb-3 text-primary group-hover:scale-110 transition-transform" size={28} />
          <h3 className="text-lg font-bold text-foreground">作业系统</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            布置作业、在线提交、附件下载与成绩批改
          </p>
        </Link>

        <Link
          to="/student"
          className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md"
        >
          <Users className="mb-3 text-blue-500 group-hover:scale-110 transition-transform" size={28} />
          <h3 className="text-lg font-bold text-foreground">J203 班级名单</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            查看 46 位同学的座号、英文名与干事职位
          </p>
        </Link>

        <Link
          to="/instructors"
          className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md"
        >
          <GraduationCap className="mb-3 text-emerald-500 group-hover:scale-110 transition-transform" size={28} />
          <h3 className="text-lg font-bold text-foreground">教师信息</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            查看 T001 - T011 科任老师与助教资料
          </p>
        </Link>

        <Link
          to="/timetable"
          className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md"
        >
          <CalendarDays className="mb-3 text-amber-500 group-hover:scale-110 transition-transform" size={28} />
          <h3 className="text-lg font-bold text-foreground">班级课程表</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            查看 J203 班级每周上课时间安排
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Index;
