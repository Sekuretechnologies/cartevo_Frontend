import { ColumnDef } from "@tanstack/react-table"

export type Transferts = {
  id: number
  Nom: string
  Pays: string
  Numero: string
  Adresse_Mail: string
  solde_cpt: string
  Total_trans: string
  Moy_trans: string
  Statut: "active" | "pending"
  creation: string
}

export const columns: ColumnDef<Transferts>[] = [
  {
    accessorKey: "status",
    header: "Nom",
  },
  {
    accessorKey: "email",
    header: "Pays",
  },
  {
    accessorKey: "amount",
    header: "Numero",
  },
  {
    accessorKey: "amount",
    header: "Adresse Mail",
  },
  {
    accessorKey: "amount",
    header: "solde cpt",
  },
  {
    accessorKey: "amount",
    header: "Total trans",
  },
  {
    accessorKey: "amount",
    header: "Moy trans",
  },
  {
    accessorKey: "amount",
    header: "Statut",
  },
  {
    accessorKey: "amount",
    header: "creation",
  },
]
