"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "./data-table-column-header"
import { Attestation } from "../data/schema"  // Adjust the import path as necessary

export const columns: ColumnDef<Attestation>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UID" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] truncate">{row.getValue("id")}</div>
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
      <div className="w-[200px] truncate">{row.getValue("attester")}</div>
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
      <div className="w-[200px] truncate">{row.getValue("recipient")}</div>
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
