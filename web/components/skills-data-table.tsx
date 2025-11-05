"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Download, Eye, MoreHorizontal, ExternalLink } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Doc } from "@/convex/_generated/dataModel";
import { formatRelativeTime, formatFileSize, formatNumber } from "@/lib/utils";

/**
 * 스킬 데이터 테이블 컬럼 정의
 */
export const columns: ColumnDef<Doc<"skills">>[] = [
  {
    accessorKey: "icon",
    header: "",
    cell: ({ row }) => (
      <div className="text-2xl">{row.getValue("icon")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          이름
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const skill = row.original;
      return (
        <Link href={`/skills/${skill._id}`} className="hover:text-blue-600">
          <div className="font-semibold flex items-center gap-2">
            {row.getValue("name")}
            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100" />
          </div>
          <div className="text-sm text-gray-500">{skill.description}</div>
        </Link>
      );
    },
  },
  {
    accessorKey: "category",
    header: "카테고리",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return (
        <Badge variant="outline">
          {category}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "difficulty",
    header: "난이도",
    cell: ({ row }) => {
      const difficulty = row.getValue("difficulty") as string;
      const colors = {
        "쉬움": "bg-green-100 text-green-700",
        "보통": "bg-yellow-100 text-yellow-700",
        "어려움": "bg-red-100 text-red-700",
      };
      return (
        <Badge className={colors[difficulty as keyof typeof colors] || ""}>
          {difficulty}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "상태",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const skill = row.original;

      const statusConfig = {
        pending: { label: "대기중", color: "bg-gray-100 text-gray-700" },
        processing: { label: "처리중", color: "bg-blue-100 text-blue-700" },
        completed: { label: "완료", color: "bg-green-100 text-green-700" },
        failed: { label: "실패", color: "bg-red-100 text-red-700" },
      };

      const config = statusConfig[status as keyof typeof statusConfig];

      return (
        <div>
          <Badge className={config?.color}>
            {config?.label}
          </Badge>
          {status === "processing" && skill.progress !== undefined && (
            <div className="text-xs text-gray-500 mt-1">
              {skill.progress}%
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "viewCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Eye className="mr-2 h-4 w-4" />
          조회수
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const views = row.getValue("viewCount") as number;
      return <div className="text-right">{formatNumber(views)}</div>;
    },
  },
  {
    accessorKey: "downloadCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Download className="mr-2 h-4 w-4" />
          다운로드
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const downloads = row.getValue("downloadCount") as number;
      return <div className="text-right">{formatNumber(downloads)}</div>;
    },
  },
  {
    accessorKey: "fileSize",
    header: "크기",
    cell: ({ row }) => {
      const fileSize = row.getValue("fileSize") as number | undefined;
      return <div className="text-right">{formatFileSize(fileSize)}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          생성일
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const timestamp = row.getValue("createdAt") as number;
      return <div className="text-sm">{formatRelativeTime(timestamp)}</div>;
    },
  },
  {
    id: "actions",
    header: "작업",
    cell: ({ row }) => {
      const skill = row.original;

      return (
        <div className="flex gap-2">
          {skill.status === "completed" && skill.downloadUrl && (
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

/**
 * 스킬 데이터 테이블 컴포넌트
 */
interface SkillsDataTableProps {
  data: Doc<"skills">[];
}

export function SkillsDataTable({ data }: SkillsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  스킬이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          총 {table.getFilteredRowModel().rows.length}개의 스킬
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            이전
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
