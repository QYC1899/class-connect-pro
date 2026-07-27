export type UserRole = 'student' | 'teacher';

export type ContentCategory = 'quiz' | 'homework' | 'project' | 'announcement';

export const subjectAssistants = [
  "华文干事",
  "英文干事",
  "国文干事",
  "数学干事",
  "科学干事",
  "历史干事",
  "地理干事",
  "电脑干事",
  "美术干事",
  "体育干事",
];

export const classAssistants = [
  "班长",
  "风纪",
  "财政干事",
  "辅导干事",
  "文书干事",
  "图书干事",
  "多媒体干事",
  "美化干事",
  "食堂小组",
  "服务干事",
  "宣导干事",
  "卫生干事",
  "环保干事",
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
