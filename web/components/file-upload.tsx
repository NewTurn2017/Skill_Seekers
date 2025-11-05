"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, CheckCircle, AlertCircle } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

interface FileUploadProps {
  skillId: Id<"skills">;
  onUploadComplete?: () => void;
}

/**
 * Convex Storage 파일 업로드 컴포넌트
 */
export function FileUpload({ skillId, onUploadComplete }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const saveSkillFile = useMutation(api.storage.saveSkillFile);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // .zip 파일만 허용
      if (!selectedFile.name.endsWith(".zip")) {
        setErrorMessage(".zip 파일만 업로드 가능합니다.");
        setUploadStatus("error");
        return;
      }

      // 파일 크기 제한 (50MB)
      if (selectedFile.size > 50 * 1024 * 1024) {
        setErrorMessage("파일 크기는 50MB를 초과할 수 없습니다.");
        setUploadStatus("error");
        return;
      }

      setFile(selectedFile);
      setUploadStatus("idle");
      setErrorMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("uploading");
    setUploadProgress(0);

    try {
      // 1. 업로드 URL 생성
      const uploadUrl = await generateUploadUrl();

      // 2. 파일 업로드
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error("파일 업로드 실패");
      }

      const { storageId } = await result.json();

      // 3. 스킬에 파일 정보 저장
      await saveSkillFile({
        skillId,
        storageId,
        fileName: file.name,
        fileSize: file.size,
      });

      setUploadProgress(100);
      setUploadStatus("success");

      // 콜백 호출
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error("업로드 실패:", error);
      setUploadStatus("error");
      setErrorMessage("파일 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* 파일 선택 */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              disabled={isUploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              파일 선택 (.zip)
            </Button>
          </div>

          {/* 선택된 파일 정보 */}
          {file && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <File className="h-8 w-8 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
            </div>
          )}

          {/* 업로드 진행 상태 */}
          {uploadStatus === "uploading" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">업로드 중...</p>
                <p className="text-sm text-gray-600">{uploadProgress}%</p>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* 성공 메시지 */}
          {uploadStatus === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm font-medium text-green-900">
                  파일 업로드 완료!
                </p>
              </div>
            </div>
          )}

          {/* 에러 메시지 */}
          {uploadStatus === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm font-medium text-red-900">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* 업로드 버튼 */}
          {file && uploadStatus !== "success" && (
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  업로드 시작
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
