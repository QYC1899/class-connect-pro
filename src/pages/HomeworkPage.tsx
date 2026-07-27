import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useHomework } from "@/context/HomeworkContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Eye,
  Send,
  Trash2,
  Calendar,
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categoryTabs: { key: "quiz" | "homework" | "project" | "announcement"; labelKey: string }[] = [
  { key: "quiz", labelKey: "category.quiz" },
  { key: "homework", labelKey: "category.homework" },
  { key: "project", labelKey: "category.project" },
  { key: "announcement", labelKey: "category.announcement" },
];

const HomeworkPage: React.FC = () => {
  const { user } = useAuth();
  const { contents, addContent, deleteContent, markAsRead, getReadStatusForContent } = useHomework();
  const { t, translateSubject, translateCategory } = useLanguage();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"quiz" | "homework" | "project" | "announcement">("homework");
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [pubCategory, setPubCategory] = useState<"quiz" | "homework" | "project" | "announcement">("homework");
  const [pubTitle, setPubTitle] = useState("");
  const [pubSubject, setPubSubject] = useState("Mathematics");
  const [pubDetails, setPubDetails] = useState("");
  const [pubDeadline, setPubDeadline] = useState("");
  const [pubAttachment, setPubAttachment] = useState("");

  const [selectedContent, setSelectedContent] = useState<typeof contents[0] | null>(null);
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");

  if (!user) return null;

  const displayContents = contents.filter(c => c.classId === "J203");
  const currentContents = displayContents.filter(c => c.category === activeTab);
  const canPublish = user.role === "teacher" || (user.position && user.position !== "");
  const categoryLabel = translateCategory(activeTab);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubTitle.trim()) {
      toast({ title: t("hw.publish_error"), description: "Please enter a title", variant: "destructive" });
      return;
    }

    const result = addContent({
      category: activeTab,
      title: pubTitle,
      description: pubDetails,
      subject: activeTab === "announcement" ? "" : pubSubject,
      classId: "J203",
      assignerId: user.teacherId || user.id,
      assignerName: user.name,
      assignerRole: user.role === "teacher" ? t("role.teacher") : (user.position || t("role.student")),
      deadline: pubDeadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      attachment: pubAttachment || null,
    });

    if (result.success) {
      toast({ title: t("hw.publish_success"), description: result.message });
      setPubTitle("");
      setPubDetails("");
      setPubDeadline("");
      setPubAttachment("");
      setIsPublishOpen(false);
    } else {
      toast({ title: t("time.restrict_title"), description: result.message, variant: "destructive" });
    }
  };

  const handleDelete = (contentId: string, title: string) => {
    if (confirm(`${t("hw.delete_confirm")}《${title}》？`)) {
      const result = deleteContent(contentId, user);
      if (result.success) {
        if (selectedContent?.contentId === contentId) setSelectedContent(null);
        toast({ title: t("hw.delete_success"), description: `${t("hw.delete_desc")}《${title}》` });
      } else {
        toast({ title: t("hw.delete_error"), description: result.message, variant: "destructive" });
      }
    }
  };

  const handleMarkAsRead = (contentId: string) => {
    if (user.role !== "student") return;
    markAsRead(contentId, user.studentId || user.id);
    toast({ title: "Marked as read successfully", description: "Your read status has been recorded" });
  };

  const currentReadData = selectedContent ? getReadStatusForContent(selectedContent.contentId) : [];
  const readCount = currentReadData.filter(r => r.isRead).length;
  const unreadCount = currentReadData.filter(r => !r.isRead).length;
  const filteredReadData = currentReadData.filter(r => {
    if (readFilter === "read") return r.isRead;
    if (readFilter === "unread") return !r.isRead;
    return true;
  });

  const now = new Date();
  const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("hw.page_title")} · J203</h1>
            <Badge variant="default" className="text-xs px-2.5 py-0.5">
              {user.role === "teacher" ? t("role.teacher") : user.position || t("role.student")}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {user.role === "teacher"
              ? `${t("dashboard.teacher_welcome")}，${user.name} ${user.subjects ? `(${user.subjects.map(s => translateSubject(s)).join("、")})` : ""}`
              : `${t("dashboard.student_welcome")}，${user.name} ${user.seatNumber ? `(${t("nav.seat_prefix")} ${user.seatNumber < 10 ? `0${user.seatNumber}` : user.seatNumber})` : ""}`
            }
          </p>
        </div>

        {canPublish && (
          <Dialog open={isPublishOpen} onOpenChange={setIsPublishOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-md font-semibold">
                <Plus size={18} />
                {t("hw.publish")} {categoryLabel}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <BookOpen className="text-primary" size={20} />
                  {t("hw.publish_form.title")} · J203
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handlePublish} className="space-y-4 py-2">
                {/* Publish date - auto */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t("hw.publish_form.publish_date")}</Label>
                  <Input value={formattedNow} disabled className="h-10 text-sm bg-muted" />
                </div>

                {/* Submission date */}
                <div className="space-y-1.5">
                  <Label htmlFor="pubDeadline" className="text-xs font-semibold">{t("hw.publish_form.deadline")}</Label>
                  <Input
                    id="pubDeadline"
                    type="datetime-local"
                    value={pubDeadline}
                    onChange={(e) => setPubDeadline(e.target.value)}
                    className="h-10 text-sm"
                  />
                </div>

                {/* Publisher - auto */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">{t("hw.publish_form.publisher")}</Label>
                  <Input
                    value={`${user.name} (${user.role === "teacher" ? t("role.teacher") : user.position || t("role.student")})`}
                    disabled
                    className="h-10 text-sm bg-muted"
                  />
                </div>

{/* Subject - not shown for announcements */}
                {activeTab !== "announcement" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="pubSubject" className="text-xs font-semibold">{t("hw.publish_form.subject")}</Label>
                    <Select value={pubSubject} onValueChange={setPubSubject}>
                      <SelectTrigger id="pubSubject" className="h-10 text-sm">
                        <SelectValue placeholder={t("hw.publish_form.subject_placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mathematics">{translateSubject("Mathematics")}</SelectItem>
                        <SelectItem value="Chinese">{translateSubject("Chinese")}</SelectItem>
                        <SelectItem value="Malay">{translateSubject("Malay")}</SelectItem>
                        <SelectItem value="English">{translateSubject("English")}</SelectItem>
                        <SelectItem value="Science">{translateSubject("Science")}</SelectItem>
                        <SelectItem value="History">{translateSubject("History")}</SelectItem>
                        <SelectItem value="Geography">{translateSubject("Geography")}</SelectItem>
                        <SelectItem value="Moral Education">{translateSubject("Moral Education")}</SelectItem>
                        <SelectItem value="Computer">{translateSubject("Computer")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Title */}
                <div className="space-y-1.5">
                  <Label htmlFor="pubTitle" className="text-xs font-semibold">{t("hw.publish_form.title_label")} <span className="text-destructive">*</span></Label>
                  <Input
                    id="pubTitle"
                    placeholder={t("hw.publish_form.title_placeholder")}
                    value={pubTitle}
                    onChange={(e) => setPubTitle(e.target.value)}
                    required
                    className="h-10 text-sm"
                  />
                </div>

                {/* Homework details */}
                <div className="space-y-1.5">
                  <Label htmlFor="pubDetails" className="text-xs font-semibold">{t("hw.publish_form.details")}</Label>
                  <Textarea
                    id="pubDetails"
                    rows={3}
                    placeholder={t("hw.publish_form.details_placeholder")}
                    value={pubDetails}
                    onChange={(e) => setPubDetails(e.target.value)}
                    className="text-sm"
                  />
                </div>

                {/* Attachment */}
                <div className="space-y-1.5">
                  <Label htmlFor="pubAttachment" className="text-xs font-semibold">{t("hw.publish_form.attachment")}</Label>
                  <Input
                    id="pubAttachment"
                    placeholder={t("hw.publish_form.attachment_placeholder")}
                    value={pubAttachment}
                    onChange={(e) => setPubAttachment(e.target.value)}
                    className="h-10 text-sm"
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsPublishOpen(false)}>
                    {t("hw.publish_form.cancel")}
                  </Button>
                  <Button type="submit" className="gap-1 font-semibold">
                    <Send size={16} />
                    {t("hw.publish_form.confirm")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as typeof activeTab); setSelectedContent(null); }}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            {categoryTabs.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key} className="gap-1.5 text-xs font-semibold">
                {t(tab.labelKey)}
              </TabsTrigger>
            ))}
          </TabsList>
          <Badge variant="secondary" className="text-xs">{currentContents.length} items</Badge>
        </div>

        {categoryTabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="space-y-4">
            {currentContents.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                <BookOpen size={40} className="mx-auto mb-2 text-muted-foreground/40" />
                <p className="text-sm">{t("hw.no_content")} {t(tab.labelKey)}</p>
                <p className="text-xs mt-1">
                  {canPublish ? t("hw.no_content_hint_publisher") : t("hw.no_content_hint_student")}
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentContents.map((content) => {
                  const readData = getReadStatusForContent(content.contentId);
                  const rCount = readData.filter(r => r.isRead).length;
                  const totalStudents = readData.length;

                  return (
                    <Card
                      key={content.contentId}
                      className={`cursor-pointer transition-all hover:border-primary/60 shadow-sm ${
                        selectedContent?.contentId === content.contentId ? "border-2 border-primary bg-primary/5 shadow-md" : ""
                      }`}
                      onClick={() => setSelectedContent(content)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                      {content.category !== "announcement" && (
                            <Badge variant="outline" className="text-xs bg-background">
                              {translateSubject(content.subject || "")}
                            </Badge>
                          )}
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary" className="text-[10px]">
                              {content.assignerRole}: {content.assignerName}
                            </Badge>
                            {user.role === "teacher" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={(e) => { e.stopPropagation(); handleDelete(content.contentId, content.title); }}
                              >
                                <Trash2 size={12} />
                              </Button>
                            )}
                          </div>
                        </div>
                        <CardTitle className="text-base mt-1">{content.title}</CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-3 pt-0">
                        <p className="text-xs text-muted-foreground bg-secondary/40 p-3 rounded-lg border">
                          {content.description || t("hw.no_description")}
                        </p>

                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {content.assignedDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {t("hw.deadline_prefix")}: {content.deadline}
                          </span>
                        </div>

                        {content.attachment && (
                          <div className="text-xs text-primary font-medium bg-secondary/50 p-2 rounded border flex items-center gap-1">
                            <FileText size={12} />
                            {content.attachment}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            <Eye size={10} className="mr-1" />
                            {rCount}/{totalStudents} {t("hw.read")}
                          </Badge>

                          {user.role === "student" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs gap-1"
                              onClick={(e) => { e.stopPropagation(); handleMarkAsRead(content.contentId); }}
                            >
                              <CheckCircle2 size={12} />
                              {t("hw.mark_as_read")}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Read Tracking Panel */}
      {selectedContent && (
        <Card className="shadow-md border-primary/20">
          <CardHeader className="pb-3 border-b bg-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
<div className="flex items-center gap-2">
                  {selectedContent.category !== "announcement" && (
                    <Badge variant="default">{translateSubject(selectedContent.subject || "")}</Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">{translateCategory(selectedContent.category)}</Badge>
                </div>
                <CardTitle className="text-xl mt-1">{selectedContent.title}</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("hw.publish_form.publisher")}: {selectedContent.assignerName} ({selectedContent.assignerRole}) | {t("hw.publish_form.publish_date")}: {selectedContent.assignedDate} | {t("hw.publish_form.deadline")}: {selectedContent.deadline}
                </p>
              </div>
              <Badge variant="outline" className="text-xs font-semibold py-1">
                {readCount}/{currentReadData.length} {t("hw.read")}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            <div className="text-xs bg-secondary/40 p-3 rounded-lg border">
              {selectedContent.description || t("hw.no_description")}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Button variant={readFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setReadFilter("all")} className="h-7 text-xs">
                {t("hw.all")} ({currentReadData.length})
              </Button>
              <Button variant={readFilter === "read" ? "default" : "outline"} size="sm" onClick={() => setReadFilter("read")} className="h-7 text-xs text-emerald-600">
                {t("hw.read")} ({readCount})
              </Button>
              <Button variant={readFilter === "unread" ? "default" : "outline"} size="sm" onClick={() => setReadFilter("unread")} className="h-7 text-xs text-amber-600">
                {t("hw.unread")} ({unreadCount})
              </Button>
            </div>

            <div className="rounded-lg border overflow-hidden max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader className="bg-secondary/50 sticky top-0">
                  <TableRow>
                    <TableHead className="w-16 text-center text-xs">{t("hw.seat_no")}</TableHead>
                    <TableHead className="text-xs">{t("hw.name_id")}</TableHead>
                    <TableHead className="text-xs">{t("hw.status")}</TableHead>
                    <TableHead className="text-right text-xs">{t("hw.read_time")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReadData.map((item) => (
                    <TableRow key={item.studentId} className="hover:bg-secondary/30">
                      <TableCell className="text-center font-bold text-xs">
                        {item.seatNumber < 10 ? `0${item.seatNumber}` : item.seatNumber}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-xs">{item.studentName}</div>
                        <div className="text-[10px] text-muted-foreground">{item.studentId}</div>
                      </TableCell>
                      <TableCell>
                        {item.isRead ? (
                          <Badge variant="default" className="text-[11px] bg-emerald-500">
                            <CheckCircle2 size={10} className="mr-1" />
                            {t("hw.read")}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[11px] text-amber-600 border-amber-300 bg-amber-50">
                            <EyeOff size={10} className="mr-1" />
                            {t("hw.unread")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {item.readDate || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HomeworkPage;

