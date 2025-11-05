"use client";

import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, FileText, MessageSquare, Upload } from "lucide-react";

type CreationMode = "prompt" | "file";

/**
 * 스킬 생성 페이지 - Gemini AI 기반
 * 프롬프트 또는 파일 업로드로 스킬 생성
 */
export default function CreateSkillPage() {
  const router = useRouter();
  const createSkill = useMutation(api.skills.create);
  const generateFromPrompt = useAction(api.generation.generateFromPrompt);
  const generateFromFile = useAction(api.generation.generateFromFile);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const [mode, setMode] = useState<CreationMode>("prompt");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "프론트엔드",
    icon: "⚛️",
    difficulty: "쉬움",
    tags: [] as string[],
    prompt: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "프론트엔드",
    "백엔드",
    "풀스택",
    "CSS/디자인",
    "게임개발",
    "프로그래밍",
    "DevOps",
    "기타",
  ];

  const difficulties = ["쉬움", "보통", "어려움"];

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 스킬 레코드 생성
      const skillId = await createSkill({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        icon: formData.icon,
        difficulty: formData.difficulty,
        sourceUrl: mode === "prompt" ? "AI 생성" : "파일 업로드",
        tags: formData.tags,
        maxPages: 0, // AI 생성에서는 불필요
      });

      if (mode === "prompt") {
        // 프롬프트 기반 생성
        generateFromPrompt({
          skillId,
          prompt: formData.prompt,
          name: formData.name,
          category: formData.category,
        }).catch((error) => {
          console.error("프롬프트 생성 실패:", error);
        });
      } else {
        // 파일 기반 생성
        if (!selectedFile) {
          alert("파일을 선택해주세요.");
          setIsSubmitting(false);
          return;
        }

        // 파일 업로드
        const uploadUrl = await generateUploadUrl();
        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedFile.type },
          body: selectedFile,
        });

        if (!uploadResponse.ok) {
          throw new Error("파일 업로드 실패");
        }

        const { storageId } = await uploadResponse.json();

        // 파일로부터 생성
        generateFromFile({
          skillId,
          storageId,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        }).catch((error) => {
          console.error("파일 처리 실패:", error);
        });
      }

      // 스킬 상세 페이지로 이동 (진행상황 확인 가능)
      router.push(`/skills/${skillId}`);
    } catch (error) {
      console.error("스킬 생성 실패:", error);
      alert("스킬 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
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
              <Link href="/create" className="text-blue-600 font-semibold">
                스킬 생성
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/skills">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            돌아가기
          </Button>
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              AI 기반 스킬 생성
            </h2>
            <p className="text-gray-600">
              프롬프트 또는 파일 업로드로 Claude AI 스킬을 생성하세요
            </p>
          </div>

          {/* 생성 모드 선택 */}
          <div className="mb-8">
            <Label className="mb-3 block">생성 방법 선택 *</Label>
            <div className="grid grid-cols-2 gap-4">
              <Card
                className={`cursor-pointer transition-all ${
                  mode === "prompt"
                    ? "ring-2 ring-blue-600 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setMode("prompt")}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <MessageSquare className="h-12 w-12 mb-3 text-blue-600" />
                    <h3 className="font-semibold mb-1">프롬프트로 생성</h3>
                    <p className="text-sm text-gray-600">
                      원하는 스킬을 설명하면 AI가 자동 생성
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-all ${
                  mode === "file"
                    ? "ring-2 ring-blue-600 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setMode("file")}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <FileText className="h-12 w-12 mb-3 text-green-600" />
                    <h3 className="font-semibold mb-1">파일로 생성</h3>
                    <p className="text-sm text-gray-600">
                      문서 파일을 업로드하면 AI가 분석하여 생성
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 스킬 이름 */}
            <div>
              <Label htmlFor="name">스킬 이름 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="예: React 기초 가이드"
                required
                className="mt-1"
              />
            </div>

            {/* 설명 */}
            <div>
              <Label htmlFor="description">스킬 설명 *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="이 스킬이 무엇을 하는지 간단히 설명해주세요"
                required
                className="mt-1"
                rows={2}
              />
            </div>

            {/* 프롬프트 모드 */}
            {mode === "prompt" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <Label htmlFor="prompt" className="flex items-center mb-2">
                  <MessageSquare className="mr-2 h-4 w-4 text-blue-600" />
                  생성할 스킬 프롬프트 *
                </Label>
                <Textarea
                  id="prompt"
                  value={formData.prompt}
                  onChange={(e) =>
                    setFormData({ ...formData, prompt: e.target.value })
                  }
                  placeholder={`예시:
"React 컴포넌트 생성 및 props 사용법을 다루는 초보자용 가이드를 만들어주세요. useState와 useEffect 훅 사용법도 포함하고, 실제 작동하는 코드 예제를 포함해주세요."`}
                  required
                  className="mt-2 min-h-[150px]"
                  rows={8}
                />
                <p className="text-sm text-blue-700 mt-2">
                  💡 구체적으로 작성할수록 더 좋은 스킬이 생성됩니다
                </p>
              </div>
            )}

            {/* 파일 업로드 모드 */}
            {mode === "file" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <Label htmlFor="file" className="flex items-center mb-2">
                  <FileText className="mr-2 h-4 w-4 text-green-600" />
                  문서 파일 업로드 *
                </Label>
                <div className="mt-2">
                  <label
                    htmlFor="file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-green-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-green-50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-green-600" />
                      <p className="mb-2 text-sm text-gray-700">
                        {selectedFile ? (
                          <span className="font-semibold">{selectedFile.name}</span>
                        ) : (
                          <>
                            <span className="font-semibold">클릭하여 업로드</span> 또는
                            드래그 앤 드롭
                          </>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        TXT, MD, PDF, DOCX (최대 10MB)
                      </p>
                    </div>
                    <input
                      id="file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".txt,.md,.pdf,.docx"
                      required
                    />
                  </label>
                </div>
                <p className="text-sm text-green-700 mt-2">
                  💡 기술 문서, 튜토리얼, API 문서 등을 업로드하세요
                </p>
              </div>
            )}

            {/* 카테고리 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">카테고리 *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* 아이콘 */}
              <div>
                <Label htmlFor="icon">아이콘 (이모지)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="⚛️"
                  maxLength={2}
                  className="mt-1"
                />
              </div>
            </div>

            {/* 난이도 */}
            <div>
              <Label>난이도 *</Label>
              <div className="flex gap-2 mt-1">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, difficulty: diff })
                    }
                    className={`px-4 py-2 rounded-lg border ${
                      formData.difficulty === diff
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* 태그 */}
            <div>
              <Label htmlFor="tags">태그</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="태그 입력 후 Enter"
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  추가
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ✕
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* 제출 버튼 */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    생성 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI 스킬 생성 시작
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* 안내 사항 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 안내 사항</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• AI 기반 생성은 1-3분 정도 소요됩니다</li>
            <li>• Gemini API를 사용하여 고품질 스킬을 생성합니다</li>
            <li>• 생성 중에도 다른 작업을 할 수 있습니다</li>
            <li>• 완료되면 스킬 게시판에서 다운로드할 수 있습니다</li>
            <li>
              • 프롬프트는 구체적으로, 파일은 구조화된 문서일수록 좋은 결과가
              나옵니다
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
