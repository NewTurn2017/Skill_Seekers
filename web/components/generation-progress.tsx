"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { CheckCircle, Clock, AlertCircle, XCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface GenerationProgressProps {
  skillId: Id<"skills">;
}

/**
 * 실시간 스킬 생성 진행상황 표시 컴포넌트
 */
export function GenerationProgress({ skillId }: GenerationProgressProps) {
  const skill = useQuery(api.skills.getById, { id: skillId });
  const logs = useQuery(api.skills.getLogs, { skillId });
  const [pulseKey, setPulseKey] = useState(0);

  // 진행률이 변경될 때마다 애니메이션 트리거
  useEffect(() => {
    if (skill?.progress !== undefined) {
      setPulseKey((prev) => prev + 1);
    }
  }, [skill?.progress]);

  if (!skill) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">로딩 중...</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    switch (skill.status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "processing":
        return <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />;
      case "failed":
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusText = () => {
    switch (skill.status) {
      case "completed":
        return "완료";
      case "processing":
        return "생성 중";
      case "failed":
        return "실패";
      default:
        return "대기 중";
    }
  };

  const getStatusColor = () => {
    switch (skill.status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStageKorean = (stage: string) => {
    const stageMap: Record<string, string> = {
      analyzing: "분석",
      generating: "생성",
      validating: "검증",
      packaging: "패키징",
      parsing: "파싱",
      completed: "완료",
      error: "오류",
    };
    return stageMap[stage] || stage;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            AI 스킬 생성 진행상황
          </CardTitle>
          <Badge className={getStatusColor()}>{getStatusText()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 진행률 바 */}
        {skill.status === "processing" && skill.progress !== undefined && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">진행률</p>
              <p className="text-sm text-gray-600">{skill.progress}%</p>
            </div>
            <Progress
              value={skill.progress}
              className="h-3"
              key={pulseKey}
            />
          </div>
        )}

        {/* 완료 메시지 */}
        {skill.status === "completed" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="font-semibold text-green-900">AI 스킬 생성 완료!</p>
            </div>
            <p className="text-sm text-green-700">
              스킬 파일이 준비되었습니다. 다운로드하여 Claude AI에 업로드하세요.
            </p>
          </div>
        )}

        {/* 실패 메시지 */}
        {skill.status === "failed" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <p className="font-semibold text-red-900">스킬 생성 실패</p>
            </div>
            <p className="text-sm text-red-700">
              문제가 발생했습니다. 로그를 확인하거나 다시 시도해주세요.
            </p>
          </div>
        )}

        {/* 로그 */}
        {logs && logs.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">작업 로그</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {logs.slice(-5).reverse().map((log) => (
                <div
                  key={log._id}
                  className={`p-3 rounded-lg border text-sm ${
                    log.level === "error"
                      ? "bg-red-50 border-red-200 text-red-800"
                      : log.level === "warning"
                      ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                      : "bg-gray-50 border-gray-200 text-gray-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="flex-1">{log.message}</p>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {getStageKorean(log.stage)}
                    </Badge>
                  </div>
                  <p className="text-xs opacity-70 mt-1">
                    {formatDate(log.timestamp)}
                  </p>
                </div>
              ))}
            </div>
            {logs.length > 5 && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                최근 5개 로그만 표시됩니다
              </p>
            )}
          </div>
        )}

        {/* 대기 중 */}
        {skill.status === "pending" && (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-blue-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600">
              스킬 생성 작업을 시작하려면 버튼을 클릭하세요
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
