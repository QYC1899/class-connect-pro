import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { students } from "@/data/students";
import { findTeacherById } from "@/data/teachers";
import type { AuthUser } from "@/types";

const STORAGE_KEY = "ccp_auth";
const CLASS_ID = "J203";

interface AuthContextValue {
  user: AuthUser | null;
  loginStudent: (
    studentId: string,
    seatNo: string,
  ) => { ok: boolean; message?: string };
  loginTeacher: (teacherId: string) => { ok: boolean; message?: string };
  logout: () => void;
  canManageHomework: boolean; // 教师 + 助教
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const loginStudent = (studentId: string, seatNo: string) => {
    const id = studentId.trim();
    const seat = parseInt(seatNo.trim(), 10);
    if (!id || Number.isNaN(seat)) {
      return { ok: false, message: "请输入学生编号与座号" };
    }
    const student = students.find(
      (s) => s.studentId === id && s.seatNo === seat,
    );
    if (!student) {
      return { ok: false, message: "学生编号与座号不匹配，请重新输入" };
    }
    // 班长视为助教（班干部 / 干事），拥有管理权限
    const isAssistant = student.position === "班长";
    setUser({
      role: isAssistant ? "assistant" : "student",
      id: student.studentId,
      name: student.chineseName,
      seatNo: student.seatNo,
      position: student.position,
      className: CLASS_ID,
    });
    return { ok: true };
  };

  const loginTeacher = (teacherId: string) => {
    const teacher = findTeacherById(teacherId);
    if (!teacher) {
      return { ok: false, message: "教师编号无效（有效范围 T001 - T011）" };
    }
    setUser({
      role: "teacher",
      id: teacher.teacherId,
      name: teacher.name,
      subjects: teacher.subjects,
      className: CLASS_ID,
    });
    return { ok: true };
  };

  const logout = () => setUser(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loginStudent,
      loginTeacher,
      logout,
      canManageHomework: user?.role === "teacher" || user?.role === "assistant",
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth 必须在 AuthProvider 内使用");
  return ctx;
}
