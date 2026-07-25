import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useHomework } from "@/context/HomeworkContext";
import { HomeworkItem, SubmissionItem } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Plus,
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Users,
  Award,
  Edit,
  Trash2,
  Send,
  Eye,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    homeworks,
    addHomework,
    deleteHomework,
    gradeSubmission,
    getHomeworkSubmissionsForRoster
  } = useHomework();
  const { toast } = useToast();

  // Dialog State for Assign Homework
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState(user?.subjects?.[0] || "数学");
  const [newDescription, setNewDescription] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newAttachment, setNewAttachment] = useState("");

  // Selected Homework for Tracking / Grading
  const [selectedHw, setSelectedHw] = useState<HomeworkItem | null>(null);
  const [rosterFilter, setRosterFilter] = useState<"all" | "submitted" | "unsubmitted" | "graded">("all");

  // Grading Modal State
  const [gradingStudent, setGradingStudent] = useState<{
    studentId: string;
    studentName: string;
    seatNumber: number;
    submission?: SubmissionItem;
  } | null>(null);
  const [gradeScore, setGradingScore] = useState<number>(90);
  const [gradeComment, setGradingComment] = useState("");

  if (!user || (user.role !== "teacher" && user.role !== "assistant")) {
    return null;
  }

  // Filter homeworks published by this teacher/assistant or show all for management
  const myHomeworks = homeworks;

  // Calculate statistics
  const totalHomeworksCount = myHomeworks.length;

  let totalExpectedSubmissions = totalHomeworksCount * 46;
  let totalSubmittedCount = 0;
  let totalPendingGradingCount = 0;

  myHomeworks.forEach((hw) => {
    const roster = getHomeworkSubmissionsForRoster(hw.homeworkId);
    roster.forEach((r) => {
      if (r.submission) {
        totalSubmittedCount++;
        if (r.submission.status === "已提交" || r.submission.status === "迟交") {
          totalPendingGradingCount++;
        }
      }
    });
  });

  const overallSubmissionRate = totalExpectedSubmissions > 0
    ? Math.round((totalSubmittedCount / totalExpectedSubmissions) * 100)
    : 0;

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast({ title: "发布失败", description: "请输入作业标题", variant: "destructive" });
      return;
    }

    addHomework({
      title: newTitle,
      subject: newSubject,
      description: newDescription,
      classId: "J203",
      assignerId: user.teacherId || user.id,
      assignerName: user.name,
      assignerRole: user.role === "assistant" ? "助教" : "教师",
      deadline: newDeadline || "2026-08-10 23:59",
      attachment: newAttachment || null,
    });

    toast({
      title: "作业发布成功！",
      description: `已自动绑定绑定 J203 全体 46 位同学，布置人：${user.name} (${user.role === "assistant" ? "助教" : "教师"})`,
    });

    // Reset Form
    setNewTitle("");
    setNewDescription("");
    setNewDeadline("");
    setNewAttachment("");
    setIsAssignDialogOpen(false);
  };

  const handleDeleteHomework = (hwId: string, title: string) => {
    if (confirm(`确定要删除作业《${title}》吗？相关学生的提交记录也将被清空。`)) {
      deleteHomework(hwId);
      if (selectedHw?.homeworkId === hwId) {
        setSelectedHw(null);
      }
      toast({ title: "删除成功", description: `已删除作业《${title}》` });
    }
  };

  const handleOpenGradingModal = (item: {
    studentId: string;
    studentName: string;
    seatNumber: number;
    submission?: SubmissionItem;
  }) => {
    setGradingStudent(item);
    setGradingScore(item.submission?.score ?? 90);
    setGradingComment(item.submission?.comment ?? "解答过程清晰，表现优异！");
  };

  const handleSaveGrade = () => {
    if (!selectedHw || !gradingStudent) return;
    gradeSubmission(
      selectedHw.homeworkId,
      gradingStudent.studentId,
      gradeScore,
      gradeComment
    );
    toast({
      title: "批改保存成功",
      description: `已为 ${gradingStudent.studentName} 同学提交评分 (${gradeScore}分)`,
    });
    setGradingStudent(null);
  };

  // Compute selected homework roster details
  const currentRoster = selectedHw ? getHomeworkSubmissionsForRoster(selectedHw.homeworkId) : [];

  const filteredRoster = currentRoster.filter((r) => {
    if (rosterFilter === "submitted") return r.status === "已提交" || r.status === "迟交" || r.status === "已批改";
    if (rosterFilter === "unsubmitted") return r.status === "未提交";
    if (rosterFilter === "graded") return r.status === "已批改";
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              教师工作台 · J203 班级
            </h1>
            <Badge variant="default" className="text-xs px-2.5 py-0.5">
              {user.role === "assistant" ? "助教" : "教师"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            欢迎您，<span className="font-semibold text-foreground">{user.name}</span>{" "}
            {user.subjects && `(${user.subjects.join("、")})`} | 教师编号: {user.teacherId}
          </p>
        </div>

        {/* Publish Homework Button */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-md hover:shadow-lg transition-all font-semibold">
              <Plus size={18} />
              发布新作业
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <BookOpen className="text-primary" size={20} />
                发布作业给 J203 全体学生
              </DialogTitle>
              <DialogDescription className="text-xs">
                系统将自动绑定 J203 班级 46 位同学，并实时同步至学生作业主页。
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateHomework} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-semibold">
                  作业标题 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="例：数学第五章《一元二次方程》练习题"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="h-10 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="subject" className="text-xs font-semibold">
                    科目
                  </Label>
                  <Select value={newSubject} onValueChange={setNewSubject}>
                    <SelectTrigger id="subject" className="h-10 text-sm">
                      <SelectValue placeholder="选择科目" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="数学">数学</SelectItem>
                      <SelectItem value="华文">华文</SelectItem>
                      <SelectItem value="国文">国文</SelectItem>
                      <SelectItem value="英文">英文</SelectItem>
                      <SelectItem value="科学">科学</SelectItem>
                      <SelectItem value="历史">历史</SelectItem>
                      <SelectItem value="地理">地理</SelectItem>
                      <SelectItem value="品德与素养">品德与素养</SelectItem>
                      <SelectItem value="电脑">电脑</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="deadline" className="text-xs font-semibold">
                    截止日期与时间
                  </Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="h-10 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold">
                  作业详细说明 / 要求
                </Label>
                <Textarea
                  id="description"
                  placeholder="请说明具体的完成要求、参考页码或解答格式..."
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="attachment" className="text-xs font-semibold">
                  附件文件名（选填）
                </Label>
                <Input
                  id="attachment"
                  placeholder="例：第五章_导学案.pdf"
                  value={newAttachment}
                  onChange={(e) => setNewAttachment(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>

              {/* Auto Recorded Information */}
              <div className="rounded-lg bg-secondary/60 p-3 text-xs space-y-1 border border-border/60">
                <div className="font-semibold text-foreground">📌 自动记录布置人信息：</div>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>布置人：<span className="text-foreground font-medium">{user.name}</span></div>
                  <div>身份：<span className="text-foreground font-medium">{user.role === "assistant" ? "助教" : "教师"}</span></div>
                  <div>教师编号：<span className="text-foreground font-medium">{user.teacherId}</span></div>
                  <div>班级：<span className="text-foreground font-medium">J203 (46人)</span></div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  取消
                </Button>
                <Button type="submit" className="gap-1 font-semibold">
                  <Send size={16} />
                  确认发布
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">已发布作业</CardTitle>
            <BookOpen className="text-primary" size={18} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHomeworksCount} 份</div>
            <p className="text-[11px] text-muted-foreground mt-1">关联 J203 班级全体学生</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">待批改作业</CardTitle>
            <Clock className="text-amber-500" size={18} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{totalPendingGradingCount} 份</div>
            <p className="text-[11px] text-muted-foreground mt-1">学生已提交，等待教师评分</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">班级平均提交率</CardTitle>
            <CheckCircle2 className="text-emerald-500" size={18} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{overallSubmissionRate}%</div>
            <p className="text-[11px] text-muted-foreground mt-1">基于 46 位同学综合统计</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">全班总人数</CardTitle>
            <Users className="text-blue-500" size={18} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">46 人</div>
            <p className="text-[11px] text-muted-foreground mt-1">J203 班级全体名单已接入</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: Homework List & Tracking Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Published Homework List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              已发布作业列表 ({myHomeworks.length})
            </h2>
          </div>

          <div className="space-y-3">
            {myHomeworks.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground text-sm">
                暂无作业，点击上方“发布新作业”开始布置。
              </Card>
            ) : (
              myHomeworks.map((hw) => {
                const roster = getHomeworkSubmissionsForRoster(hw.homeworkId);
                const submitted = roster.filter((r) => r.submission).length;
                const isSelected = selectedHw?.homeworkId === hw.homeworkId;

                return (
                  <Card
                    key={hw.homeworkId}
                    className={`cursor-pointer transition-all hover:border-primary/60 shadow-sm ${
                      isSelected ? "border-2 border-primary bg-primary/5 shadow-md" : ""
                    }`}
                    onClick={() => setSelectedHw(hw)}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs bg-background">
                              {hw.subject}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px]">
                              {hw.assignerRole}: {hw.assignerName}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-base text-foreground leading-snug">
                            {hw.title}
                          </h3>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteHomework(hw.homeworkId, hw.title);
                          }}
                          title="删除作业"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {hw.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          截止：{hw.deadline}
                        </span>
                        <span className="font-medium text-primary flex items-center gap-1">
                          <Users size={13} />
                          已交 {submitted} / 46人
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Submission Roster & Grading */}
        <div className="lg:col-span-7">
          {selectedHw ? (
            <Card className="shadow-md border-primary/20">
              <CardHeader className="pb-3 border-b bg-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">{selectedHw.subject}</Badge>
                      <span className="text-xs text-muted-foreground">编号：{selectedHw.homeworkId}</span>
                    </div>
                    <CardTitle className="text-xl mt-1">{selectedHw.title}</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      布置人：{selectedHw.assignerName} ({selectedHw.assignerRole}) | 截止日期：{selectedHw.deadline}
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs font-semibold py-1">
                      提交率：{Math.round((currentRoster.filter(r => r.submission).length / 46) * 100)}%
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-4">
                {/* Roster Filter Tabs */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-xs">
                    <Button
                      variant={rosterFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRosterFilter("all")}
                      className="h-8 text-xs px-3"
                    >
                      全部学生 (46)
                    </Button>
                    <Button
                      variant={rosterFilter === "submitted" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRosterFilter("submitted")}
                      className="h-8 text-xs px-3 text-emerald-600 border-emerald-300"
                    >
                      已提交 ({currentRoster.filter(r => r.submission).length})
                    </Button>
                    <Button
                      variant={rosterFilter === "unsubmitted" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRosterFilter("unsubmitted")}
                      className="h-8 text-xs px-3 text-amber-600 border-amber-300"
                    >
                      未提交 ({currentRoster.filter(r => !r.submission).length})
                    </Button>
                  </div>
                </div>

                {/* Table of 46 students in J203 */}
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-secondary/50">
                      <TableRow>
                        <TableHead className="w-16 text-center text-xs">座号</TableHead>
                        <TableHead className="text-xs">姓名 / 学号</TableHead>
                        <TableHead className="text-xs">提交状态</TableHead>
                        <TableHead className="text-xs">成绩 / 评语</TableHead>
                        <TableHead className="text-right text-xs">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRoster.map((item) => {
                        const sub = item.submission;
                        return (
                          <TableRow key={item.studentId} className="hover:bg-secondary/30">
                            <TableCell className="text-center font-bold text-xs">
                              {item.seatNumber < 10 ? `0${item.seatNumber}` : item.seatNumber}
                            </TableCell>
                            <TableCell>
                              <div className="font-semibold text-xs text-foreground">{item.studentName}</div>
                              <div className="text-[10px] text-muted-foreground">ID: {item.studentId}</div>
                            </TableCell>
                            <TableCell>
                              {sub ? (
                                <Badge
                                  variant={
                                    sub.status === "已批改"
                                      ? "default"
                                      : sub.status === "迟交"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                  className="text-[11px] px-2 py-0.5"
                                >
                                  {sub.status}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[11px] text-amber-600 border-amber-300 bg-amber-50">
                                  未提交
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {sub?.score !== undefined && sub?.score !== null ? (
                                <div>
                                  <span className="font-bold text-xs text-emerald-600">{sub.score} 分</span>
                                  {sub.comment && (
                                    <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                                      "{sub.comment}"
                                    </p>
                                  )}
                                </div>
                              ) : sub ? (
                                <span className="text-xs text-amber-500 font-medium">待批改</span>
                              ) : (
                                <span className="text-xs text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant={sub?.status === "已批改" ? "outline" : "default"}
                                className="h-7 text-xs px-2.5 gap-1"
                                onClick={() => handleOpenGradingModal(item)}
                              >
                                <Award size={13} />
                                {sub?.status === "已批改" ? "修改成绩" : "批改作业"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full min-h-[350px] flex flex-col items-center justify-center p-8 text-center border-dashed">
              <BookOpen size={48} className="text-muted-foreground/40 mb-3" />
              <h3 className="text-base font-semibold text-foreground">选择一份作业查看追踪</h3>
              <p className="text-xs text-muted-foreground max-w-sm mt-1">
                点击左侧列表中的作业，可以实时追踪全班 46 位同学的提交状态，并进行批改和打分。
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Grading Modal Dialog */}
      {gradingStudent && selectedHw && (
        <Dialog open={!!gradingStudent} onOpenChange={() => setGradingStudent(null)}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle className="text-lg flex items-center gap-2">
                <Award className="text-primary" size={20} />
                批改作业：{gradingStudent.studentName} 同学 (座号 {gradingStudent.seatNumber})
              </DialogTitle>
              <DialogDescription className="text-xs">
                作业: 《{selectedHw.title}》
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {gradingStudent.submission?.file && (
                <div className="rounded-lg bg-secondary/50 p-3 text-xs space-y-1">
                  <div className="font-semibold text-foreground">📄 学生提交的附件 / 说明：</div>
                  <div className="text-primary font-medium">{gradingStudent.submission.file}</div>
                  {gradingStudent.submission.note && (
                    <div className="text-muted-foreground">留言: "{gradingStudent.submission.note}"</div>
                  )}
                  <div className="text-[10px] text-muted-foreground pt-1">
                    提交时间：{gradingStudent.submission.submittedDate || "暂无记录"}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="score" className="text-xs font-semibold">
                  打分 (0 - 100 分)
                </Label>
                <Input
                  id="score"
                  type="number"
                  min={0}
                  max={100}
                  value={gradeScore}
                  onChange={(e) => setGradingScore(Number(e.target.value))}
                  className="h-10 text-sm font-bold text-primary"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="comment" className="text-xs font-semibold">
                  教师评语
                </Label>
                <Textarea
                  id="comment"
                  rows={3}
                  placeholder="请输入对该学生的作业点评与建议..."
                  value={gradeComment}
                  onChange={(e) => setGradingComment(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setGradingStudent(null)}>
                取消
              </Button>
              <Button onClick={handleSaveGrade} className="gap-1 font-semibold">
                <Check size={16} />
                保存成绩与评语
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TeacherDashboard;
