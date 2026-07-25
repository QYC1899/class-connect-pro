import { Link } from "react-router-dom";
import { Users, GraduationCap, Crown } from "lucide-react";
import { students } from "@/data/students";
import { instructors } from "@/data/instructors";

const stats = [
  { label: "学生人数", value: students.length, icon: Users },
  { label: "科目数量", value: instructors.length, icon: GraduationCap },
  { label: "班长", value: "施妮 · 郑子宸", icon: Crown },
];

const Index = () => {
  return (
    <div className="flex flex-col items-center gap-12 py-12">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-7xl font-black tracking-tighter text-primary sm:text-8xl">
          J203
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">班级记录系统</p>
      </div>

      {/* Stats */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border bg-card p-5 text-center"
          >
            <s.icon className="mx-auto mb-2 text-primary" size={24} />
            <p className="text-2xl font-bold text-card-foreground">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick nav */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/student"
          className="group rounded-xl border bg-card p-6 transition-colors hover:border-primary/50"
        >
          <Users className="mb-3 text-primary" size={28} />
          <h2 className="text-lg font-semibold text-card-foreground">学生列表</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            查看全部 {students.length} 位同学信息
          </p>
        </Link>
        <Link
          to="/instructors"
          className="group rounded-xl border bg-card p-6 transition-colors hover:border-primary/50"
        >
          <GraduationCap className="mb-3 text-primary" size={28} />
          <h2 className="text-lg font-semibold text-card-foreground">教师信息</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            查看 {instructors.length} 位科任老师
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Index;
