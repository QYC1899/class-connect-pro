import { useState } from "react";
import { Instagram, Search, ShieldCheck, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TEACHERS_LIST } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

const Instructors = () => {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase();

  const filtered = TEACHERS_LIST.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.teacherId.toLowerCase().includes(q) ||
      t.subjects.some((s) => s.toLowerCase().includes(q)) ||
      (t.ig?.toLowerCase().includes(q) ?? false)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">J203 教师团队</h1>
          <p className="text-sm text-muted-foreground mt-1">
            包含固定教师编号 T001 - T011 与助教编制（TA001 - TA002）
          </p>
        </div>
        <Badge variant="outline" className="text-xs px-3 py-1 font-semibold text-primary">
          共 {TEACHERS_LIST.length} 位教学人员
        </Badge>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          placeholder="搜索教师编号 (如 T004)、姓名或科目…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <div
            key={t.teacherId}
            className="rounded-2xl border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md space-y-4"
          >
            <div className="flex items-center justify-between">
              <Badge variant="default" className="font-mono text-xs px-2.5 py-0.5">
                {t.teacherId}
              </Badge>
              <Badge variant={t.role === "助教" ? "outline" : "secondary"} className="text-xs">
                {t.role === "助教" ? (
                  <span className="flex items-center gap-1 text-emerald-600">
                    <ShieldCheck size={12} /> 助教
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <UserCheck size={12} /> 科任教师
                  </span>
                )}
              </Badge>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground">{t.name}</h2>
              <div className="flex flex-wrap gap-1 mt-2">
                {t.subjects.map((sub) => (
                  <Badge key={sub} variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary">
                    {sub}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
              <Instagram size={14} className="text-muted-foreground shrink-0" />
              <span className="truncate">
                {t.ig ?? "官方联络账号"}
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-muted-foreground">
            没有找到匹配的教师信息
          </p>
        )}
      </div>
    </div>
  );
};

export default Instructors;
