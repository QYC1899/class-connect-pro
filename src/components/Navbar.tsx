import { NavLink } from "@/components/NavLink";
import { Users, GraduationCap, Home, CalendarDays } from "lucide-react";

const Navbar = () => {
  const linkBase =
    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary";
  const linkActive = "!text-primary !bg-primary/10";

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <span className="text-lg font-black tracking-wider text-primary">J203</span>
        <div className="flex items-center gap-1">
          <NavLink to="/" className={linkBase} activeClassName={linkActive} end>
            <Home size={16} />
            <span className="hidden sm:inline">首页</span>
          </NavLink>
          <NavLink to="/student" className={linkBase} activeClassName={linkActive}>
            <Users size={16} />
            <span className="hidden sm:inline">学生</span>
          </NavLink>
          <NavLink to="/instructors" className={linkBase} activeClassName={linkActive}>
            <GraduationCap size={16} />
            <span className="hidden sm:inline">教师</span>
          </NavLink>
          <NavLink to="/timetable" className={linkBase} activeClassName={linkActive}>
            <CalendarDays size={16} />
            <span className="hidden sm:inline">课程表</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
