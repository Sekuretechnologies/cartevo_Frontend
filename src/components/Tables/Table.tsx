import { useState, useEffect } from 'react';
import { columns, Transferts } from "./Column"
import { DataTable } from "./DataTable"
import { data } from '@/constants/Index';

export default function TableComponent() {
  const [tableData, setTableData] = useState<Transferts[]>(data);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={tableData} />
    </div>
  )
}
