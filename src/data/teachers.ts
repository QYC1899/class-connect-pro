export interface Teacher {
  teacherId: string; // T001 - T011
  name: string;
  subjects: string[];
  role: "教师";
}

// 教师账号（T001 - T011），依据 J203 现有科任老师名单整理。
// 同一位老师负责多科目的合并为一个账号（例：李佩清 负责 数学 与 品德与素养）。
export const teachers: Teacher[] = [
  { teacherId: "T001", name: "陈凯颖", subjects: ["华文"], role: "教师" },
  { teacherId: "T002", name: "Cikgu Munawwarah Rahim", subjects: ["国文"], role: "教师" },
  { teacherId: "T003", name: "蔡昊", subjects: ["英文"], role: "教师" },
  { teacherId: "T004", name: "李佩清", subjects: ["数学", "品德与素养"], role: "教师" },
  { teacherId: "T005", name: "韩詠欣", subjects: ["科学"], role: "教师" },
  { teacherId: "T006", name: "曾月婷", subjects: ["历史"], role: "教师" },
  { teacherId: "T007", name: "赵玮康", subjects: ["地理"], role: "教师" },
  { teacherId: "T008", name: "曹子豪", subjects: ["电脑"], role: "教师" },
  { teacherId: "T009", name: "陈秀珍", subjects: ["体育"], role: "教师" },
  { teacherId: "T010", name: "陈惠音", subjects: ["美术"], role: "教师" },
  { teacherId: "T011", name: "黄美琪", subjects: ["辅导活动"], role: "教师" },
];

export function findTeacherById(teacherId: string): Teacher | undefined {
  const id = teacherId.trim().toUpperCase();
  return teachers.find((t) => t.teacherId === id);
}

// 所有科目（供作业发布下拉框使用）
export const subjects: string[] = Array.from(
  new Set(teachers.flatMap((t) => t.subjects)),
);
