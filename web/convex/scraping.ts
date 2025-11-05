import { v } from "convex/values";
import { mutation, action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

/**
 * 스크래핑 작업 관련 함수들
 */

/**
 * 스크래핑 작업 시작
 */
export const startScraping = action({
  args: {
    skillId: v.id("skills"),
    configJson: v.string(),
  },
  handler: async (ctx, args) => {
    // 스킬 상태를 processing으로 변경
    await ctx.runMutation(internal.scraping.updateScrapingStatus, {
      skillId: args.skillId,
      status: "processing",
      progress: 0,
    });

    // 로그 추가
    await ctx.runMutation(internal.scraping.addScrapingLog, {
      skillId: args.skillId,
      stage: "scraping",
      message: "스크래핑 작업을 시작합니다...",
      level: "info",
    });

    // 백엔드 API 호출 (실제 스크래핑)
    try {
      const config = JSON.parse(args.configJson);

      // TODO: 실제 백엔드 API 호출
      // const response = await fetch("http://localhost:8000/api/scrape", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ config }),
      // });

      // 시뮬레이션: 단계별 진행
      const stages = [
        { stage: "scraping", message: "문서 페이지를 스크래핑 중...", progress: 25 },
        { stage: "building", message: "스킬 파일을 생성 중...", progress: 50 },
        { stage: "enhancing", message: "AI로 콘텐츠를 향상 중...", progress: 75 },
        { stage: "packaging", message: "ZIP 파일로 패키징 중...", progress: 90 },
      ];

      for (const stageInfo of stages) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2초 대기

        await ctx.runMutation(internal.scraping.updateScrapingStatus, {
          skillId: args.skillId,
          status: "processing",
          progress: stageInfo.progress,
        });

        await ctx.runMutation(internal.scraping.addScrapingLog, {
          skillId: args.skillId,
          stage: stageInfo.stage,
          message: stageInfo.message,
          level: "info",
        });
      }

      // 완료
      await ctx.runMutation(internal.scraping.updateScrapingStatus, {
        skillId: args.skillId,
        status: "completed",
        progress: 100,
        downloadUrl: `https://example.com/skills/${args.skillId}.zip`,
        fileSize: 1024 * 1024 * 5, // 5MB (예시)
      });

      await ctx.runMutation(internal.scraping.addScrapingLog, {
        skillId: args.skillId,
        stage: "completed",
        message: "스킬 생성이 완료되었습니다!",
        level: "info",
      });

      return { success: true };
    } catch (error) {
      // 실패
      await ctx.runMutation(internal.scraping.updateScrapingStatus, {
        skillId: args.skillId,
        status: "failed",
        progress: 0,
      });

      await ctx.runMutation(internal.scraping.addScrapingLog, {
        skillId: args.skillId,
        stage: "error",
        message: `스크래핑 실패: ${error}`,
        level: "error",
      });

      return { success: false, error: String(error) };
    }
  },
});

/**
 * 스크래핑 상태 업데이트 (internal)
 */
export const updateScrapingStatus = internalMutation({
  args: {
    skillId: v.id("skills"),
    status: v.string(),
    progress: v.optional(v.number()),
    downloadUrl: v.optional(v.string()),
    fileSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { skillId, ...updates } = args;
    await ctx.db.patch(skillId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

/**
 * 스크래핑 로그 추가 (internal)
 */
export const addScrapingLog = internalMutation({
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
