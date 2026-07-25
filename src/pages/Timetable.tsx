import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { timetable, recessLabels } from "@/data/timetable";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday"] as const;
const dayLabels: Record<string, string> = {
  monday: "星期一",
  tuesday: "星期二",
  wednesday: "星期三",
  thursday: "星期四",
  friday: "星期五",
};

const Timetable = () => {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase();

  const highlight = (text: string) => {
    if (!q || !text.toLowerCase().includes(q)) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">课程表</h1>
        <p className="text-muted-foreground">J203 每周课程安排</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          placeholder="搜索科目…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-xl border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">时间</TableHead>
              {days.slice(0, 4).map((d) => (
                <TableHead key={d}>{dayLabels[d]}</TableHead>
              ))}
              <TableHead className="w-28">时间</TableHead>
              <TableHead>{dayLabels.friday}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timetable.map((row) => {
              if (row.isRecess) {
                const label = recessLabels[row.time] ?? "";
                return (
                  <TableRow key={row.time}>
                    <TableCell colSpan={7} className="py-2 text-center text-xs font-medium text-muted-foreground bg-muted/50">
                      {label || row.time}
                    </TableCell>
                  </TableRow>
                );
              }
              return (
                <TableRow key={row.time}>
                  <TableCell className="font-mono text-xs whitespace-nowrap">{row.time}</TableCell>
                  {days.slice(0, 4).map((d) => (
                    <TableCell
                      key={d}
                      className={
                        highlight(row[d])
                          ? "bg-primary/10 font-medium text-primary"
                          : ""
                      }
                    >
                      {row[d] || "-"}
                    </TableCell>
                  ))}
                  <TableCell className="font-mono text-xs whitespace-nowrap text-muted-foreground">
                    {row.fridayTime || row.time}
                  </TableCell>
                  <TableCell
                    className={
                      highlight(row.friday)
                        ? "bg-primary/10 font-medium text-primary"
                        : ""
                    }
                  >
                    {row.friday || "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Timetable;
