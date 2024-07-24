"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "./data-table-column-header"
import { Attestation } from "../data/schema"
import Link from "next/link"

export const columns: ColumnDef<Attestation>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UID" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] truncate"><Link href={'/attestation/' + row.getValue("id")} className="text-link">{row.getValue("id")}</Link></div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "attester",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="From" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] truncate"><Link href={'/address/' + row.getValue("attester")} className="text-link">{row.getValue("attester")}</Link></div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "recipient",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="To" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] truncate"><Link href={'/address/' + row.getValue("recipient")} className="text-link">{row.getValue("recipient")}</Link></div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "timeCreated",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time Created" />
    ),
    cell: ({ row }) => {
      const timeCreated = row.getValue("timeCreated") as number;
      const date = new Date(timeCreated * 1000);  // Convert seconds to milliseconds
      return <div>{date.toLocaleString()}</div>;
    },
    enableSorting: true,
    enableHiding: false,
  },
]
