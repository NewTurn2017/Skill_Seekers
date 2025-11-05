"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Download,
  Eye,
  Calendar,
  Link2,
  Tag,
  MessageSquare,
  Star,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { formatRelativeTime, formatFileSize, formatNumber, formatDate } from "@/lib/utils";

/**
 * 스킬 상세 페이지
 */
export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const skillId = params.id as Id<"skills">;

  // Convex 쿼리
  const skill = useQuery(api.skills.getById, { id: skillId });
  const comments = useQuery(api.skills.getComments, { skillId });
  const logs = useQuery(api.skills.getLogs, { skillId });

  // Mutations
  const incrementView = useMutation(api.skills.incrementView);
  const incrementDownload = useMutation(api.skills.incrementDownload);
  const addComment = useMutation(api.skills.addComment);

  // 댓글 폼 상태
  const [commentForm, setCommentForm] = useState({
    author: "",
    content: "",
    rating: 5,
  });
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // 페이지 진입시 조회수 증가 (1회만)
  useEffect(() => {
    if (skill) {
      incrementView({ id: skillId });
    }
  }, [skill?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // 로딩 상태
  if (skill === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 스킬이 없는 경우
  if (skill === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">스킬을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-4">삭제되었거나 존재하지 않는 스킬입니다.</p>
          <Link href="/skills">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              스킬 목록으로
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 상태 아이콘 및 색상
  const getStatusIcon = () => {
    switch (skill.status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "processing":
        return <Clock className="h-5 w-5 text-blue-600 animate-spin" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  // 다운로드 핸들러
  const handleDownload = async () => {
    if (skill.downloadUrl) {
      await incrementDownload({ id: skillId });
      window.open(skill.downloadUrl, "_blank");
    }
  };

  // 댓글 제출
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.author || !commentForm.content) {
      alert("작성자와 내용을 입력해주세요.");
      return;
    }

    setIsSubmittingComment(true);
    try {
      await addComment({
        skillId,
        author: commentForm.author,
        content: commentForm.content,
        rating: commentForm.rating,
      });
      setCommentForm({ author: "", content: "", rating: 5 });
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600">
                🎯 스킬 시커
              </h1>
            </Link>
            <nav className="flex gap-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                홈
              </Link>
              <Link href="/skills" className="text-gray-600 hover:text-gray-900">
                스킬 게시판
              </Link>
              <Link href="/create" className="text-gray-600 hover:text-gray-900">
                스킬 생성
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/skills">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            스킬 목록으로
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 스킬 정보 카드 */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-6xl">{skill.icon}</span>
                    <div>
                      <CardTitle className="text-3xl mb-2">{skill.name}</CardTitle>
                      <CardDescription className="text-base">
                        {skill.description}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusIcon()}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 메타 정보 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">카테고리</p>
                      <Badge variant="outline">{skill.category}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">난이도</p>
                      <Badge
                        className={
                          skill.difficulty === "쉬움"
                            ? "bg-green-100 text-green-700"
                            : skill.difficulty === "보통"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {skill.difficulty}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        <Eye className="inline h-4 w-4 mr-1" />
                        조회수
                      </p>
                      <p className="font-semibold">{formatNumber(skill.viewCount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        <Download className="inline h-4 w-4 mr-1" />
                        다운로드
                      </p>
                      <p className="font-semibold">{formatNumber(skill.downloadCount)}</p>
                    </div>
                  </div>

                  {/* 진행 상태 */}
                  {skill.status === "processing" && skill.progress !== undefined && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">AI 생성 진행 중</p>
                        <p className="text-sm text-gray-600">{skill.progress}%</p>
                      </div>
                      <Progress value={skill.progress} className="h-2" />
                    </div>
                  )}

                  {/* 생성 방법 */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      <Link2 className="inline h-4 w-4 mr-1" />
                      생성 방법
                    </p>
                    <p className="text-gray-700 font-medium">
                      {skill.sourceUrl}
                    </p>
                  </div>

                  {/* 태그 */}
                  {skill.tags.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">
                        <Tag className="inline h-4 w-4 mr-1" />
                        태그
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {skill.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 생성 정보 */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      생성: {formatRelativeTime(skill.createdAt)}
                    </div>
                    {skill.fileSize && (
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        크기: {formatFileSize(skill.fileSize)}
                      </div>
                    )}
                  </div>

                  {/* 다운로드 버튼 */}
                  {skill.status === "completed" && skill.downloadUrl && (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="lg"
                      onClick={handleDownload}
                    >
                      <Download className="mr-2 h-5 w-5" />
                      스킬 다운로드 (.zip)
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 스크래핑 로그 */}
            {logs && logs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>스크래핑 로그</CardTitle>
                  <CardDescription>실시간 작업 진행 상황</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {logs.map((log) => (
                      <div
                        key={log._id}
                        className={`p-3 rounded-lg border ${
                          log.level === "error"
                            ? "bg-red-50 border-red-200"
                            : log.level === "warning"
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {log.stage}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatDate(log.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm">{log.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 댓글 섹션 */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <MessageSquare className="inline h-5 w-5 mr-2" />
                  댓글 ({comments?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* 댓글 작성 폼 */}
                <form onSubmit={handleCommentSubmit} className="mb-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="author">작성자</Label>
                      <Input
                        id="author"
                        value={commentForm.author}
                        onChange={(e) =>
                          setCommentForm({ ...commentForm, author: e.target.value })
                        }
                        placeholder="닉네임"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rating">별점</Label>
                      <select
                        id="rating"
                        value={commentForm.rating}
                        onChange={(e) =>
                          setCommentForm({
                            ...commentForm,
                            rating: parseInt(e.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ 5점</option>
                        <option value={4}>⭐⭐⭐⭐ 4점</option>
                        <option value={3}>⭐⭐⭐ 3점</option>
                        <option value={2}>⭐⭐ 2점</option>
                        <option value={1}>⭐ 1점</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="content">댓글</Label>
                    <Textarea
                      id="content"
                      value={commentForm.content}
                      onChange={(e) =>
                        setCommentForm({ ...commentForm, content: e.target.value })
                      }
                      placeholder="이 스킬에 대한 의견을 남겨주세요"
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" disabled={isSubmittingComment}>
                    {isSubmittingComment ? "작성 중..." : "댓글 작성"}
                  </Button>
                </form>

                {/* 댓글 목록 */}
                <div className="space-y-4">
                  {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment._id} className="border-t pt-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">{comment.author}</p>
                            {comment.rating && (
                              <div className="text-yellow-500">
                                {"⭐".repeat(comment.rating)}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatRelativeTime(comment.createdAt)}
                          </p>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-8">
                      아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 상태 카드 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">스킬 상태</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">상태</span>
                    <Badge
                      className={
                        skill.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : skill.status === "processing"
                          ? "bg-blue-100 text-blue-700"
                          : skill.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {skill.status === "completed"
                        ? "완료"
                        : skill.status === "processing"
                        ? "처리중"
                        : skill.status === "failed"
                        ? "실패"
                        : "대기중"}
                    </Badge>
                  </div>
                  {skill.maxPages && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">최대 페이지</span>
                      <span className="font-semibold">{formatNumber(skill.maxPages)}</span>
                    </div>
                  )}
                  {skill.author && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">생성자</span>
                      <span className="font-semibold">{skill.author}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 관련 스킬 (같은 카테고리) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">관련 스킬</CardTitle>
                <CardDescription>같은 카테고리의 스킬</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">준비 중...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
