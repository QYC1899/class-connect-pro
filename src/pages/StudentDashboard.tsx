import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useHomework } from "@/context/HomeworkContext";
import { HomeworkItem } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  Award,
  Download,
  Calendar,
  Send,
  User,
  GraduationCap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { homeworks, submissions, submitHomework } = useHomework();
  const { toast } = useToast();

  const [selectedHw, setSelectedHw] = useState<HomeworkItem | null>(null);
  const [submissionFile, setSubmissionFile] = useState("");
  const [submissionNote, setSubmissionNote] = useState("");

  if (!user || user.role !== "student") {
    return null;
  }

  const studentSubmissions = submissions.filter(
    (s) => s.studentId === user.studentId || s.seatNumber === user.seatNumber
  );

  // Stats calculation
  const totalHomeworksCount = homeworks.length;

  const submittedHomeworkIds = new Set(
    studentSubmissions.filter((s) => s.status === "已提交" || s.status === "迟交" || s.status === "已批改").map((s) => s.homeworkId)
  );

  const pendingHomeworks = homeworks.filter((hw) => !submittedHomeworkIds.has(hw.homeworkId));
  const completedHomeworks = homeworks.filter((hw) => submittedHomeworkIds.has(hw.homeworkId));

  const gradedSubmissions = studentSubmissions.filter((s) => s.score !== null && s.score !== undefined);
  const averageScore = gradedSubmissions.length > 0
    ? Math.round(gradedSubmissions.reduce((acc, s) => acc + (s.score || 0), 0) / gradedSubmissions.length)
    : "-";

  const handleOpenSubmitModal = (hw: HomeworkItem) => {
    setSelectedHw(hw);
    const existingSub = studentSubmissions.find((s) => s.homeworkId === hw.homeworkId);
    if (existingSub) {
      setSubmissionFile(existingSub.file || `${user.name}_${hw.subject}作业.pdf`);
      setSubmissionNote(existingSub.note || "");
    } else {
      setSubmissionFile(`${user.name}_${hw.subject}作业.pdf`);
      setSubmissionNote("");
    }
  };

  const handleDoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHw) return;

    if (!submissionFile.trim()) {
      toast({ title: "提交失败", description: "请输入提交的附件文件名", variant: "destructive" });
      return;
    }

    submitHomework(
      selectedHw.homeworkId,
      user.studentId || user.id,
      user.name,
      user.seatNumber || 1,
      submissionFile,
      submissionNote
    );

    toast({
      title: "作业提交成功！",
      description: `《${selectedHw.title}》已成功上传并送达教师端`,
    });

    setSelectedHw(null);
  };

  return (
    <div className="space-y-8">
      {/* Student Welcome Banner */}
      <div className="rounded-2xl border bg-gradient-to-r from-primary/10 via-background to-secondary/30 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                学生个人主页
              </h1>
              <Badge variant="outline" className="text-xs border-primary/40 text-primary">
                J203 班级
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="font-semibold text-foreground">{user.name} 同学</span>
              <span>|</span>
              <span>座号：<strong className="text-foreground">{user.seatNumber < 10 ? `0${user.seatNumber}` : user.seatNumber}</strong></span>
              <span>|</span>
              <span>学号：{user.studentId}</span>
              {user.position && (
                <>
                  <span>|</span>
                  <Badge variant="secondary" className="text-[10px]">{user.position}</Badge>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right sm:border-l sm:pl-4">
              <div className="text-xs text-muted-foreground">待完成作业</div>
              <div className="text-2xl font-extrabold text-amber-600">{pendingHomeworks.length} 份</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">待完成作业</CardTitle>
            <Clock className="text-amber-500" size={18} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingHomeworks.length} 份</div>
            <p className="text-[11px] text-muted-foreground mt-1">请注意在截止日期前提交</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">已提交作业</CardTitle>
            <CheckCircle2 className="text-emerald-500" size={18} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{completedHomeworks.length} 份</div>
            <p className="text-[11px] text-muted-foreground mt-1">已成功推送至任课教师</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">平均学习得分</CardTitle>
            <Award className="text-primary" size={18} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{averageScore} {typeof averageScore === "number" ? "分" : ""}</div>
            <p className="text-[11px] text-muted-foreground mt-1">基于已批改作业统计</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs: Pending vs Completed */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-6">
          <TabsTrigger value="pending" className="gap-2 font-semibold">
            <Clock size={16} />
            待完成作业 ({pendingHomeworks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2 font-semibold">
            <CheckCircle2 size={16} />
            已提交作业 ({completedHomeworks.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Pending Homeworks */}
        <TabsContent value="pending" className="space-y-4">
          {pendingHomeworks.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <CheckCircle2 size={48} className="mx-auto text-emerald-500 mb-2" />
              <h3 className="text-base font-semibold text-foreground">太棒了！所有作业已完成</h3>
              <p className="text-xs mt-1">当前没有待完成的作业任务。</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingHomeworks.map((hw) => (
                <Card key={hw.homeworkId} className="shadow-sm border-amber-200/60 bg-card hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="default">{hw.subject}</Badge>
                      <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 text-[11px]">
                        未提交
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{hw.title}</CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1">
                      <GraduationCap size={14} />
                      布置人：{hw.assignerName} ({hw.assignerRole}) | ID: {hw.assignerId}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0">
                    <p className="text-xs text-muted-foreground bg-secondary/40 p-3 rounded-lg border">
                      {hw.description}
                    </p>

                    {hw.attachment && (
                      <div className="flex items-center justify-between text-xs p-2 rounded bg-secondary/60 border text-primary">
                        <span className="flex items-center gap-1.5 font-medium truncate">
                          <Download size={14} />
                          {hw.attachment}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0">附件讲义</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                      <span className="flex items-center gap-1 text-amber-600 font-medium">
                        <Calendar size={14} />
                        截止：{hw.deadline}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleOpenSubmitModal(hw)}
                        className="gap-1.5 font-semibold text-xs h-8"
                      >
                        <Upload size={14} />
                        上传并提交
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Completed Homeworks & Grades */}
        <TabsContent value="completed" className="space-y-4">
          {completedHomeworks.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              <BookOpen size={48} className="mx-auto text-muted-foreground/40 mb-2" />
              <h3 className="text-base font-semibold text-foreground">暂无已提交作业记录</h3>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedHomeworks.map((hw) => {
                const sub = studentSubmissions.find((s) => s.homeworkId === hw.homeworkId);

                return (
                  <Card key={hw.homeworkId} className="shadow-sm">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{hw.subject}</Badge>
                            <Badge
                              variant={sub?.status === "已批改" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {sub?.status || "已提交"}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-base mt-1">{hw.title}</h3>
                        </div>

                        {sub?.score !== null && sub?.score !== undefined && (
                          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg">
                            <Award className="text-primary" size={20} />
                            <div>
                              <div className="text-[10px] text-muted-foreground">教师评分</div>
                              <div className="text-lg font-black text-primary">{sub.score} 分</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Submission details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-secondary/30 p-3 rounded-lg border">
                        <div>
                          <span className="text-muted-foreground">我的提交文件：</span>
                          <span className="font-semibold text-primary">{sub?.file || "-"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">提交时间：</span>
                          <span className="font-medium text-foreground">{sub?.submittedDate || "-"}</span>
                        </div>
                        {sub?.note && (
                          <div className="col-span-1 sm:col-span-2">
                            <span className="text-muted-foreground">给老师留言：</span>
                            <span className="text-foreground">{sub.note}</span>
                          </div>
                        )}
                      </div>

                      {/* Teacher Comment */}
                      {sub?.comment && (
                        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 space-y-1">
                          <div className="font-bold flex items-center gap-1 text-emerald-800">
                            💬 教师评语 ({hw.assignerName} 老师):
                          </div>
                          <p className="italic">"{sub.comment}"</p>
                        </div>
                      )}

                      <div className="flex justify-end pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenSubmitModal(hw)}
                          className="text-xs h-7 gap-1"
                        >
                          <Upload size={12} />
                          重新提交附件
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Submission Modal Dialog */}
      {selectedHw && (
        <Dialog open={!!selectedHw} onOpenChange={() => setSelectedHw(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-lg flex items-center gap-2">
                <Upload className="text-primary" size={20} />
                作业提交：《{selectedHw.title}》
              </DialogTitle>
              <DialogDescription className="text-xs">
                系统将自动绑定您的个人信息：{user.name} (座号 {user.seatNumber}) · 学号 {user.studentId}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleDoSubmit} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="subFile" className="text-xs font-semibold">
                  附件文件名 / 上传说明 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subFile"
                  placeholder="例：陈伊萱_数学第五章作业.pdf"
                  value={submissionFile}
                  onChange={(e) => setSubmissionFile(e.target.value)}
                  required
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subNote" className="text-xs font-semibold">
                  做题备注 / 给老师留言（选填）
                </Label>
                <Textarea
                  id="subNote"
                  rows={3}
                  placeholder="例：老师，第8题用了公式法求解，请老师帮忙批改。"
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="rounded-lg bg-secondary/50 p-3 text-xs space-y-1 border">
                <div className="font-semibold text-foreground">📌 提交详情预览：</div>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>学生：<span className="text-foreground font-medium">{user.name}</span></div>
                  <div>座号：<span className="text-foreground font-medium">{user.seatNumber} 号</span></div>
                  <div>学号：<span className="text-foreground font-medium">{user.studentId}</span></div>
                  <div>接收老师：<span className="text-foreground font-medium">{selectedHw.assignerName} ({selectedHw.assignerRole})</span></div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSelectedHw(null)}>
                  取消
                </Button>
                <Button type="submit" className="gap-1 font-semibold">
                  <Send size={16} />
                  确认提交作业
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default StudentDashboard;
