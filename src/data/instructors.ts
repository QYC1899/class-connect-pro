export interface Instructor {
  subject: string;
  name: string;
  ig: string | null; // null means unknown
}

export const instructors: Instructor[] = [
  { subject: "Chinese", name: "陈凯颖", ig: "kaiyintan__" },
  { subject: "Malay", name: "Cikgu Munawwarah Rahim", ig: "munawwarahrahim_" },
  { subject: "English", name: "蔡昊", ig: "elsenchai" },
  { subject: "Mathematics", name: "李佩清", ig: "peiching2226 & teacherangelacover" },
  { subject: "Science", name: "韩詠欣", ig: "catherine.g.z.w" },
  { subject: "History", name: "曾月婷", ig: "y.ting_513 & cyt_2023.00" },
  { subject: "Geography", name: "赵玮康", ig: "xiao_daizz" },
  { subject: "Moral Education", name: "李佩清", ig: "peiching2226 & teacherangelacover" },
  { subject: "Computer", name: "曹子豪", ig: null },
  { subject: "Physical Education", name: "陈秀珍", ig: null },
  { subject: "Art", name: "陈惠音", ig: null },
  { subject: "Counseling", name: "黄美琪", ig: null },
];
