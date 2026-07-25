// 系统角色
export type Role = "student" | "teacher" | "assistant";

// 登录后的当前用户
export interface AuthUser {
  role: Role;
  id: string; // 学生学号 / 教师编号
  name: string;
  // 学生专属
  seatNo?: number;
  position?: string;
  // 教师专属
  subjects?: string[];
  className: string; // 统一为 J203
}

// 作业提交状态
export type SubmissionStatus = "未提交" | "已提交" | "迟交" | "已批改";

// 作业
export interface Homework {
  id: string;
  title: string;
  subject: string;
  description: string;
  classId: string; // J203
  assignerId: string; // 教师编号 / 助教学号
  assignerName: string;
  assignerRole: "教师" | "助教";
  assignedDate: string; // ISO
  deadline: string; // ISO
  attachmentName?: string;
  attachmentData?: string; // base64 data URL（附件）
}

// 提交记录
export interface Submission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  seatNo: number;
  submittedDate: string; // ISO
  fileName?: string;
  fileData?: string; // base64 data URL
  note?: string;
  status: Exclude<SubmissionStatus, "未提交">;
  score?: number;
  comment?: string;
}
