import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Convex Storage 파일 관리 함수들
 */

/**
 * 파일 업로드 URL 생성
 */
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

/**
 * 스킬에 파일 연결
 */
export const saveSkillFile = mutation({
  args: {
    skillId: v.id("skills"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileSize: v.number(),
  },
  handler: async (ctx, args) => {
    // Storage URL 생성
    const url = await ctx.storage.getUrl(args.storageId);

    // 스킬 업데이트
    await ctx.db.patch(args.skillId, {
      downloadUrl: url || undefined,
      fileSize: args.fileSize,
      updatedAt: Date.now(),
    });

    return { url };
  },
});

/**
 * 파일 다운로드 URL 조회
 */
export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

/**
 * 파일 삭제
 */
export const deleteFile = mutation({
  args: {
    skillId: v.id("skills"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // Storage에서 파일 삭제
    await ctx.storage.delete(args.storageId);

    // 스킬에서 URL 제거
    await ctx.db.patch(args.skillId, {
      downloadUrl: undefined,
      fileSize: undefined,
      updatedAt: Date.now(),
    });
  },
});
