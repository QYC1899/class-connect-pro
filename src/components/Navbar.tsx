import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Users,
  GraduationCap,
  Home,
  CalendarDays,
  BookOpen,
  LogOut,
  LogIn,
  Languages
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, toggleLang, lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getLinkClass = (path: string) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      isActive(path)
        ? "bg-primary text-primary-foreground font-semibold shadow-sm"
        : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            J203
          </div>
          <div className="hidden sm:flex flex-col min-w-0">
            <span className="text-base font-bold tracking-tight text-foreground flex items-center gap-1 truncate">
              Class Connect Pro
              <Badge variant="outline" className="text-[10px] px-1 py-0 border-primary/30 text-primary shrink-0">
                J203
              </Badge>
            </span>
            <span className="text-[11px] text-muted-foreground hidden lg:block truncate">
              {t("app.subtitle")}
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-0.5 xl:gap-1 overflow-hidden max-w-[45%]">
          <Link to="/" className={`${getLinkClass("/")} shrink-0`}>
            <Home size={16} className="shrink-0" />
            <span className="truncate">{t("nav.home")}</span>
          </Link>
          <Link to="/homework" className={`${getLinkClass("/homework")} shrink-0`}>
            <BookOpen size={16} className="shrink-0" />
            <span className="truncate">{t("nav.homework")}</span>
          </Link>
          <Link to="/student" className={`${getLinkClass("/student")} shrink-0`}>
            <Users size={16} className="shrink-0" />
            <span className="truncate">{t("nav.students")}</span>
          </Link>
          <Link to="/instructors" className={`${getLinkClass("/instructors")} shrink-0`}>
            <GraduationCap size={16} className="shrink-0" />
            <span className="truncate">{t("nav.teachers")}</span>
          </Link>
          <Link to="/timetable" className={`${getLinkClass("/timetable")} shrink-0`}>
            <CalendarDays size={16} className="shrink-0" />
            <span className="truncate">{t("nav.timetable")}</span>
          </Link>
        </nav>

        {/* User Identity & Auth Action */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            className="h-8 px-1.5 gap-1 text-muted-foreground hover:text-foreground"
            title={t("lang.toggle")}
          >
            <Languages size={16} />
            <span className="text-[11px] font-semibold">{lang === 'zh' ? 'EN' : '中文'}</span>
          </Button>

          {user ? (
            <div className="flex items-center gap-1">
              <div className="hidden xl:flex flex-col items-end text-xs min-w-0">
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <span className="truncate max-w-[100px]">{user.name}</span>
                  {user.role === "student" && user.seatNumber && (
                    <span className="text-muted-foreground font-normal whitespace-nowrap">
                      (S{user.seatNumber < 10 ? `0${user.seatNumber}` : user.seatNumber})
                    </span>
                  )}
                </span>
                <span className="text-muted-foreground truncate max-w-[120px]">
                  {user.role === "teacher" && `${t("nav.teacher_id_label")}: ${user.teacherId}`}
                  {user.role === "student" && `${t("nav.student_id_label")}: ${user.studentId}`}
                  {user.position && ` · ${user.position}`}
                </span>
              </div>

              <Badge
                variant={user.role === "student" ? "secondary" : "default"}
                className="capitalize text-xs py-0.5 px-1.5 truncate max-w-[80px]"
              >
                {user.role === "teacher" ? t("role.teacher") : user.position ? user.position : t("role.student")}
              </Badge>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-1.5 gap-1"
                title={t("nav.logout_title")}
              >
                <LogOut size={16} />
                <span className="hidden sm:inline text-xs">{t("nav.logout")}</span>
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" className="gap-1.5 font-medium">
                <LogIn size={16} />
                <span>{t("nav.login")}</span>
              </Button>
            </Link>
          )}
        </div>

      {/* Mobile Sub-Nav */}
      <div className="flex md:hidden border-t px-2 py-1.5 justify-around bg-secondary/30 text-xs overflow-x-auto">
        <Link to="/" className={`px-2 py-1 rounded whitespace-nowrap ${isActive("/") ? "font-bold text-primary" : "text-muted-foreground"}`}>
          {t("nav.mobile_home")}
        </Link>
        <Link to="/homework" className={`px-2 py-1 rounded whitespace-nowrap ${isActive("/homework") ? "font-bold text-primary" : "text-muted-foreground"}`}>
          {t("nav.mobile_homework")}
        </Link>
        <Link to="/student" className={`px-2 py-1 rounded whitespace-nowrap ${isActive("/student") ? "font-bold text-primary" : "text-muted-foreground"}`}>
          {t("nav.mobile_class")}
        </Link>
        <Link to="/instructors" className={`px-2 py-1 rounded whitespace-nowrap ${isActive("/instructors") ? "font-bold text-primary" : "text-muted-foreground"}`}>
          {t("nav.mobile_teachers")}
        </Link>
        <Link to="/timetable" className={`px-2 py-1 rounded whitespace-nowrap ${isActive("/timetable") ? "font-bold text-primary" : "text-muted-foreground"}`}>
          {t("nav.mobile_timetable")}
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
