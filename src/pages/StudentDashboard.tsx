import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useHomework } from "@/context/HomeworkContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CheckCircle2, Calendar, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categoryTabs: { key: "quiz" | "homework" | "project" | "announcement"; labelKey: string }[] = [
  { key: "quiz", labelKey: "category.quiz" },
  { key: "homework", labelKey: "category.homework" },
  { key: "project", labelKey: "category.project" },
  { key: "announcement", labelKey: "category.announcement" },
];

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { contents, readStatuses, markAsRead } = useHomework();
  const { t, translateSubject } = useLanguage();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"quiz" | "homework" | "project" | "announcement">("homework");

  if (!user || user.role !== "student") return null;

  const displayContents = contents.filter(c => c.classId === "J203");
  const currentContents = displayContents.filter(c => c.category === activeTab);

  const myReads = readStatuses.filter(
    (r) => r.studentId === user.studentId || r.seatNumber === user.seatNumber
  );
  const readContentIds = new Set(myReads.filter(r => r.isRead).map(r => r.contentId));

  const unreadContents = currentContents.filter(c => !readContentIds.has(c.contentId));
  const readContents = currentContents.filter(c => readContentIds.has(c.contentId));

  const handleMarkAsRead = (contentId: string) => {
    markAsRead(contentId, user.studentId || user.id);
    toast({ title: "Marked as read successfully", description: "Your read status has been recorded" });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border bg-gradient-to-r from-primary/10 via-background to-secondary/30 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("hw.page_title")}</h1>
              <Badge variant="outline" className="text-xs border-primary/40 text-primary">J203</Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-foreground">{user.name} {t("dashboard.student_welcome")}</span>
              <span>|</span>
              <span>{t("nav.seat_prefix")}：<strong>{user.seatNumber < 10 ? `0${user.seatNumber}` : user.seatNumber}</strong></span>
              <span>|</span>
              <span>{t("nav.student_id_label")}：{user.studentId}</span>
              {user.position && <Badge variant="secondary" className="text-[10px]">{user.position}</Badge>}
            </p>
          </div>
          <div className="text-right sm:border-l sm:pl-4">
            <div className="text-xs text-muted-foreground">{t("hw.unread")}</div>
            <div className="text-2xl font-extrabold text-amber-600">{unreadContents.length}</div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-4 max-w-md mb-6">
          {categoryTabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key} className="text-xs font-semibold">
              {t(tab.labelKey)}
            </TabsTrigger>
          ))}
        </TabsList>

        {categoryTabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="space-y-4">
            {currentContents.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">
                <BookOpen size={48} className="mx-auto text-muted-foreground/40 mb-2" />
                <p className="text-sm">{t("hw.no_content")} {t(tab.labelKey)}</p>
              </Card>
            ) : (
              <>
                {unreadContents.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-amber-600 flex items-center gap-2">
                      <EyeOff size={16} />
                      {t("hw.unread")} ({unreadContents.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {unreadContents.map((content) => (
                        <Card key={content.contentId} className="shadow-sm border-amber-200/60">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between gap-2">
{content.category !== "announcement" && (
                              <Badge variant="outline">{translateSubject(content.subject || "")}</Badge>
                            )}
                            <Badge variant="secondary" className="text-[10px]">{content.assignerRole}: {content.assignerName}</Badge>
                            </div>
                            <CardTitle className="text-base mt-1">{content.title}</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">{t("hw.publish_form.publish_date")}: {content.assignedDate}</p>
                          </CardHeader>
                          <CardContent className="space-y-3 pt-0">
                            <p className="text-xs text-muted-foreground bg-secondary/40 p-3 rounded-lg border">
                              {content.description || t("hw.no_description")}
                            </p>
                            <div className="flex items-center justify-between text-xs pt-2">
                              <span className="flex items-center gap-1 text-amber-600 font-medium">
                                <Calendar size={14} />
                                {t("hw.publish_form.deadline")}: {content.deadline}
                              </span>
                              <Button size="sm" onClick={() => handleMarkAsRead(content.contentId)} className="gap-1 text-xs h-8">
                                <Eye size={14} />
                                {t("hw.mark_as_read")}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {readContents.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-emerald-600 flex items-center gap-2">
                      <Eye size={16} />
                      {t("hw.read")} ({readContents.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {readContents.map((content) => {
                        const myRead = myReads.find(r => r.contentId === content.contentId);
                        return (
                          <Card key={content.contentId} className="shadow-sm border-emerald-200/60">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between gap-2">
                                <Badge variant="outline">{translateSubject(content.subject || "")}</Badge>
                                <Badge variant="default" className="text-[10px] bg-emerald-500">
                                  <CheckCircle2 size={10} className="mr-1" />
                                  {t("hw.read")}
                                </Badge>
                              </div>
                              <CardTitle className="text-base mt-1">{content.title}</CardTitle>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t("hw.publish_form.publisher")}: {content.assignerName} ({content.assignerRole})
                              </p>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-0">
                              <p className="text-xs text-muted-foreground bg-secondary/40 p-3 rounded-lg border">
                                {content.description || t("hw.no_description")}
                              </p>
                              <div className="text-xs text-muted-foreground">
                                <span className="flex items-center gap-1 text-emerald-600">
                                  <CheckCircle2 size={12} />
                                  {t("hw.read_time")}: {myRead?.readDate || "-"}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
