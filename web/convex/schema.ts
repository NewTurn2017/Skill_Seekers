import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex 데이터베이스 스키마
 * 스킬 게시판 시스템
 */
export default defineSchema({
  // 스킬 테이블
  skills: defineTable({
    // 기본 정보
    name: v.string(),
    description: v.string(),
    category: v.string(), // "프론트엔드", "백엔드", "게임개발", etc.

    // 상세 정보
    icon: v.string(), // 이모지
    difficulty: v.string(), // "쉬움", "보통", "어려움"
    sourceUrl: v.string(), // 원본 문서 URL

    // 스크래핑 설정
    configJson: v.optional(v.string()), // JSON 문자열로 저장된 설정
    maxPages: v.optional(v.number()),

    // 상태 관리
    status: v.string(), // "pending", "processing", "completed", "failed"
    progress: v.optional(v.number()), // 0-100

    // 결과
    downloadUrl: v.optional(v.string()), // 생성된 .zip 파일 URL
    fileSize: v.optional(v.number()), // 바이트 단위

    // 통계
    viewCount: v.number(),
    downloadCount: v.number(),

    // 메타 정보
    tags: v.array(v.string()),
    author: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"])
    .index("by_downloads", ["downloadCount"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["category", "status"]
    }),

  // 스킬 댓글 테이블
  comments: defineTable({
    skillId: v.id("skills"),
    author: v.string(),
    content: v.string(),
    rating: v.optional(v.number()), // 1-5 별점
    createdAt: v.number(),
  }).index("by_skill", ["skillId"]),

  // 스크래핑 작업 로그
  scrapingLogs: defineTable({
    skillId: v.id("skills"),
    stage: v.string(), // "scraping", "building", "enhancing", "packaging"
    message: v.string(),
    level: v.string(), // "info", "warning", "error"
    timestamp: v.number(),
  }).index("by_skill", ["skillId"]),
});
