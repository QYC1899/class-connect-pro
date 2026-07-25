export interface TimetableEntry {
  time: string;
  fridayTime?: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  isRecess?: boolean;
}

export const timetable: TimetableEntry[] = [
  { time: "0730-0810", monday: "科学 Science", tuesday: "辅导活动 Counseling Activities", wednesday: "电脑 Computer Science", thursday: "数学 Maths", friday: "历史 History" },
  { time: "0810-0850", monday: "科学 Science", tuesday: "美术 Art", wednesday: "电脑 Computer Science", thursday: "数学 Maths", friday: "体育 P.E." },
  { time: "0850-0910", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", isRecess: true },
  { time: "0910-0950", monday: "国文 Malay", tuesday: "自主阅读 Self Reading", wednesday: "数学 Maths", thursday: "华文 Chinese", friday: "数学 Maths" },
  { time: "0950-1030", monday: "华文 Chinese", tuesday: "国文 Malay", wednesday: "科学 Science", thursday: "华文 Chinese", friday: "科学 Science" },
  { time: "1030-1040", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", isRecess: true },
  { time: "1040-1120", monday: "周会/班会 Assembly", tuesday: "品德素养 Moral", wednesday: "国文 Malay", thursday: "国文 Malay", friday: "华文 Chinese" },
  { time: "1120-1200", monday: "数学 Maths", tuesday: "品德素养 Moral", wednesday: "华文 Chinese", thursday: "国文 Malay", friday: "英文 English" },
  { time: "1200-1250", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", isRecess: true },
  { time: "1250-1330", monday: "华文 Chinese", tuesday: "科学 Science", wednesday: "地理 Geography", thursday: "地理 Geography", friday: "国文 Malay" },
  { time: "1330-1410", fridayTime: "1340-1420", monday: "英文 English", tuesday: "数学 Maths", wednesday: "英文 English", thursday: "英文 English", friday: "联课活动 Curricular Activities" },
  { time: "1410-1420", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", isRecess: true },
  { time: "1420-1500", fridayTime: "1420-1500", monday: "地理 Geography", tuesday: "华文 Chinese", wednesday: "-", thursday: "历史 History", friday: "联课活动 Curricular Activities" },
  { time: "1500-1540", fridayTime: "1500-1540", monday: "历史 History", tuesday: "英文 English", wednesday: "-", thursday: "科学 Science", friday: "联课活动 Curricular Activities" },
];

export const recessLabels: Record<string, string> = {
  "0850-0910": "Recess 1 (20 min)",
  "1030-1040": "Recess 2 (10 min)",
  "1200-1250": "Recess 3 (50 min)",
  "1410-1420": "",
};
