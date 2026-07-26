import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { ALL_STUDENTS, TEACHERS_LIST } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  loginAsStudent: (studentIdInput: string, seatNumberInput: string) => { success: boolean; message: string };
  loginAsTeacher: (teacherIdInput: string, passwordInput: string) => { success: boolean; message: string };
  quickLogin: (type: 'student' | 'teacher', id: string, seatNo?: number) => void;
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
      return { success: false, message: 'Please enter a valid seat number (1 - 46)' };
    }

    const cleanIdInput = studentIdInput.trim().toUpperCase();

    const student = ALL_STUDENTS.find((s) => {
      const seatMatch = s.seatNo === seat;
      const formattedSeat = seat < 10 ? `0${seat}` : `${seat}`;
      const j203Id = `J203${formattedSeat}`;
      const idMatch = s.studentId === cleanIdInput || cleanIdInput === j203Id || cleanIdInput === `${seat}` || cleanIdInput === formattedSeat;
      return seatMatch && (idMatch || cleanIdInput === '');
    });

    if (!student) {
      return { success: false, message: 'Student ID and seat number do not match. Please check the J203 class list.' };
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
    return { success: true, message: `Welcome back, ${student.chineseName}!` };
  };

  const loginAsTeacher = (teacherIdInput: string, passwordInput: string) => {
    const cleanId = teacherIdInput.trim().toUpperCase();
    const teacher = TEACHERS_LIST.find((t) => t.teacherId === cleanId);

    if (!teacher) {
      return { success: false, message: 'Teacher ID not found (please enter T001 - T011)' };
    }

    const newUser: User = {
      id: teacher.teacherId,
      name: teacher.name,
      role: 'teacher',
      classId: 'J203',
      teacherId: teacher.teacherId,
      subjects: teacher.subjects,
    };

    setUser(newUser);
    return { success: true, message: `Welcome back, ${teacher.name}!` };
  };

  const quickLogin = (type: 'student' | 'teacher', id: string, seatNo?: number) => {
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
      const t = TEACHERS_LIST.find(teacher => teacher.teacherId === id) || TEACHERS_LIST[3];
      setUser({
        id: t.teacherId,
        name: t.name,
        role: 'teacher',
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
    <AuthContext.Provider value={{ user, loginAsStudent, loginAsTeacher, quickLogin, logout }}>
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

