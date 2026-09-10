"use client";

import { useState } from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Download, Search, Minus } from "lucide-react";
import { formatCurrency, type RankedRep } from "@/data/leaderboard";
import { exportCsv } from "@/lib/export-csv";
import { RepAvatar } from "./rep-avatar";
import styles from "./leaderboard.module.css";

const columns: ColumnDef<RankedRep>[] = [
  { accessorKey: "rank", header: "Rank", cell: ({ row }) => <span className={row.original.rank <= 3 ? styles.topRank : styles.rank}>{String(row.original.rank).padStart(2, "0")}</span> },
  { accessorKey: "name", header: "Sales representative", cell: ({ row }) => <div className={styles.member}><RepAvatar rep={row.original} /><span><strong>{row.original.name}</strong><small>{row.original.role}</small></span></div> },
  { accessorKey: "region", header: "Region" },
  { accessorKey: "revenue", header: "Revenue", cell: ({ getValue }) => <strong>{formatCurrency(getValue<number>())}</strong> },
  { accessorKey: "orders", header: "Orders", cell: ({ getValue }) => getValue<number>().toLocaleString("en-US") },
  { accessorKey: "attainment", header: "Target", cell: ({ row }) => <div className={styles.targetCell}><span className={row.original.attainment >= 100 ? styles.positive : ""}>{row.original.attainment}%</span><meter min="0" max={Math.max(100, row.original.attainment)} value={row.original.attainment} aria-label={`${row.original.name} target attainment`} title={`${formatCurrency(row.original.revenue)} of ${formatCurrency(row.original.target)}`} /></div> },
  { accessorKey: "movement", header: "Rank change", cell: ({ getValue }) => {
    const value = getValue<number>();
    return <span className={value > 0 ? styles.positive : value < 0 ? styles.negative : styles.neutral} aria-label={value ? `${Math.abs(value)} places ${value > 0 ? "up" : "down"}` : "Rank unchanged"}>{value > 0 ? <ArrowUp /> : value < 0 ? <ArrowDown /> : <Minus />}{value ? Math.abs(value) : "—"}</span>;
  } },
];

export function RankingsTable({ data, context, exportName }: { data: RankedRep[]; context: string; exportName: string }) {
  "use no memo"; // TanStack Table v8 manages its own mutable table instance.
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "rank", desc: false }]);
  // This component opts out of compiler memoization and consumes the table locally.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data, columns, state: { sorting, globalFilter: search }, onSortingChange: setSorting, onGlobalFilterChange: setSearch,
    globalFilterFn: (row, _columnId, value) => `${row.original.name} ${row.original.region} ${row.original.role}`.toLowerCase().includes(String(value).toLowerCase().trim()),
    getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 6 } }, getRowId: (row) => row.id,
  });
  const count = table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;

  return <section className={styles.tableCard} aria-labelledby="rankings-heading">
    <div className={styles.tableHeader}>
      <div><h2 id="rankings-heading">Team rankings <span className={styles.count}>{data.length} members</span></h2><p>{context}</p></div>
      <div className={styles.tableActions}>
        <label className={styles.search}><Search aria-hidden="true" /><input type="search" aria-label="Search team rankings" placeholder="Search team members..." value={search} onChange={(event) => { setSearch(event.target.value); table.setPageIndex(0); }} /></label>
        <button className={styles.button} disabled={!count} onClick={() => exportCsv(exportName, [
          ["Rank", "Name", "Region", "Revenue (USD)", "Orders", "Target (USD)", "Target attainment (%)", "Rank change"],
          ...table.getPrePaginationRowModel().rows.map(({ original: rep }) => [rep.rank, rep.name, rep.region, rep.revenue, rep.orders, rep.target, rep.attainment, rep.movement]),
        ])}><Download aria-hidden="true" />Export</button>
      </div>
    </div>
    <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Scrollable team rankings">
      <table>
        <caption className={styles.srOnly}>Sales team rankings. Sort columns using the header buttons.</caption>
        <thead>{table.getHeaderGroups().map((group) => <tr key={group.id}>{group.headers.map((header) => <th key={header.id} scope="col" aria-sort={header.column.getIsSorted() === "asc" ? "ascending" : header.column.getIsSorted() === "desc" ? "descending" : "none"}><button onClick={header.column.getToggleSortingHandler()}>{flexRender(header.column.columnDef.header, header.getContext())}{header.column.getIsSorted() === "asc" ? <ArrowUp aria-hidden="true" /> : header.column.getIsSorted() === "desc" ? <ArrowDown aria-hidden="true" /> : <ArrowUpDown aria-hidden="true" />}</button></th>)}</tr>)}</thead>
        <tbody>{table.getRowModel().rows.map((row) => <tr key={row.id}>{row.getVisibleCells().map((cell) => <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}</tbody>
      </table>
    </div>
    {!count && <div className={styles.empty}><Search aria-hidden="true" /><h3>No matching team members</h3><p>Try another name or clear your search.</p><button className={styles.button} onClick={() => setSearch("")}>Clear search</button></div>}
    <div className={styles.pagination}>
      <span role="status">{count ? `${pageIndex * pageSize + 1}–${Math.min((pageIndex + 1) * pageSize, count)} of ${count} members` : "0 members"}</span>
      <div><button className={styles.button} aria-label="Previous page" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}><ChevronLeft aria-hidden="true" /></button><span>Page {count ? pageIndex + 1 : 0} of {table.getPageCount()}</span><button className={styles.button} aria-label="Next page" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}><ChevronRight aria-hidden="true" /></button></div>
    </div>
  </section>;
}
