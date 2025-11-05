"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, SortAsc, SortDesc } from "lucide-react";

export interface SearchFilters {
  searchTerm: string;
  categories: string[];
  difficulties: string[];
  statuses: string[];
  sortBy: "created" | "downloads" | "views" | "name";
  sortOrder: "asc" | "desc";
}

interface SkillsSearchProps {
  onFilterChange: (filters: SearchFilters) => void;
}

/**
 * 스킬 검색 및 필터 컴포넌트
 */
export function SkillsSearch({ onFilterChange }: SkillsSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    categories: [],
    difficulties: [],
    statuses: [],
    sortBy: "created",
    sortOrder: "desc",
  });

  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "프론트엔드",
    "백엔드",
    "풀스택",
    "CSS/디자인",
    "게임개발",
    "프로그래밍",
    "DevOps",
  ];

  const difficulties = ["쉬움", "보통", "어려움"];
  const statuses = ["pending", "processing", "completed", "failed"];

  const statusLabels: Record<string, string> = {
    pending: "대기중",
    processing: "처리중",
    completed: "완료",
    failed: "실패",
  };

  const handleFilterUpdate = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    handleFilterUpdate({ categories: newCategories });
  };

  const toggleDifficulty = (difficulty: string) => {
    const newDifficulties = filters.difficulties.includes(difficulty)
      ? filters.difficulties.filter((d) => d !== difficulty)
      : [...filters.difficulties, difficulty];
    handleFilterUpdate({ difficulties: newDifficulties });
  };

  const toggleStatus = (status: string) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    handleFilterUpdate({ statuses: newStatuses });
  };

  const clearAllFilters = () => {
    const resetFilters: SearchFilters = {
      searchTerm: "",
      categories: [],
      difficulties: [],
      statuses: [],
      sortBy: "created",
      sortOrder: "desc",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.difficulties.length > 0 ||
    filters.statuses.length > 0 ||
    filters.searchTerm.length > 0;

  return (
    <div className="space-y-4">
      {/* 검색 바 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={filters.searchTerm}
            onChange={(e) => handleFilterUpdate({ searchTerm: e.target.value })}
            placeholder="스킬 이름으로 검색..."
            className="pl-10"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          필터
          {hasActiveFilters && (
            <Badge variant="destructive" className="ml-2 px-1.5 py-0 text-xs">
              {filters.categories.length +
                filters.difficulties.length +
                filters.statuses.length}
            </Badge>
          )}
        </Button>
      </div>

      {/* 정렬 옵션 */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">정렬:</span>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            handleFilterUpdate({ sortBy: e.target.value as SearchFilters["sortBy"] })
          }
          className="text-sm rounded-md border border-input bg-background px-3 py-1"
        >
          <option value="created">생성일</option>
          <option value="downloads">다운로드 수</option>
          <option value="views">조회수</option>
          <option value="name">이름</option>
        </select>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            handleFilterUpdate({
              sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
            })
          }
        >
          {filters.sortOrder === "asc" ? (
            <SortAsc className="h-4 w-4" />
          ) : (
            <SortDesc className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* 필터 패널 */}
      {showFilters && (
        <div className="bg-gray-50 border rounded-lg p-4 space-y-4">
          {/* 카테고리 */}
          <div>
            <p className="text-sm font-medium mb-2">카테고리</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={
                    filters.categories.includes(category) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                  {filters.categories.includes(category) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* 난이도 */}
          <div>
            <p className="text-sm font-medium mb-2">난이도</p>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <Badge
                  key={difficulty}
                  variant={
                    filters.difficulties.includes(difficulty) ? "default" : "outline"
                  }
                  className={`cursor-pointer ${
                    filters.difficulties.includes(difficulty)
                      ? ""
                      : difficulty === "쉬움"
                      ? "border-green-300"
                      : difficulty === "보통"
                      ? "border-yellow-300"
                      : "border-red-300"
                  }`}
                  onClick={() => toggleDifficulty(difficulty)}
                >
                  {difficulty}
                  {filters.difficulties.includes(difficulty) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* 상태 */}
          <div>
            <p className="text-sm font-medium mb-2">상태</p>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Badge
                  key={status}
                  variant={
                    filters.statuses.includes(status) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => toggleStatus(status)}
                >
                  {statusLabels[status]}
                  {filters.statuses.includes(status) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* 초기화 버튼 */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="w-full"
            >
              <X className="h-4 w-4 mr-2" />
              모든 필터 초기화
            </Button>
          )}
        </div>
      )}

      {/* 활성화된 필터 태그 */}
      {hasActiveFilters && !showFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleCategory(category)}
            >
              {category}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
          {filters.difficulties.map((difficulty) => (
            <Badge
              key={difficulty}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleDifficulty(difficulty)}
            >
              {difficulty}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
          {filters.statuses.map((status) => (
            <Badge
              key={status}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleStatus(status)}
            >
              {statusLabels[status]}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
