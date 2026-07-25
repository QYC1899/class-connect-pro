import { useNavigate } from "react-router-dom";
import {
  Users,
  GraduationCap,
  Home,
  CalendarDays,
  BookOpen,
  ClipboardList,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const roleLabel: Record<string, string> = {
  student: "学生",
  teacher: "教师",
  assistant: "助教 · 班长",
};

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, canManageHomework } = useAuth();

  const linkBase =
    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary";
  const linkActive = "!text-primary !bg-primary/10";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-1">
          <span className="mr-2 text-lg font-black tracking-wider text-primary">
            J203
          </span>
          <NavLink to="/dashboard" className={linkBase} activeClassName={linkActive} end>
            <Home size={16} />
            <span className="hidden sm:inline">主页</span>
          </NavLink>
          <NavLink to="/homework" className={linkBase} activeClassName={linkActive}>
            <BookOpen size={16} />
            <span className="hidden sm:inline">作业</span>
          </NavLink>
          {canManageHomework && (
            <NavLink to="/manage" className={linkBase} activeClassName={linkActive}>
              <ClipboardList size={16} />
              <span className="hidden sm:inline">作业管理</span>
            </NavLink>
          )}
          <NavLink to="/student" className={linkBase} activeClassName={linkActive}>
            <Users size={16} />
            <span className="hidden md:inline">班级名单</span>
          </NavLink>
          <NavLink to="/instructors" className={linkBase} activeClassName={linkActive}>
            <GraduationCap size={16} />
            <span className="hidden md:inline">教师</span>
          </NavLink>
          <NavLink to="/timetable" className={linkBase} activeClassName={linkActive}>
            <CalendarDays size={16} />
            <span className="hidden md:inline">课程表</span>
          </NavLink>
        </div>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-secondary">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                {user.name.slice(0, 1)}
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block font-medium text-foreground">
                  {user.name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {roleLabel[user.role]}
                </span>
              </span>
              <ChevronDown size={14} className="text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs font-normal text-muted-foreground">
                  {roleLabel[user.role]} · {user.id}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut size={15} className="mr-2" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
