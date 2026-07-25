import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  GraduationCap,
  Home,
  CalendarDays,
  BookOpen,
  LogOut,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
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
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            J203
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-foreground flex items-center gap-1">
              Class Connect Pro
              <Badge variant="outline" className="text-[10px] px-1 py-0 border-primary/30 text-primary">
                J203
              </Badge>
            </span>
            <span className="text-[11px] text-muted-foreground hidden sm:block">
              学校班级教学与作业管理平台
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/" className={getLinkClass("/")}>
            <Home size={16} />
            <span>主页</span>
          </Link>
          <Link to="/homework" className={getLinkClass("/homework")}>
            <BookOpen size={16} />
            <span>作业管理</span>
          </Link>
          <Link to="/student" className={getLinkClass("/student")}>
            <Users size={16} />
            <span>J203 班级名单</span>
          </Link>
          <Link to="/instructors" className={getLinkClass("/instructors")}>
            <GraduationCap size={16} />
            <span>教师团队</span>
          </Link>
          <Link to="/timetable" className={getLinkClass("/timetable")}>
            <CalendarDays size={16} />
            <span>课程表</span>
          </Link>
        </nav>

        {/* User Identity & Auth Action */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1">
                  {user.name}
                  {user.role === "student" && user.seatNumber && (
                    <span className="text-muted-foreground font-normal">
                      (座号 {user.seatNumber < 10 ? `0${user.seatNumber}` : user.seatNumber})
                    </span>
                  )}
                </span>
                <span className="text-muted-foreground">
                  {user.role === "teacher" && `教师 ID: ${user.teacherId}`}
                  {user.role === "assistant" && `助教 ID: ${user.teacherId}`}
                  {user.role === "student" && `学号: ${user.studentId}`}
                </span>
              </div>

              <Badge
                variant={user.role === "student" ? "secondary" : user.role === "teacher" ? "default" : "outline"}
                className="capitalize text-xs py-0.5 px-2"
              >
                {user.role === "teacher" ? "教师" : user.role === "assistant" ? "助教" : "学生"}
              </Badge>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 px-2 gap-1"
                title="退出登录"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline text-xs">退出</span>
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" className="gap-1.5 font-medium">
                <LogIn size={16} />
                <span>登录系统</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Sub-Nav */}
      <div className="flex md:hidden border-t px-2 py-1.5 justify-around bg-secondary/30 text-xs">
        <Link to="/" className={`px-2 py-1 rounded ${isActive("/") ? "font-bold text-primary" : "text-muted-foreground"}`}>
          主页
        </Link>
        <Link to="/homework" className={`px-2 py-1 rounded ${isActive("/homework") ? "font-bold text-primary" : "text-muted-foreground"}`}>
          作业
        </Link>
        <Link to="/student" className={`px-2 py-1 rounded ${isActive("/student") ? "font-bold text-primary" : "text-muted-foreground"}`}>
          班级
        </Link>
        <Link to="/instructors" className={`px-2 py-1 rounded ${isActive("/instructors") ? "font-bold text-primary" : "text-muted-foreground"}`}>
          教师
        </Link>
        <Link to="/timetable" className={`px-2 py-1 rounded ${isActive("/timetable") ? "font-bold text-primary" : "text-muted-foreground"}`}>
          课表
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
