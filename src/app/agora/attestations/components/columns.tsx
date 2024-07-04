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
      <div className="w-[200px] truncate"><a href={'https://base.easscan.org/attestation/view/' + row.getValue("id")} target="_blank" className="text-link">{row.getValue("id")}</a></div>
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
      <div className="w-[200px] truncate"><a href={'https://base.easscan.org/address/' + row.getValue("attester")} target="_blank" className="text-link">{row.getValue("attester")}</a></div>
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
      <div className="w-[200px] truncate"><a href={'https://base.easscan.org/address/' + row.getValue("recipient")} target="_blank" className="text-link">{row.getValue("recipient")}</a></div>
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
