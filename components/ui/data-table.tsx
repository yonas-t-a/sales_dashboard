"use client";

import { useState, type ReactNode } from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import { exportCsv } from "@/lib/export-csv";
import styles from "@/components/leaderboard/leaderboard.module.css";

type Props<T extends { id: string }> = {
  data: T[]; columns: ColumnDef<T>[]; title: string; description: string;
  searchLabel: string; searchText: (row: T) => string; noun: string;
  exportName: string; exportHeaders: string[]; exportRow: (row: T) => (string | number)[];
  initialSorting: SortingState; toolbar?: ReactNode;
};

export function DataTable<T extends { id: string }>({ data, columns, title, description, searchLabel, searchText, noun, exportName, exportHeaders, exportRow, initialSorting, toolbar }: Props<T>) {
  "use no memo";
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  // TanStack v8 owns a mutable instance; it is consumed locally without compiler memoization.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data, columns, state: { sorting, globalFilter: search }, onSortingChange: setSorting,
    globalFilterFn: (row, _id, value) => searchText(row.original).toLowerCase().includes(String(value).trim().toLowerCase()),
    getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 6 } }, getRowId: (row) => row.id,
  });
  const count = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;
  return <section className={styles.tableCard} aria-label={title}>
    <div className={styles.tableHeader}>
      <div><h2>{title} <span className={styles.count}>{data.length} {noun}</span></h2><p>{description}</p></div>
      <div className={styles.tableActions}>
        <label className={styles.search}><Search aria-hidden="true" /><input type="search" aria-label={searchLabel} placeholder={searchLabel} value={search} onChange={(event) => { setSearch(event.target.value); table.setPageIndex(0); }} /></label>
        <button className={styles.button} disabled={!count} onClick={() => exportCsv(exportName, [exportHeaders, ...table.getPrePaginationRowModel().rows.map(({ original }) => exportRow(original))])}><Download aria-hidden="true" />Export</button>
      </div>
    </div>
    {toolbar}
    <div className={styles.tableScroll} tabIndex={0} role="region" aria-label={`Scrollable ${title.toLowerCase()}`}>
      <table><caption className={styles.srOnly}>{title}. Use column headers to sort.</caption>
        <thead>{table.getHeaderGroups().map((group) => <tr key={group.id}>{group.headers.map((header) => <th key={header.id} scope="col" aria-sort={header.column.getCanSort() ? header.column.getIsSorted() === "asc" ? "ascending" : header.column.getIsSorted() === "desc" ? "descending" : "none" : undefined}>
          {header.column.getCanSort() ? <button onClick={header.column.getToggleSortingHandler()}>{flexRender(header.column.columnDef.header, header.getContext())}{header.column.getIsSorted() === "asc" ? <ArrowUp aria-hidden="true" /> : header.column.getIsSorted() === "desc" ? <ArrowDown aria-hidden="true" /> : <ArrowUpDown aria-hidden="true" />}</button> : flexRender(header.column.columnDef.header, header.getContext())}
        </th>)}</tr>)}</thead>
        <tbody>{table.getRowModel().rows.map((row) => <tr key={row.id}>{row.getVisibleCells().map((cell) => <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}</tbody>
      </table>
    </div>
    {!count && <div className={styles.empty}><Search aria-hidden="true" /><h3>No matching {noun}</h3><p>{search ? "Try another search term or clear your search." : "Try changing the filters above."}</p>{search && <button className={styles.button} onClick={() => { setSearch(""); table.setPageIndex(0); }}>Clear search</button>}</div>}
    <div className={styles.pagination}><span role="status">{count ? `${pageIndex * pageSize + 1}–${Math.min((pageIndex + 1) * pageSize, count)} of ${count} ${noun}` : `0 ${noun}`}</span><div><button className={styles.button} aria-label="Previous page" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}><ChevronLeft aria-hidden="true" /></button><span>Page {count ? pageIndex + 1 : 0} of {table.getPageCount()}</span><button className={styles.button} aria-label="Next page" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}><ChevronRight aria-hidden="true" /></button></div></div>
  </section>;
}
