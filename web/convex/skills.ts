import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

/**
 * 스킬 CRUD 함수들
 */

// ==================== 조회 (Query) ====================

/**
 * 모든 스킬 목록 조회
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("skills")
      .order("desc")
      .collect();
  },
});

/**
 * 카테고리별 스킬 조회
 */
export const listByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("skills")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .order("desc")
      .collect();
  },
});

/**
 * 상태별 스킬 조회
 */
export const listByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("skills")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .collect();
  },
});

/**
 * 인기 스킬 조회 (다운로드 수 기준)
 */
export const listPopular = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    return await ctx.db
      .query("skills")
      .withIndex("by_downloads")
      .order("desc")
      .take(limit);
  },
});

/**
 * 최근 스킬 조회
 */
export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    return await ctx.db
      .query("skills")
      .withIndex("by_created")
      .order("desc")
      .take(limit);
  },
});

/**
 * 스킬 검색
 */
export const search = query({
  args: {
    searchTerm: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("skills")
      .withSearchIndex("search_name", (q) => {
        let search = q.search("name", args.searchTerm);
        if (args.category) {
          search = search.eq("category", args.category);
        }
        return search;
      })
      .collect();

    return results;
  },
});

/**
 * 특정 스킬 상세 조회
 */
export const getById = query({
  args: { id: v.id("skills") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * 스킬 통계 조회
 */
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allSkills = await ctx.db.query("skills").collect();

    const totalSkills = allSkills.length;
    const completedSkills = allSkills.filter(s => s.status === "completed").length;
    const totalDownloads = allSkills.reduce((sum, s) => sum + s.downloadCount, 0);
    const totalViews = allSkills.reduce((sum, s) => sum + s.viewCount, 0);

    // 카테고리별 통계
    const byCategory: Record<string, number> = {};
    allSkills.forEach(skill => {
      byCategory[skill.category] = (byCategory[skill.category] || 0) + 1;
    });

    return {
      totalSkills,
      completedSkills,
      totalDownloads,
      totalViews,
      byCategory,
    };
  },
});

// ==================== 생성/수정/삭제 (Mutation) ====================

/**
 * 새 스킬 생성
 */
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: v.string(),
    icon: v.string(),
    difficulty: v.string(),
    sourceUrl: v.string(),
    tags: v.array(v.string()),
    configJson: v.optional(v.string()),
    maxPages: v.optional(v.number()),
    author: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const skillId = await ctx.db.insert("skills", {
      name: args.name,
      description: args.description,
      category: args.category,
      icon: args.icon,
      difficulty: args.difficulty,
      sourceUrl: args.sourceUrl,
      tags: args.tags,
      configJson: args.configJson,
      maxPages: args.maxPages,
      author: args.author,
      status: "pending",
      progress: 0,
      viewCount: 0,
      downloadCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    // 초기 로그 생성
    await ctx.db.insert("scrapingLogs", {
      skillId,
      stage: "pending",
      message: "스킬 생성 요청이 등록되었습니다",
      level: "info",
      timestamp: now,
    });

    return skillId;
  },
});

/**
 * 스킬 정보 수정
 */
export const update = mutation({
  args: {
    id: v.id("skills"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    difficulty: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

/**
 * 스킬 상태 업데이트
 */
export const updateStatus = mutation({
  args: {
    id: v.id("skills"),
    status: v.string(),
    progress: v.optional(v.number()),
    downloadUrl: v.optional(v.string()),
    fileSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

/**
 * 조회수 증가
 */
export const incrementView = mutation({
  args: { id: v.id("skills") },
  handler: async (ctx, args) => {
    const skill = await ctx.db.get(args.id);
    if (!skill) return;

    await ctx.db.patch(args.id, {
      viewCount: skill.viewCount + 1,
    });
  },
});

/**
 * 다운로드 수 증가
 */
export const incrementDownload = mutation({
  args: { id: v.id("skills") },
  handler: async (ctx, args) => {
    const skill = await ctx.db.get(args.id);
    if (!skill) return;

    await ctx.db.patch(args.id, {
      downloadCount: skill.downloadCount + 1,
    });
  },
});

/**
 * 스킬 삭제
 */
export const remove = mutation({
  args: { id: v.id("skills") },
  handler: async (ctx, args) => {
    // 관련 댓글 삭제
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_skill", (q) => q.eq("skillId", args.id))
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // 관련 로그 삭제
    const logs = await ctx.db
      .query("scrapingLogs")
      .withIndex("by_skill", (q) => q.eq("skillId", args.id))
      .collect();

    for (const log of logs) {
      await ctx.db.delete(log._id);
    }

    // 스킬 삭제
    await ctx.db.delete(args.id);

    return args.id;
  },
});

// ==================== 로그 관련 ====================

/**
 * 스크래핑 로그 추가
 */
export const addLog = mutation({
  args: {
    skillId: v.id("skills"),
    stage: v.string(),
    message: v.string(),
    level: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("scrapingLogs", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

/**
 * 특정 스킬의 로그 조회
 */
export const getLogs = query({
  args: { skillId: v.id("skills") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("scrapingLogs")
      .withIndex("by_skill", (q) => q.eq("skillId", args.skillId))
      .order("asc")
      .collect();
  },
});

// ==================== 댓글 관련 ====================

/**
 * 댓글 추가
 */
export const addComment = mutation({
  args: {
    skillId: v.id("skills"),
    author: v.string(),
    content: v.string(),
    rating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const commentId = await ctx.db.insert("comments", {
      ...args,
      createdAt: Date.now(),
    });

    return commentId;
  },
});

/**
 * 특정 스킬의 댓글 조회
 */
export const getComments = query({
  args: { skillId: v.id("skills") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_skill", (q) => q.eq("skillId", args.skillId))
      .order("desc")
      .collect();
  },
});
