import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useHomework } from "@/context/HomeworkContext";
import { useLanguage } from "@/context/LanguageContext";
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
  CalendarDays,
  Bot
} from "lucide-react";

const Index: React.FC = () => {
  const { user } = useAuth();
  const { contents, readStatuses } = useHomework();
  const { t, translateSubject } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="space-y-10 py-6">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-primary/10 via-background to-secondary/40 p-8 sm:p-12 border shadow-sm text-center">
        <div className="relative z-10 mx-auto max-w-3xl space-y-4">
          <Badge variant="outline" className="px-3 py-1 text-xs border-primary/30 text-primary font-semibold bg-background/80">
            {t("index.hero_badge")}
          </Badge>

          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl">
            {t("index.hero_title")}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("index.hero_desc")}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {user ? (
              <Button
                size="lg"
                onClick={() => navigate("/homework")}
                className="gap-2 font-bold shadow-md hover:shadow-lg transition-all"
              >
                <BookOpen size={18} />
                {t("index.enter_homework")}
                <ArrowRight size={16} />
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="gap-2 font-bold shadow-md hover:shadow-lg transition-all"
              >
                <LogIn size={18} />
                {t("index.login")}
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
              {t("index.view_class")}
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
                  <h3 className="text-lg font-bold text-foreground">{t("index.welcome_back")}，{user.name}</h3>
                  <Badge variant="default" className="text-xs">
                    {user.role === "teacher" ? t("role.teacher") : user.position || t("role.student")}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {user.role === "student" && `J203 ${t("nav.student_id_label")} · ${t("nav.seat_prefix")} ${user.seatNumber} · ${t("nav.student_id_label")} ${user.studentId}`}
                  {user.role === "teacher" && `${t("nav.teacher_id_label")}: ${user.teacherId} · ${user.subjects?.map(s => translateSubject(s)).join("、")}`}
                  {user.position && ` · ${user.position}`}
                </p>
              </div>
            </div>

            <Button onClick={() => navigate("/homework")} className="gap-2 font-semibold">
              <BookOpen size={16} />
              {t("index.go_to_homework")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border bg-card/60 shadow-sm">
          <CardContent className="p-6 text-center space-y-2">
            <p className="text-sm font-medium text-foreground">
              {t("index.login_hint")}
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <Button variant="link" size="sm" onClick={() => navigate("/login")} className="text-xs text-primary font-semibold">
                {t("index.click_login")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Class Statistics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">{t("index.total_students")}</CardTitle>
            <Users className="text-primary" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ALL_STUDENTS.length} {t("index.student_count")}</div>
            <p className="text-[11px] text-muted-foreground mt-1">{t("index.captains")}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">{t("index.teacher_team")}</CardTitle>
            <GraduationCap className="text-blue-500" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{TEACHERS_LIST.length} {t("index.teachers_count")}</div>
            <p className="text-[11px] text-muted-foreground mt-1">{t("index.covers_subjects")}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">{t("index.total_contents")}</CardTitle>
            <BookOpen className="text-emerald-500" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contents.length} items</div>
            <p className="text-[11px] text-muted-foreground mt-1">{t("index.all_categories")}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">{t("index.total_reads")}</CardTitle>
            <CheckCircle2 className="text-amber-500" size={20} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readStatuses.length} items</div>
            <p className="text-[11px] text-muted-foreground mt-1">{t("index.read_records")}</p>
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
          <h3 className="text-lg font-bold text-foreground">{t("feature.homework")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("feature.homework_desc")}
          </p>
        </Link>

        <Link
          to="/student"
          className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md"
        >
          <Users className="mb-3 text-blue-500 group-hover:scale-110 transition-transform" size={28} />
          <h3 className="text-lg font-bold text-foreground">{t("feature.student_list")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("feature.student_list_desc")}
          </p>
        </Link>

        <Link
          to="/instructors"
          className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md"
        >
          <GraduationCap className="mb-3 text-emerald-500 group-hover:scale-110 transition-transform" size={28} />
          <h3 className="text-lg font-bold text-foreground">{t("feature.teachers")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("feature.teachers_desc")}
          </p>
        </Link>

        <Link
          to="/timetable"
          className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md"
        >
          <CalendarDays className="mb-3 text-amber-500 group-hover:scale-110 transition-transform" size={28} />
          <h3 className="text-lg font-bold text-foreground">{t("feature.timetable")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("feature.timetable_desc")}
          </p>
        </Link>

        <Link
          to="/chatbot"
          className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md"
        >
          <Bot className="mb-3 text-violet-500 group-hover:scale-110 transition-transform" size={28} />
          <h3 className="text-lg font-bold text-foreground">{t("nav.chatbot")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            AI-powered Q&A with LaTeX rendering
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Index;

