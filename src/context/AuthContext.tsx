import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { ALL_STUDENTS, TEACHERS_LIST } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  loginAsStudent: (studentIdInput: string, seatNumberInput: string) => { success: boolean; message: string };
  loginAsTeacher: (teacherIdInput: string, passwordInput: string) => { success: boolean; message: string };
  loginAsAssistant: (assistantIdInput: string, passwordInput: string) => { success: boolean; message: string };
  quickLogin: (type: 'student' | 'teacher' | 'assistant', id: string, seatNo?: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'class_connect_pro_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [user]);

  const loginAsStudent = (studentIdInput: string, seatNumberInput: string) => {
    const seat = parseInt(seatNumberInput, 10);
    if (isNaN(seat) || seat < 1 || seat > 46) {
      return { success: false, message: '请输入有效的座号 (1 - 46)' };
    }

    const cleanIdInput = studentIdInput.trim().toUpperCase();

    // Check student in J203 list
    const student = ALL_STUDENTS.find((s) => {
      const seatMatch = s.seatNo === seat;
      const formattedSeat = seat < 10 ? `0${seat}` : `${seat}`;
      const j203Id = `J203${formattedSeat}`;
      const idMatch = s.studentId === cleanIdInput || cleanIdInput === j203Id || cleanIdInput === `${seat}` || cleanIdInput === formattedSeat;
      return seatMatch && (idMatch || cleanIdInput === '');
    });

    if (!student) {
      return { success: false, message: '学生编号与座号不匹配，请核对 J203 班级名单' };
    }

    const newUser: User = {
      id: student.studentId,
      name: student.chineseName,
      role: 'student',
      classId: 'J203',
      seatNumber: student.seatNo,
      studentId: student.studentId,
      position: student.position,
    };

    setUser(newUser);
    return { success: true, message: `欢迎回来，${student.chineseName}同学！` };
  };

  const loginAsTeacher = (teacherIdInput: string, passwordInput: string) => {
    const cleanId = teacherIdInput.trim().toUpperCase();
    const teacher = TEACHERS_LIST.find((t) => t.teacherId === cleanId);

    if (!teacher) {
      return { success: false, message: '未找到该教师编号 (请输入 T001 - T011)' };
    }

    if (passwordInput && passwordInput !== '123456' && passwordInput.trim() !== '') {
      // Allow any or 123456 for easy access
    }

    const newUser: User = {
      id: teacher.teacherId,
      name: teacher.name,
      role: teacher.role === '助教' ? 'assistant' : 'teacher',
      classId: 'J203',
      teacherId: teacher.teacherId,
      subjects: teacher.subjects,
    };

    setUser(newUser);
    return { success: true, message: `欢迎回来，${teacher.name}老师！` };
  };

  const loginAsAssistant = (assistantIdInput: string, passwordInput: string) => {
    const cleanId = assistantIdInput.trim().toUpperCase();
    const assistant = TEACHERS_LIST.find((t) => t.teacherId === cleanId || (cleanId.startsWith('TA') && t.role === '助教'));

    if (!assistant) {
      return { success: false, message: '未找到该助教编号 (如 TA001, TA002)' };
    }

    const newUser: User = {
      id: assistant.teacherId,
      name: assistant.name,
      role: 'assistant',
      classId: 'J203',
      teacherId: assistant.teacherId,
      subjects: assistant.subjects,
    };

    setUser(newUser);
    return { success: true, message: `欢迎回来，${assistant.name}助教！` };
  };

  const quickLogin = (type: 'student' | 'teacher' | 'assistant', id: string, seatNo?: number) => {
    if (type === 'student') {
      const student = ALL_STUDENTS.find(s => s.seatNo === (seatNo || 1) || s.studentId === id);
      if (student) {
        setUser({
          id: student.studentId,
          name: student.chineseName,
          role: 'student',
          classId: 'J203',
          seatNumber: student.seatNo,
          studentId: student.studentId,
          position: student.position,
        });
      }
    } else {
      const t = TEACHERS_LIST.find(teacher => teacher.teacherId === id) || TEACHERS_LIST[3]; // default T004
      setUser({
        id: t.teacherId,
        name: t.name,
        role: type === 'assistant' ? 'assistant' : (t.role === '助教' ? 'assistant' : 'teacher'),
        classId: 'J203',
        teacherId: t.teacherId,
        subjects: t.subjects,
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginAsStudent, loginAsTeacher, loginAsAssistant, quickLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
