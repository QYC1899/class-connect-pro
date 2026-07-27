import React, { createContext, useContext, useState, useEffect } from 'react';
import { ContentItem, ReadStatusItem, ContentCategory, subjectAssistants, classAssistants, User } from '@/types';
import { INITIAL_CONTENTS, INITIAL_READ_STATUS, ALL_STUDENTS } from '@/data/mockData';

interface HomeworkContextType {
  contents: ContentItem[];
  readStatuses: ReadStatusItem[];
  addContent: (content: Omit<ContentItem, 'contentId' | 'assignedDate' | 'status'>) => { success: boolean; message: string };
  updateContent: (contentId: string, data: Partial<ContentItem>) => void;
  deleteContent: (contentId: string, user: User | null) => { success: boolean; message: string };
  getContentsByCategory: (category: ContentCategory) => ContentItem[];
  markAsRead: (contentId: string, studentId: string) => void;
  getReadStatusForContent: (contentId: string) => {
    studentId: string;
    studentName: string;
    seatNumber: number;
    isRead: boolean;
    readDate?: string;
  }[];
  canUserPublish: (userPosition: string | undefined, userRole: string, category: ContentCategory) => boolean;
  canUserDelete: (content: ContentItem, user: User | null) => boolean;
  categoryLabel: (category: ContentCategory) => string;
}

const HomeworkContext = createContext<HomeworkContextType | undefined>(undefined);

const STORAGE_CONTENTS = 'class_connect_pro_contents';
const STORAGE_READ = 'class_connect_pro_readstatus';

const isSubjectAssistant = (position: string) => subjectAssistants.includes(position);
const isClassAssistant = (position: string) => classAssistants.includes(position);

const getCategoryLabel = (category: ContentCategory): string => {
  const labels: Record<ContentCategory, string> = {
    quiz: 'Quiz',
    homework: 'Homework',
    project: 'Project',
    announcement: 'Announcement',
  };
  return labels[category];
};

export const HomeworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contents, setContents] = useState<ContentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CONTENTS);
      return saved ? JSON.parse(saved) : INITIAL_CONTENTS;
    } catch {
      return INITIAL_CONTENTS;
    }
  });

  const [readStatuses, setReadStatuses] = useState<ReadStatusItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_READ);
      return saved ? JSON.parse(saved) : INITIAL_READ_STATUS;
    } catch {
      return INITIAL_READ_STATUS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_CONTENTS, JSON.stringify(contents));
  }, [contents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_READ, JSON.stringify(readStatuses));
  }, [readStatuses]);

  const addContent = (data: Omit<ContentItem, 'contentId' | 'assignedDate' | 'status'>) => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeInMinutes = hours * 60 + minutes;
    const RESTRICT_START = 20 * 60 + 30;
    const RESTRICT_END = 6 * 60;

    if (currentTimeInMinutes >= RESTRICT_START || currentTimeInMinutes < RESTRICT_END) {
      return {
        success: false,
        message: 'Cannot publish during this time period (20:30 ~ 06:00 next day). Please publish between 06:00 AM and 20:30 PM.',
      };
    }

    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const prefix: Record<ContentCategory, string> = {
      quiz: 'QZ',
      homework: 'HW',
      project: 'PR',
      announcement: 'AN',
    };

    const newContent: ContentItem = {
      ...data,
      contentId: `${prefix[data.category]}${Date.now().toString().slice(-6)}`,
      assignedDate: formattedDate,
      status: 'Published',
    };

    setContents((prev) => [newContent, ...prev]);
    return { success: true, message: `${getCategoryLabel(data.category)} published successfully!` };
  };

  const updateContent = (contentId: string, data: Partial<ContentItem>) => {
    setContents((prev) =>
      prev.map((c) => (c.contentId === contentId ? { ...c, ...data } : c))
    );
  };

  const deleteContent = (contentId: string, user: User | null) => {
    const content = contents.find(c => c.contentId === contentId);
    if (!content) {
      return { success: false, message: 'Content not found' };
    }

    if (!canUserDelete(content, user)) {
      return { success: false, message: 'You do not have permission to delete this content' };
    }

    setContents((prev) => prev.filter((c) => c.contentId !== contentId));
    setReadStatuses((prev) => prev.filter((r) => r.contentId !== contentId));
    return { success: true, message: 'Content deleted successfully' };
  };

  const getContentsByCategory = (category: ContentCategory) => {
    return contents.filter((c) => c.category === category);
  };

  const markAsRead = (contentId: string, studentId: string) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const existing = readStatuses.find(
      (r) => r.contentId === contentId && r.studentId === studentId
    );

    if (existing) {
      setReadStatuses((prev) =>
        prev.map((r) =>
          r.readId === existing.readId ? { ...r, isRead: true, readDate: formattedDate } : r
        )
      );
    } else {
      const student = ALL_STUDENTS.find((s) => s.studentId === studentId);
      const newRead: ReadStatusItem = {
        readId: `READ_${contentId}_${studentId}`,
        contentId,
        studentId,
        studentName: student?.chineseName || 'Student',
        seatNumber: student?.seatNo || 0,
        isRead: true,
        readDate: formattedDate,
      };
      setReadStatuses((prev) => [...prev, newRead]);
    }
  };

  const getReadStatusForContent = (contentId: string) => {
    const contentReadStatuses = readStatuses.filter((r) => r.contentId === contentId);

    return ALL_STUDENTS.map((st) => {
      const status = contentReadStatuses.find(
        (r) => r.studentId === st.studentId || r.seatNumber === st.seatNo
      );
      return {
        studentId: st.studentId,
        studentName: st.chineseName,
        seatNumber: st.seatNo,
        isRead: status?.isRead || false,
        readDate: status?.readDate,
      };
    });
  };

  const canUserPublish = (userPosition: string | undefined, userRole: string, category: ContentCategory): boolean => {
    if (userRole === 'teacher') return true;

    if (userRole === 'student' && userPosition) {
      if (category === 'announcement') {
        return isClassAssistant(userPosition);
      }
      if (category === 'quiz' || category === 'homework' || category === 'project') {
        return isSubjectAssistant(userPosition);
      }
    }

    return false;
  };

  const canUserDelete = (content: ContentItem, user: User | null): boolean => {
    // Teachers can delete any content
    if (user?.role === 'teacher') return true;

    // Students cannot delete content
    if (user?.role === 'student') return false;

    return false;
  };

  const categoryLabel = (category: ContentCategory): string => {
    return getCategoryLabel(category);
  };

  return (
    <HomeworkContext.Provider
      value={{
        contents,
        readStatuses,
        addContent,
        updateContent,
        deleteContent,
        getContentsByCategory,
        markAsRead,
        getReadStatusForContent,
        canUserPublish,
        canUserDelete,
        categoryLabel,
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

