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

// Monday-Thursday schedule (14 periods)
export const monThuTimetable: TimetableEntry[] = [
  { time: "0730-0810", monday: "Science", tuesday: "Counseling Activities", wednesday: "Computer Science", thursday: "Mathematics", friday: "" },
  { time: "0810-0850", monday: "Science", tuesday: "Art", wednesday: "Computer Science", thursday: "Mathematics", friday: "" },
  { time: "0850-0910", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", isRecess: true },
  { time: "0910-0950", monday: "Malay", tuesday: "Self Reading", wednesday: "Mathematics", thursday: "Chinese", friday: "" },
  { time: "0950-1030", monday: "Chinese", tuesday: "Malay", wednesday: "Science", thursday: "Chinese", friday: "" },
  { time: "1030-1040", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", isRecess: true },
  { time: "1040-1120", monday: "Assembly", tuesday: "Moral Education", wednesday: "Malay", thursday: "Malay", friday: "" },
  { time: "1120-1200", monday: "Mathematics", tuesday: "Moral Education", wednesday: "Chinese", thursday: "Malay", friday: "" },
  { time: "1200-1250", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", isRecess: true },
  { time: "1250-1330", monday: "Chinese", tuesday: "Science", wednesday: "Geography", thursday: "Geography", friday: "" },
  { time: "1330-1410", monday: "English", tuesday: "Mathematics", wednesday: "English", thursday: "English", friday: "" },
  { time: "1410-1420", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", isRecess: true },
  { time: "1420-1500", monday: "Geography", tuesday: "Chinese", wednesday: "-", thursday: "History", friday: "" },
  { time: "1500-1540", monday: "History", tuesday: "English", wednesday: "-", thursday: "Science", friday: "" },
];

// Friday schedule (separate time slots)
export const fridayTimetable: TimetableEntry[] = [
  { time: "0730-0810", fridayTime: "0730-0810", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "History" },
  { time: "0810-0850", fridayTime: "0810-0850", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "Physical Education" },
  { time: "0850-0910", fridayTime: "0850-0910", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", isRecess: true },
  { time: "0910-0950", fridayTime: "0910-0950", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "Mathematics" },
  { time: "0950-1030", fridayTime: "0950-1030", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "Science" },
  { time: "1030-1040", fridayTime: "1030-1040", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", isRecess: true },
  { time: "1040-1120", fridayTime: "1040-1120", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "Chinese" },
  { time: "1120-1200", fridayTime: "1120-1200", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "English" },
  { time: "1200-1250", fridayTime: "1200-1250", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", isRecess: true },
  { time: "1250-1330", fridayTime: "1250-1330", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "Malay" },
  { time: "1330-1340", fridayTime: "1330-1340", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", isRecess: true },
  { time: "1340-1420", fridayTime: "1340-1420", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "Curricular Activities" },
  { time: "1420-1500", fridayTime: "1420-1500", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "Curricular Activities" },
  { time: "1500-1540", fridayTime: "1500-1540", monday: "", tuesday: "", wednesday: "", thursday: "", friday: "Curricular Activities" },
];

// Keep backward compatibility
export const timetable: TimetableEntry[] = [...monThuTimetable, ...fridayTimetable];

// Maps time slots to translation keys for bilingual recess labels
export const recessLabels: Record<string, string> = {
  "0850-0910": "timetable.recess_1",
  "1030-1040": "timetable.recess_2",
  "1200-1250": "timetable.recess_3",
};
