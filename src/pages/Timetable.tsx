import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { monThuTimetable, fridayTimetable, recessLabels } from "@/data/timetable";
import { useLanguage } from "@/context/LanguageContext";

const monThuDays = ["monday", "tuesday", "wednesday", "thursday"] as const;

const Timetable = () => {
  const { t, translateSubject } = useLanguage();
  const [query, setQuery] = useState("");
  const q = query.toLowerCase();

  const dayLabels: Record<string, string> = {
    monday: t("timetable.monday"),
    tuesday: t("timetable.tuesday"),
    wednesday: t("timetable.wednesday"),
    thursday: t("timetable.thursday"),
    friday: t("timetable.friday"),
  };

  const highlight = (text: string) => {
    if (!q || !text.toLowerCase().includes(q)) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("timetable.title")}</h1>
        <p className="text-muted-foreground">{t("timetable.subtitle")}</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          placeholder={t("timetable.search_placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Monday - Thursday Table */}
        <div className="flex-1 rounded-xl border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 shrink-0">{t("timetable.lesson")}</TableHead>
                <TableHead className="w-28 shrink-0">{t("timetable.time")}</TableHead>
                {monThuDays.map((d) => (
                  <TableHead key={d} className="whitespace-nowrap">{dayLabels[d]}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {monThuTimetable.map((row, i) => {
                if (row.isRecess) {
                  const labelKey = recessLabels[row.time];
                  return (
                    <TableRow key={row.time}>
                      <TableCell colSpan={6} className="py-2 text-center text-xs font-medium text-muted-foreground bg-muted/50">
                        {labelKey ? t(labelKey) : row.time}
                      </TableCell>
                    </TableRow>
                  );
                }
                return (
                  <TableRow key={row.time}>
                    <TableCell className="font-mono text-xs text-center font-semibold">{i + 1}</TableCell>
                    <TableCell className="font-mono text-xs whitespace-nowrap">{row.time}</TableCell>
                    {monThuDays.map((d) => (
                      <TableCell
                        key={d}
                        className={`text-xs whitespace-nowrap${
                          highlight(row[d])
                            ? " bg-primary/10 font-medium text-primary"
                            : ""
                        }`}
                      >
                        {translateSubject(row[d]) || "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Friday Table */}
        <div className="lg:w-80 rounded-xl border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">{t("timetable.lesson")}</TableHead>
                <TableHead className="w-28">{t("timetable.time")}</TableHead>
                <TableHead>{dayLabels.friday}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fridayTimetable.map((row, i) => {
                if (row.isRecess) {
                  const labelKey = recessLabels[row.fridayTime ?? row.time];
                  return (
                    <TableRow key={row.time}>
                      <TableCell colSpan={3} className="py-2 text-center text-xs font-medium text-muted-foreground bg-muted/50">
                        {labelKey ? t(labelKey) : (row.fridayTime || row.time)}
                      </TableCell>
                    </TableRow>
                  );
                }
                return (
                  <TableRow key={row.time}>
                    <TableCell className="font-mono text-xs text-center font-semibold">{i + 1}</TableCell>
                    <TableCell className="font-mono text-xs whitespace-nowrap">{row.fridayTime || row.time}</TableCell>
                    <TableCell
                      className={
                        highlight(row.friday)
                          ? "bg-primary/10 font-medium text-primary"
                          : ""
                      }
                    >
                      {translateSubject(row.friday) || "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
