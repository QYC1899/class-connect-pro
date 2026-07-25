import React, { createContext, useContext, useState, useEffect } from 'react';
import { HomeworkItem, SubmissionItem } from '@/types';
import { INITIAL_HOMEWORKS, INITIAL_SUBMISSIONS, ALL_STUDENTS } from '@/data/mockData';

interface HomeworkContextType {
  homeworks: HomeworkItem[];
  submissions: SubmissionItem[];
  addHomework: (homework: Omit<HomeworkItem, 'homeworkId' | 'assignedDate' | 'status'>) => void;
  updateHomework: (homeworkId: string, data: Partial<HomeworkItem>) => void;
  deleteHomework: (homeworkId: string) => void;
  submitHomework: (homeworkId: string, studentId: string, studentName: string, seatNumber: number, file: string, note?: string) => void;
  gradeSubmission: (homeworkId: string, studentId: string, score: number, comment: string) => void;
  getHomeworkSubmissionsForRoster: (homeworkId: string) => {
    studentId: string;
    studentName: string;
    seatNumber: number;
    submission?: SubmissionItem;
    status: '未提交' | '已提交' | '迟交' | '已批改';
  }[];
}

const HomeworkContext = createContext<HomeworkContextType | undefined>(undefined);

const STORAGE_HW = 'class_connect_pro_homeworks';
const STORAGE_SUB = 'class_connect_pro_submissions';

export const HomeworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HW);
      return saved ? JSON.parse(saved) : INITIAL_HOMEWORKS;
    } catch {
      return INITIAL_HOMEWORKS;
    }
  });

  const [submissions, setSubmissions] = useState<SubmissionItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SUB);
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_HW, JSON.stringify(homeworks));
  }, [homeworks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_SUB, JSON.stringify(submissions));
  }, [submissions]);

  const addHomework = (data: Omit<HomeworkItem, 'homeworkId' | 'assignedDate' | 'status'>) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newHomework: HomeworkItem = {
      ...data,
      homeworkId: `HW${Date.now().toString().slice(-6)}`,
      assignedDate: formattedDate,
      status: '发布中',
    };

    setHomeworks((prev) => [newHomework, ...prev]);
  };

  const updateHomework = (homeworkId: string, data: Partial<HomeworkItem>) => {
    setHomeworks((prev) =>
      prev.map((hw) => (hw.homeworkId === homeworkId ? { ...hw, ...data } : hw))
    );
  };

  const deleteHomework = (homeworkId: string) => {
    setHomeworks((prev) => prev.filter((hw) => hw.homeworkId !== homeworkId));
    setSubmissions((prev) => prev.filter((sub) => sub.homeworkId !== homeworkId));
  };

  const submitHomework = (
    homeworkId: string,
    studentId: string,
    studentName: string,
    seatNumber: number,
    file: string,
    note?: string
  ) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Check if overdue
    const targetHw = homeworks.find((h) => h.homeworkId === homeworkId);
    let isLate = false;
    if (targetHw && targetHw.deadline) {
      const deadlineDate = new Date(targetHw.deadline);
      if (!isNaN(deadlineDate.getTime()) && now > deadlineDate) {
        isLate = true;
      }
    }

    const existingIndex = submissions.findIndex(
      (s) => s.homeworkId === homeworkId && s.studentId === studentId
    );

    const submissionData: SubmissionItem = {
      submissionId: existingIndex >= 0 ? submissions[existingIndex].submissionId : `SUB_${homeworkId}_${studentId}`,
      homeworkId,
      studentId,
      studentName,
      seatNumber,
      submittedDate: formattedDate,
      file,
      note,
      status: isLate ? '迟交' : '已提交',
      score: existingIndex >= 0 ? submissions[existingIndex].score : null,
      comment: existingIndex >= 0 ? submissions[existingIndex].comment : null,
    };

    if (existingIndex >= 0) {
      setSubmissions((prev) =>
        prev.map((s, idx) => (idx === existingIndex ? submissionData : s))
      );
    } else {
      setSubmissions((prev) => [...prev, submissionData]);
    }
  };

  const gradeSubmission = (homeworkId: string, studentId: string, score: number, comment: string) => {
    setSubmissions((prev) => {
      const existing = prev.find((s) => s.homeworkId === homeworkId && s.studentId === studentId);
      if (existing) {
        return prev.map((s) =>
          s.homeworkId === homeworkId && s.studentId === studentId
            ? { ...s, score, comment, status: '已批改' }
            : s
        );
      } else {
        const student = ALL_STUDENTS.find((st) => st.studentId === studentId);
        return [
          ...prev,
          {
            submissionId: `SUB_${homeworkId}_${studentId}`,
            homeworkId,
            studentId,
            studentName: student ? student.chineseName : '学生',
            seatNumber: student ? student.seatNo : 0,
            status: '已批改',
            score,
            comment,
          },
        ];
      }
    });
  };

  const getHomeworkSubmissionsForRoster = (homeworkId: string) => {
    const hwSubmissions = submissions.filter((s) => s.homeworkId === homeworkId);
    const targetHw = homeworks.find((h) => h.homeworkId === homeworkId);
    const now = new Date();

    return ALL_STUDENTS.map((st) => {
      const sub = hwSubmissions.find((s) => s.studentId === st.studentId || s.seatNumber === st.seatNo);
      let status: '未提交' | '已提交' | '迟交' | '已批改' = sub ? sub.status : '未提交';

      // Check if overdue for non-submitted
      if (!sub && targetHw?.deadline) {
        const d = new Date(targetHw.deadline);
        if (!isNaN(d.getTime()) && now > d) {
          status = '未提交'; // display as unsubmitted / overdue in UI badge
        }
      }

      return {
        studentId: st.studentId,
        studentName: st.chineseName,
        seatNumber: st.seatNo,
        submission: sub,
        status,
      };
    });
  };

  return (
    <HomeworkContext.Provider
      value={{
        homeworks,
        submissions,
        addHomework,
        updateHomework,
        deleteHomework,
        submitHomework,
        gradeSubmission,
        getHomeworkSubmissionsForRoster,
      }}
    >
      {children}
    </HomeworkContext.Provider>
  );
};

export const useHomework = () => {
  const context = useContext(HomeworkContext);
  if (!context) {
    throw new Error('useHomework must be used within a HomeworkProvider');
  }
  return context;
};
