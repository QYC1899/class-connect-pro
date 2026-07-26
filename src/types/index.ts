export type UserRole = 'student' | 'teacher';

export type ContentCategory = 'quiz' | 'homework' | 'project' | 'announcement';

export const subjectAssistants = [
  "Chinese Assistant",
  "English Assistant",
  "Malay Assistant",
  "Mathematics Assistant",
  "Science Assistant",
  "History Assistant",
  "Geography Assistant",
  "Computer Assistant",
  "Art Assistant",
  "Physical Education Assistant",
];

export const classAssistants = [
  "Class Monitor",
  "Discipline",
  "Treasurer",
  "Counseling Assistant",
  "Secretary",
  "Librarian",
  "Multimedia Assistant",
  "Beautification",
  "Canteen Group",
  "Service",
  "Publicity",
  "Hygiene",
  "Environmental",
];

export interface User {
  id: string;
  name: string;
  role: UserRole;
  classId: string;
  seatNumber?: number;
  studentId?: string;
  teacherId?: string;
  subjects?: string[];
  position?: string; // Position such as: Science Assistant, Class Monitor, Chinese Assistant
}

export interface StudentItem {
  seatNo: number;
  chineseName: string;
  englishName: string;
  studentId: string;
  position: string;
  classId: string;
}

export interface TeacherItem {
  teacherId: string;
  name: string;
  subjects: string[];
  role: 'Teacher' | 'Teaching Assistant';
  ig?: string | null;
}

export interface ContentItem {
  contentId: string;
  category: ContentCategory;
  title: string;
  description: string; // Homework details
  subject?: string; // Subject - can be filled by subject assistants or teachers
  classId: string;
  assignerId: string;
  assignerName: string; // Publisher name
  assignerRole: string; // Publisher role such as: Teacher, Science Assistant, Class Monitor
  assignedDate: string; // Publish date
  deadline: string; // Submission date
  attachment?: string | null;
  status: 'Published' | 'Closed';
}

export interface ReadStatusItem {
  readId: string;
  contentId: string;
  studentId: string;
  studentName: string;
  seatNumber: number;
  isRead: boolean;
  readDate?: string;
}

