'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleXIcon,
  EllipsisIcon,
} from 'lucide-react';
import { useId, useRef, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { showToast } from '@/components/custom-toaster';
import { cn, formatDateID } from '@/lib/utils';
import { DocumentFilter, Edit, Layer, Trash } from 'iconsax-reactjs';
import AddCategoryModal from './add-category-modal';
import EditCategoryModal from './edit-category-modal';
import DeleteCategoryDialog from './delete-category-dialog';

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Category> = (row, columnId, filterValue) => {
  const searchableRowContent = `${row.original.name} ${row.original.description}`.toLowerCase();
  const searchTerm = (filterValue ?? '').toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

// No status filter needed for event categories

// columns must be inside ListCategories for refreshList scope

type ListCategoriesProps = {
  categories: Category[];
};

import { getCategories, deleteCategory } from '@/action/event-action';
import { Category } from '@/types/categories-type';

export default function ListCategories({ categories }: ListCategoriesProps) {
  // Custom filter function for multi-column searching
  const multiColumnFilterFn: FilterFn<Category> = (row, columnId, filterValue) => {
    const searchableRowContent = `${row.original.name} ${row.original.description}`.toLowerCase();
    const searchTerm = (filterValue ?? '').toLowerCase();
    return searchableRowContent.includes(searchTerm);
  };

  const columns: ColumnDef<Category>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 28,
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }) => <div className="font-medium capitalize">{row.getValue('name')}</div>,
      size: 120,
      filterFn: multiColumnFilterFn,
      enableHiding: false,
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: ({ row }) => {
        const desc = row.getValue('description') as string;
        const maxLength = 40;
        const isLong = desc.length > maxLength;
        const displayText = isLong ? desc.slice(0, maxLength) + '...' : desc;
        return isLong ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block max-w-[290px] cursor-help overflow-hidden text-ellipsis whitespace-nowrap">
                {displayText}
              </span>
            </TooltipTrigger>
            <TooltipContent sideOffset={6} className="max-w-xs break-words">
              {desc}
            </TooltipContent>
          </Tooltip>
        ) : (
          <span className="block max-w-[290px] overflow-hidden text-ellipsis whitespace-nowrap">
            {desc}
          </span>
        );
      },
      size: 200,
    },
    {
      header: 'Created At',
      accessorKey: 'createdAt',
      cell: ({ row }) => <div>{formatDateID(row.getValue('createdAt'), { weekday: 'long' })}</div>,
      size: 100,
    },
    {
      header: 'Updated At',
      accessorKey: 'updatedAt',
      cell: ({ row }) => <div>{formatDateID(row.getValue('updatedAt'), { weekday: 'long' })}</div>,
      size: 100,
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => <RowActions row={row} refreshList={refreshList} />,
      size: 60,
      enableHiding: false,
    },
  ];
  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'name',
      desc: false,
    },
  ]);

  const [data, setData] = useState<Category[]>(categories);
  const [refreshing, setRefreshing] = useState(false);

  const refreshList = async () => {
    setRefreshing(true);
    const newCategories = await getCategories();
    setData(newCategories.data || []);
    setRefreshing(false);
  };

  const handleDeleteRows = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;
    let errorCount = 0;
    for (const row of selectedRows) {
      const res = await deleteCategory(row.original.id);
      if (!res.success) errorCount++;
    }
    if (errorCount === 0) {
      showToast('success', `${selectedRows.length} kategori berhasil dihapus`);
    } else {
      showToast('error', `${errorCount} kategori gagal dihapus`);
    }
    await refreshList();
    table.resetRowSelection();
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="mt-10 space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Filter by name or email */}
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                'peer min-w-60 ps-9',
                Boolean(table.getColumn('name')?.getFilterValue()) && 'pe-9',
              )}
              value={(table.getColumn('name')?.getFilterValue() ?? '') as string}
              onChange={(e) => table.getColumn('name')?.setFilterValue(e.target.value)}
              placeholder="Filter by name..."
              type="text"
              aria-label="Filter by name"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <DocumentFilter size="18" variant="Bulk" />{' '}
            </div>
            {Boolean(table.getColumn('name')?.getFilterValue()) && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  table.getColumn('name')?.setFilterValue('');
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              >
                <CircleXIcon size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Toggle columns visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Layer size="20" variant="Bulk" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      onSelect={(event) => event.preventDefault()}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-3">
          {/* Delete button */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="bg-destructive ml-auto flex items-center gap-2 rounded-lg px-4 py-2 text-white shadow"
                  variant="destructive"
                >
                  <Trash size="32" variant="Bulk" />
                  <span className="font-semibold">Delete</span>
                  <span className="bg-background/50 -me-1 inline-flex h-5 max-h-full items-center rounded px-1 font-[inherit] text-[0.625rem] font-medium text-white">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-background rounded-xl border-0 shadow-xl">
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div className="bg-destructive/10 flex size-9 shrink-0 items-center justify-center rounded-full border">
                    <CircleAlertIcon className="text-destructive opacity-80" size={24} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-destructive text-lg font-bold">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      This action cannot be undone. This will permanently delete{' '}
                      <span className="text-destructive font-semibold">
                        {table.getSelectedRowModel().rows.length}
                      </span>{' '}
                      selected {table.getSelectedRowModel().rows.length === 1 ? 'row' : 'rows'}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter className="mt-4 flex flex-row justify-center gap-2">
                  <AlertDialogCancel className="rounded-lg border px-4 py-2">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteRows}
                    className="bg-destructive hover:bg-destructive/90 rounded-lg px-4 py-2 font-semibold text-white shadow transition-colors"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {/* Add category button with modal */}
          <AddCategoryModal onSuccess={refreshList} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-background overflow-hidden rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="h-11"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              'flex h-full cursor-pointer items-center justify-between gap-2 select-none',
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (
                              header.column.getCanSort() &&
                              (e.key === 'Enter' || e.key === ' ')
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
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
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="last:py-0">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-8">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            Rows per page
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Page number information */}
        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p className="text-muted-foreground text-sm whitespace-nowrap" aria-live="polite">
            <span className="text-foreground">
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0,
                ),
                table.getRowCount(),
              )}
            </span>{' '}
            of <span className="text-foreground">{table.getRowCount().toString()}</span>
          </p>
        </div>

        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );

  function RowActions({ row, refreshList }: { row: Row<Category>; refreshList: () => void }) {
    const [editOpen, setEditOpen] = useState(false);
    const category = row.original;
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex justify-end">
              <Button size="icon" variant="ghost" className="shadow-none" aria-label="Edit item">
                <EllipsisIcon size={16} aria-hidden="true" />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="text-green-600 focus:text-green-600"
                onClick={() => setEditOpen(true)}
              >
                <Edit size="32" className="text-green-600" variant="Bulk" />
                <span>Edit</span>
                <DropdownMenuShortcut className="text-green-600">⌘E</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DeleteCategoryDialog id={category.id} name={category.name} onSuccess={refreshList} />
          </DropdownMenuContent>
        </DropdownMenu>
        <EditCategoryModal
          initial={{ name: category.name, description: category.description || '' }}
          id={category.id}
          open={editOpen}
          setOpen={setEditOpen}
          onSuccess={refreshList}
        />
      </>
    );
  }
}
