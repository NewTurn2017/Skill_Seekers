"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SkillsDataTable } from "@/components/skills-data-table";
import { SkillsSearch, SearchFilters } from "@/components/skills-search";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3, Download, Eye } from "lucide-react";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";

/**
 * 스킬 게시판 페이지
 */
export default function SkillsPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    categories: [],
    difficulties: [],
    statuses: [],
    sortBy: "created",
    sortOrder: "desc",
  });

  // Convex 쿼리
  const allSkills = useQuery(api.skills.list);
  const stats = useQuery(api.skills.getStats);

  // 필터링 및 정렬된 스킬 목록
  const skills = useMemo(() => {
    if (!allSkills) return [];

    let filtered = [...allSkills];

    // 검색어 필터
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (skill) =>
          skill.name.toLowerCase().includes(term) ||
          skill.description.toLowerCase().includes(term)
      );
    }

    // 카테고리 필터
    if (filters.categories.length > 0) {
      filtered = filtered.filter((skill) =>
        filters.categories.includes(skill.category)
      );
    }

    // 난이도 필터
    if (filters.difficulties.length > 0) {
      filtered = filtered.filter((skill) =>
        filters.difficulties.includes(skill.difficulty)
      );
    }

    // 상태 필터
    if (filters.statuses.length > 0) {
      filtered = filtered.filter((skill) =>
        filters.statuses.includes(skill.status)
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "downloads":
          comparison = a.downloadCount - b.downloadCount;
          break;
        case "views":
          comparison = a.viewCount - b.viewCount;
          break;
        case "created":
        default:
          comparison = a.createdAt - b.createdAt;
          break;
      }

      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [allSkills, filters]);

  if (allSkills === undefined || stats === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

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
              <Link href="/skills" className="text-blue-600 font-semibold">
                스킬 게시판
              </Link>
              <Link href="/create" className="text-gray-600 hover:text-gray-900">
                스킬 생성
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 통계 카드 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 스킬</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatNumber(stats.totalSkills)}
                </p>
              </div>
              <BarChart3 className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">완료된 스킬</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatNumber(stats.completedSkills)}
                </p>
              </div>
              <BarChart3 className="h-12 w-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 다운로드</p>
                <p className="text-3xl font-bold text-purple-600">
                  {formatNumber(stats.totalDownloads)}
                </p>
              </div>
              <Download className="h-12 w-12 text-purple-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 조회수</p>
                <p className="text-3xl font-bold text-orange-600">
                  {formatNumber(stats.totalViews)}
                </p>
              </div>
              <Eye className="h-12 w-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* 페이지 헤더 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">스킬 게시판</h2>
              <p className="text-gray-600 mt-1">
                커뮤니티에서 공유된 Claude AI 스킬 목록
              </p>
            </div>
            <Link href="/create">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                새 스킬 생성
              </Button>
            </Link>
          </div>

          {/* 카테고리별 통계 */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.byCategory).map(([category, count]) => (
              <div
                key={category}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                <span className="font-semibold">{category}</span>
                <span className="text-gray-500 ml-1">({count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <SkillsSearch onFilterChange={setFilters} />
          <div className="mt-4 text-sm text-gray-600">
            검색 결과: {skills.length}개의 스킬
          </div>
        </div>

        {/* 데이터 테이블 */}
        <div className="bg-white rounded-lg shadow p-6">
          <SkillsDataTable data={skills} />
        </div>
      </div>
    </div>
  );
}
