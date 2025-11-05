"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";

/**
 * 스킬 생성 페이지
 */
export default function CreateSkillPage() {
  const router = useRouter();
  const createSkill = useMutation(api.skills.create);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "프론트엔드",
    icon: "⚛️",
    difficulty: "쉬움",
    sourceUrl: "",
    tags: [] as string[],
    maxPages: 500,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const skillId = await createSkill({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        icon: formData.icon,
        difficulty: formData.difficulty,
        sourceUrl: formData.sourceUrl,
        tags: formData.tags,
        maxPages: formData.maxPages,
      });

      // 성공 시 스킬 게시판으로 이동
      router.push("/skills");
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
              새 스킬 생성
            </h2>
            <p className="text-gray-600">
              문서 사이트를 Claude AI 스킬로 변환하세요
            </p>
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
                placeholder="예: React"
                required
                className="mt-1"
              />
            </div>

            {/* 설명 */}
            <div>
              <Label htmlFor="description">설명 *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="이 스킬이 무엇을 하는지 설명해주세요"
                required
                className="mt-1"
                rows={3}
              />
            </div>

            {/* 문서 URL */}
            <div>
              <Label htmlFor="sourceUrl">문서 사이트 URL *</Label>
              <Input
                id="sourceUrl"
                type="url"
                value={formData.sourceUrl}
                onChange={(e) =>
                  setFormData({ ...formData, sourceUrl: e.target.value })
                }
                placeholder="https://react.dev/"
                required
                className="mt-1"
              />
            </div>

            {/* 카테고리 */}
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

            {/* 최대 페이지 수 */}
            <div>
              <Label htmlFor="maxPages">최대 스크래핑 페이지 수</Label>
              <Input
                id="maxPages"
                type="number"
                value={formData.maxPages}
                onChange={(e) =>
                  setFormData({ ...formData, maxPages: parseInt(e.target.value) })
                }
                placeholder="500"
                min={1}
                max={10000}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                권장: 100-500 페이지 (너무 많으면 시간이 오래 걸립니다)
              </p>
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
                    스킬 생성 시작
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
            <li>• 스킬 생성은 문서 크기에 따라 20-40분 정도 소요됩니다</li>
            <li>• 생성 중에도 다른 작업을 할 수 있습니다</li>
            <li>• 완료되면 스킬 게시판에서 다운로드할 수 있습니다</li>
            <li>• 공개 문서 사이트만 지원됩니다 (로그인 필요 사이트 불가)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
