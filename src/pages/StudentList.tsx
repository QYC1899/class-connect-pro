import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { students } from "@/data/students";

const StudentList = () => {
  const [query, setQuery] = useState("");

  const filtered = students.filter((s) => {
    const q = query.toLowerCase();
    return (
      s.chineseName.includes(q) ||
      s.englishName.toLowerCase().includes(q) ||
      s.studentId.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">学生列表</h1>
        <p className="text-muted-foreground">共 {students.length} 位同学</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          placeholder="搜索姓名或学号…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">座号</TableHead>
              <TableHead>中文名</TableHead>
              <TableHead>英文名</TableHead>
              <TableHead>学号</TableHead>
              <TableHead>职位</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.studentId}>
                <TableCell className="font-mono">{s.seatNo}</TableCell>
                <TableCell className="font-medium">{s.chineseName}</TableCell>
                <TableCell>{s.englishName}</TableCell>
                <TableCell className="font-mono">{s.studentId}</TableCell>
                <TableCell>
                  {s.position && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {s.position}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  没有找到匹配的学生
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
