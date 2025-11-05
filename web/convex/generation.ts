import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

/**
 * Gemini API를 사용한 스킬 생성 관련 함수들
 */

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

/**
 * 프롬프트로부터 스킬 생성
 */
export const generateFromPrompt = action({
  args: {
    skillId: v.id("skills"),
    prompt: v.string(),
    name: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    // 상태를 processing으로 변경
    await ctx.runMutation(internal.generation.updateGenerationStatus, {
      skillId: args.skillId,
      status: "processing",
      progress: 0,
    });

    await ctx.runMutation(internal.generation.addGenerationLog, {
      skillId: args.skillId,
      stage: "analyzing",
      message: "사용자 프롬프트를 분석 중...",
      level: "info",
    });

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");
      }

      // Gemini API 호출을 위한 시스템 프롬프트
      const systemPrompt = `당신은 Claude AI 스킬 생성 전문가입니다. 사용자의 요청을 바탕으로 완전한 SKILL.md 파일을 생성해야 합니다.

SKILL.md 형식:
---
name: 스킬 이름
description: 스킬에 대한 간단한 설명 (1-2문장)
version: 1.0.0
license: MIT
---

# [스킬 이름]

## 개요
이 스킬의 목적과 사용 시기를 설명합니다.

## 주요 기능
- 기능 1
- 기능 2
- 기능 3

## 사용 방법

### 기본 사용법
\`\`\`language
// 코드 예제
\`\`\`

### 고급 사용법
\`\`\`language
// 고급 코드 예제
\`\`\`

## 참고 자료
- [문서 링크](URL)

요구사항:
1. YAML frontmatter는 반드시 --- 로 감싸야 합니다
2. 실제 사용 가능한 코드 예제를 포함해야 합니다
3. 한국어로 작성해야 합니다
4. Markdown 형식을 준수해야 합니다
5. 구체적이고 실용적인 내용이어야 합니다

사용자 요청: ${args.prompt}

위 요청에 맞는 완전한 SKILL.md 내용을 생성하세요. YAML frontmatter부터 시작하여 완전한 문서를 작성하세요.`;

      await ctx.runMutation(internal.generation.updateGenerationStatus, {
        skillId: args.skillId,
        status: "processing",
        progress: 25,
      });

      await ctx.runMutation(internal.generation.addGenerationLog, {
        skillId: args.skillId,
        stage: "generating",
        message: "Gemini AI로 스킬 콘텐츠 생성 중...",
        level: "info",
      });

      // Gemini API 호출
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: systemPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API 오류: ${response.statusText}`);
      }

      const data = (await response.json()) as GeminiResponse;
      const generatedContent =
        data.candidates[0]?.content?.parts[0]?.text || "";

      if (!generatedContent) {
        throw new Error("Gemini API에서 콘텐츠를 생성하지 못했습니다.");
      }

      await ctx.runMutation(internal.generation.updateGenerationStatus, {
        skillId: args.skillId,
        status: "processing",
        progress: 50,
      });

      await ctx.runMutation(internal.generation.addGenerationLog, {
        skillId: args.skillId,
        stage: "validating",
        message: "생성된 콘텐츠를 검증 중...",
        level: "info",
      });

      // SKILL.md 형식 검증
      if (!generatedContent.includes("---")) {
        throw new Error(
          "생성된 콘텐츠에 YAML frontmatter가 없습니다."
        );
      }

      await ctx.runMutation(internal.generation.updateGenerationStatus, {
        skillId: args.skillId,
        status: "processing",
        progress: 75,
      });

      await ctx.runMutation(internal.generation.addGenerationLog, {
        skillId: args.skillId,
        stage: "packaging",
        message: "스킬 파일을 패키징 중...",
        level: "info",
      });

      // 스킬 콘텐츠를 파일로 저장 (실제로는 스토리지에 저장해야 함)
      // 여기서는 시뮬레이션
      const skillContent = generatedContent;
      const fileName = `${args.name.toLowerCase().replace(/\s+/g, "-")}.md`;

      // TODO: Convex Storage에 실제로 업로드
      // 임시로 완료 처리
      await ctx.runMutation(internal.generation.updateGenerationStatus, {
        skillId: args.skillId,
        status: "completed",
        progress: 100,
        downloadUrl: `https://example.com/skills/${args.skillId}.zip`,
        fileSize: skillContent.length,
      });

      await ctx.runMutation(internal.generation.addGenerationLog, {
        skillId: args.skillId,
        stage: "completed",
        message: "스킬 생성이 완료되었습니다!",
        level: "info",
      });

      return {
        success: true,
        content: skillContent,
        fileName,
      };
    } catch (error) {
      // 실패 처리
      await ctx.runMutation(internal.generation.updateGenerationStatus, {
        skillId: args.skillId,
        status: "failed",
        progress: 0,
      });

      await ctx.runMutation(internal.generation.addGenerationLog, {
        skillId: args.skillId,
        stage: "error",
        message: `스킬 생성 실패: ${error}`,
        level: "error",
      });

      return { success: false, error: String(error) };
    }
  },
});

/**
 * 파일 업로드로부터 스킬 생성
 */
export const generateFromFile = action({
  args: {
    skillId: v.id("skills"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.generation.updateGenerationStatus, {
      skillId: args.skillId,
      status: "processing",
      progress: 0,
    });

    await ctx.runMutation(internal.generation.addGenerationLog, {
      skillId: args.skillId,
      stage: "parsing",
      message: "업로드된 파일을 파싱 중...",
      level: "info",
    });

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY가 설정되지 않았습니다.");
      }

      // Convex Storage에서 파일 읽기
      const fileUrl = await ctx.storage.getUrl(args.storageId);
      if (!fileUrl) {
        throw new Error("파일을 찾을 수 없습니다.");
      }

      const fileResponse = await fetch(fileUrl);
      const fileContent = await fileResponse.text();

      await ctx.runMutation(internal.generation.updateGenerationStatus, {
        skillId: args.skillId,
        status: "processing",
        progress: 25,
      });

      await ctx.runMutation(internal.generation.addGenerationLog, {
        skillId: args.skillId,
        stage: "analyzing",
        message: "파일 내용을 분석 중...",
        level: "info",
      });

      // Gemini로 파일 내용을 분석하고 SKILL.md 생성
      const systemPrompt = `당신은 Claude AI 스킬 생성 전문가입니다. 사용자가 업로드한 문서를 분석하여 완전한 SKILL.md 파일을 생성해야 합니다.

파일 내용:
${fileContent}

위 내용을 바탕으로 Claude AI 스킬 형식(YAML frontmatter + Markdown)으로 완전한 SKILL.md를 생성하세요.

형식:
---
name: 스킬 이름
description: 스킬 설명
version: 1.0.0
license: MIT
---

# [스킬 이름]

## 개요
...

## 주요 기능
...

## 사용 방법
\`\`\`language
// 코드 예제
\`\`\`

한국어로 작성하고, 실제 사용 가능한 구체적인 예제를 포함하세요.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: systemPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 8192,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API 오류: ${response.statusText}`);
      }

      const data = (await response.json()) as GeminiResponse;
      const generatedContent =
        data.candidates[0]?.content?.parts[0]?.text || "";

      await ctx.runMutation(internal.generation.updateGenerationStatus, {
        skillId: args.skillId,
        status: "processing",
        progress: 75,
      });

      await ctx.runMutation(internal.generation.addGenerationLog, {
        skillId: args.skillId,
        stage: "packaging",
        message: "스킬을 패키징 중...",
        level: "info",
      });

      // 완료
      await ctx.runMutation(internal.generation.updateGenerationStatus, {
        skillId: args.skillId,
        status: "completed",
        progress: 100,
        downloadUrl: `https://example.com/skills/${args.skillId}.zip`,
        fileSize: generatedContent.length,
      });

      await ctx.runMutation(internal.generation.addGenerationLog, {
        skillId: args.skillId,
        stage: "completed",
        message: "파일로부터 스킬 생성이 완료되었습니다!",
        level: "info",
      });

      return {
        success: true,
        content: generatedContent,
      };
    } catch (error) {
      await ctx.runMutation(internal.generation.updateGenerationStatus, {
        skillId: args.skillId,
        status: "failed",
        progress: 0,
      });

      await ctx.runMutation(internal.generation.addGenerationLog, {
        skillId: args.skillId,
        stage: "error",
        message: `파일 처리 실패: ${error}`,
        level: "error",
      });

      return { success: false, error: String(error) };
    }
  },
});

/**
 * 생성 상태 업데이트 (internal)
 */
export const updateGenerationStatus = internalMutation({
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
 * 생성 로그 추가 (internal)
 */
export const addGenerationLog = internalMutation({
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
