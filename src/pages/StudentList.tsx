import { useState } from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { ALL_STUDENTS } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

const StudentList = () => {
  const [query, setQuery] = useState("");

  const filtered = ALL_STUDENTS.filter((s) => {
    const q = query.toLowerCase();
    const paddedSeat = s.seatNo < 10 ? `0${s.seatNo}` : `${s.seatNo}`;
    return (
      s.chineseName.includes(q) ||
      s.englishName.toLowerCase().includes(q) ||
      s.studentId.includes(q) ||
      paddedSeat.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">J203 班级名单</h1>
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              班级: J203
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            包含 46 位同学的座号、姓名、学号与班级干事职位
          </p>
        </div>
        <Badge variant="default" className="text-xs px-3 py-1 font-semibold">
          全班共 {ALL_STUDENTS.length} 人
        </Badge>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          placeholder="搜索姓名、座号 (如 01) 或学号…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 text-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="w-20 font-semibold text-xs">座号</TableHead>
              <TableHead className="font-semibold text-xs">中文名</TableHead>
              <TableHead className="font-semibold text-xs">英文名</TableHead>
              <TableHead className="font-semibold text-xs">学生编号 (ID)</TableHead>
              <TableHead className="font-semibold text-xs">班级职位</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.studentId} className="hover:bg-secondary/20">
                <TableCell className="font-bold text-xs">
                  {s.seatNo < 10 ? `0${s.seatNo}` : s.seatNo}
                </TableCell>
                <TableCell className="font-semibold text-sm text-foreground">{s.chineseName}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{s.englishName}</TableCell>
                <TableCell className="font-mono text-xs text-primary font-medium">{s.studentId}</TableCell>
                <TableCell>
                  {s.position ? (
                    <Badge variant="secondary" className="text-[11px] font-medium">
                      {s.position}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                  没有找到匹配的 J203 学生记录
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentList;
