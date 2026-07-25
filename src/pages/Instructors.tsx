import { useState } from "react";
import { Instagram, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { instructors } from "@/data/instructors";

const Instructors = () => {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase();

  const filtered = instructors.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      (t.ig?.toLowerCase().includes(q) ?? false)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">教师信息</h1>
        <p className="text-muted-foreground">共 {instructors.length} 位科任老师</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          placeholder="搜索老师或科目…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <div
            key={t.subject}
            className="rounded-xl border bg-card p-7 transition-colors hover:border-primary/50 space-y-4"
          >
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {t.subject}
            </span>
            <h2 className="text-xl font-semibold text-card-foreground">{t.name}</h2>
            <div className="flex items-center gap-2 text-sm">
              <Instagram size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground">
                {t.ig ?? "未知"}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-8 text-center text-muted-foreground">
            没有找到匹配的教师
          </p>
        )}
      </div>
    </div>
  );
};

export default Instructors;
