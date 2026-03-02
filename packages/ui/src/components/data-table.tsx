"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type OnChangeFn,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUpDownIcon,
} from "@hugeicons/core-free-icons";
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from "./empty";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  // Server-side pagination
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  // Client-side pagination (default)
  enablePagination?: boolean;
  pageSize?: number;
  // Sorting
  enableSorting?: boolean;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  // Filtering
  enableFiltering?: boolean;
  // Row selection
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  // Loading state
  isLoading?: boolean;
  // Empty state
  emptyMessage?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  pageCount,
  pagination: controlledPagination,
  onPaginationChange,
  enablePagination = true,
  pageSize = 10,
  enableSorting = true,
  sorting: controlledSorting,
  onSortingChange,
  enableFiltering = true,
  enableRowSelection = false,
  onRowSelectionChange,
  isLoading = false,
  emptyMessage = "No results found.",
}: DataTableProps<TData, TValue>) {
  // State for client-side features
  const [internalSorting, setInternalSorting] = React.useState<SortingState>(
    [],
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: pageSize,
    });

  // Determine if we're using server-side pagination
  const isServerSide = !!pageCount;

  // Use controlled or internal state
  const sorting =
    controlledSorting !== undefined ? controlledSorting : internalSorting;
  const setSorting = onSortingChange || setInternalSorting;
  const pagination =
    controlledPagination !== undefined
      ? controlledPagination
      : internalPagination;
  const setPaginationState = onPaginationChange || setInternalPagination;

  // Memoize row model getters so they maintain stable references across re-renders
  const coreModel = React.useMemo(() => getCoreRowModel<TData>(), []);
  const filteredModel = React.useMemo(
    () => (enableFiltering ? getFilteredRowModel<TData>() : undefined),
    [enableFiltering],
  );
  const paginatedModel = React.useMemo(
    () =>
      enablePagination && !isServerSide
        ? getPaginationRowModel<TData>()
        : undefined,
    [enablePagination, isServerSide],
  );
  const sortedModel = React.useMemo(
    () =>
      enableSorting && !controlledSorting
        ? getSortedRowModel<TData>()
        : undefined,
    [enableSorting, controlledSorting],
  );
  const facetedModel = React.useMemo(() => getFacetedRowModel<TData>(), []);
  const facetedValues = React.useMemo(
    () => getFacetedUniqueValues<TData>(),
    [],
  );

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPaginationState,
    getCoreRowModel: coreModel,
    getFilteredRowModel: filteredModel,
    getPaginationRowModel: paginatedModel,
    getSortedRowModel: sortedModel,
    getFacetedRowModel: facetedModel,
    getFacetedUniqueValues: facetedValues,
    manualPagination: isServerSide,
    manualSorting: !!controlledSorting,
    autoResetPageIndex: false,
  });

  // Notify parent of row selection changes
  React.useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original) as TData[];
      onRowSelectionChange(selectedRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  // Handle page size change directly without going through table internals
  const handlePageSizeChange = React.useCallback(
    (value: string) => {
      const newPageSize = Number(value);
      setPaginationState((_old: PaginationState) => ({
        pageIndex: 0,
        pageSize: newPageSize,
      }));
    },
    [setPaginationState],
  );

  // Handle previous/next page for server-side pagination
  const handlePreviousPage = React.useCallback(() => {
    if (isServerSide) {
      setPaginationState((old: PaginationState) => ({
        ...old,
        pageIndex: Math.max(0, old.pageIndex - 1),
      }));
    } else {
      table.previousPage();
    }
  }, [isServerSide, setPaginationState, table]);

  const handleNextPage = React.useCallback(() => {
    if (isServerSide) {
      setPaginationState((old: PaginationState) => ({
        ...old,
        pageIndex: old.pageIndex + 1,
      }));
    } else {
      table.nextPage();
    }
  }, [isServerSide, setPaginationState, table]);

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      {enableFiltering && searchKey && (
        <div className="flex items-center gap-2">
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const metaClassName = (header.column.columnDef.meta as any)
                    ?.className;
                  return (
                    <TableHead key={header.id} className={metaClassName}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={(cell.column.columnDef.meta as any)?.className}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center py-6"
                >
                  <Empty>
                    <EmptyContent>
                      <EmptyTitle>No Results</EmptyTitle>
                      <EmptyDescription>{emptyMessage}</EmptyDescription>
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {enableRowSelection && (
              <>
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </>
            )}
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${pagination.pageSize}`}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="size-8 p-0"
                onClick={handlePreviousPage}
                disabled={pagination.pageIndex === 0}
              >
                <span className="sr-only">Go to previous page</span>
                <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="size-8 p-0"
                onClick={handleNextPage}
                disabled={
                  isServerSide
                    ? pagination.pageIndex >= (pageCount ?? 1) - 1
                    : !table.getCanNextPage()
                }
              >
                <span className="sr-only">Go to next page</span>
                <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for sortable column headers
export function DataTableColumnHeader({
  column,
  title,
  className,
}: {
  column: any;
  title: string;
  className?: string;
}) {
  if (!column.getCanSort()) {
    return <div className={className}>{title}</div>;
  }

  return (
    <div className={className}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <span>{title}</span>
        <HugeiconsIcon icon={ArrowUpDownIcon} className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
