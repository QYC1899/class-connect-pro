import { useSyncExternalStore } from "react";
import type { Homework, Submission } from "@/types";

const HOMEWORK_KEY = "ccp_homework";
const SUBMISSION_KEY = "ccp_submissions";

// ---- 轻量级 localStorage 响应式存储 ----

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === HOMEWORK_KEY || e.key === SUBMISSION_KEY) emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value));
  emit();
}

// ---- 缓存快照（useSyncExternalStore 要求返回稳定引用）----

let homeworkCache: Homework[] | null = null;
let submissionCache: Submission[] | null = null;

function getHomeworkSnapshot(): Homework[] {
  const current = read<Homework>(HOMEWORK_KEY);
  if (
    !homeworkCache ||
    JSON.stringify(homeworkCache) !== JSON.stringify(current)
  ) {
    homeworkCache = current;
  }
  return homeworkCache;
}

function getSubmissionSnapshot(): Submission[] {
  const current = read<Submission>(SUBMISSION_KEY);
  if (
    !submissionCache ||
    JSON.stringify(submissionCache) !== JSON.stringify(current)
  ) {
    submissionCache = current;
  }
  return submissionCache;
}

// ---- Hooks ----

export function useHomework(): Homework[] {
  return useSyncExternalStore(subscribe, getHomeworkSnapshot, getHomeworkSnapshot);
}

export function useSubmissions(): Submission[] {
  return useSyncExternalStore(
    subscribe,
    getSubmissionSnapshot,
    getSubmissionSnapshot,
  );
}

// ---- 作业操作 ----

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

export function addHomework(
  data: Omit<Homework, "id" | "assignedDate" | "classId">,
): Homework {
  const list = read<Homework>(HOMEWORK_KEY);
  const hw: Homework = {
    ...data,
    id: uid("hw"),
    classId: "J203",
    assignedDate: new Date().toISOString(),
  };
  write(HOMEWORK_KEY, [hw, ...list]);
  return hw;
}

export function updateHomework(id: string, patch: Partial<Homework>) {
  const list = read<Homework>(HOMEWORK_KEY);
  write(
    HOMEWORK_KEY,
    list.map((h) => (h.id === id ? { ...h, ...patch } : h)),
  );
}

export function deleteHomework(id: string) {
  const list = read<Homework>(HOMEWORK_KEY);
  write(
    HOMEWORK_KEY,
    list.filter((h) => h.id !== id),
  );
  // 连带删除该作业的提交记录
  const subs = read<Submission>(SUBMISSION_KEY);
  write(
    SUBMISSION_KEY,
    subs.filter((s) => s.homeworkId !== id),
  );
}

export function getHomeworkById(id: string): Homework | undefined {
  return read<Homework>(HOMEWORK_KEY).find((h) => h.id === id);
}

// ---- 提交操作 ----

export function upsertSubmission(
  data: Omit<Submission, "id" | "submittedDate" | "status"> & {
    deadline: string;
  },
): Submission {
  const { deadline, ...rest } = data;
  const list = read<Submission>(SUBMISSION_KEY);
  const existing = list.find(
    (s) => s.homeworkId === rest.homeworkId && s.studentId === rest.studentId,
  );
  const now = new Date();
  const late = now.getTime() > new Date(deadline).getTime();
  const status: Submission["status"] = late ? "迟交" : "已提交";

  if (existing) {
    const updated: Submission = {
      ...existing,
      ...rest,
      submittedDate: now.toISOString(),
      // 已批改的重新提交仍标记为已提交/迟交
      status,
      score: undefined,
      comment: undefined,
    };
    write(
      SUBMISSION_KEY,
      list.map((s) => (s.id === existing.id ? updated : s)),
    );
    return updated;
  }

  const sub: Submission = {
    ...rest,
    id: uid("sub"),
    submittedDate: now.toISOString(),
    status,
  };
  write(SUBMISSION_KEY, [sub, ...list]);
  return sub;
}

export function gradeSubmission(id: string, score: number, comment: string) {
  const list = read<Submission>(SUBMISSION_KEY);
  write(
    SUBMISSION_KEY,
    list.map((s) =>
      s.id === id ? { ...s, score, comment, status: "已批改" } : s,
    ),
  );
}
