export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  classId: string;
  seatNumber?: number;
  studentId?: string;
  teacherId?: string;
  subjects?: string[];
  position?: string; // 干事职位，如：科学干事、班长、华文干事
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
  role: '教师';
  ig?: string | null;
}

export interface HomeworkItem {
  homeworkId: string;
  title: string;
  description: string; // 功课详情
  subject: string;
  classId: string;
  assignerId: string;
  assignerName: string; // 发布者
  assignerRole: string; // 发布者身份，如：教师、科学干事、班长
  assignedDate: string; // 发布日期
  deadline: string; // 呈交日期
  attachment?: string | null;
  status: '发布中' | '已截止';
}

export interface SubmissionItem {
  submissionId: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  seatNumber: number;
  submittedDate?: string;
  file?: string;
  note?: string;
  status: '未提交' | '已提交' | '迟交' | '已批改';
  score?: number | null;
  comment?: string | null;
}
