import React, { useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Eye } from 'lucide-react';
import { PayrollFullTemplate, PayrollResponse } from '@/types';

const columns = [
  { field: 'payroll', headerName: 'Rol de Pagos', flex: 1, width: 200 },
  {
    field: 'accion',
    headerName: 'Acción',
    width: 120,
    sortable: false,
    renderCell: (params) => {
      return (
        <IconButton
          color="primary"
          onClick={() => {
            // Aquí navegas a la página de detalle del rol de pagos
            window.location.href = `/rol-pagos/${params.row.id}`;
          }}
        >
          <Eye />
        </IconButton>
      );
    },
  },
];

type Props = {
  payrolls?: PayrollFullTemplate[];
};

function Table({payrolls = []}: Props) {
    const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

    const rows = useMemo(() => {
    return payrolls.map((payroll) => ({
      id: payroll.id,
      payroll: `${payroll.firstName} ${payroll.lastName} - ${payroll.payrollDate}`,
    }));
  }, [payrolls]);

  return (
    <div className="w-full h-[400px]">
      <DataGrid
        rows={rows}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
        pageSizeOptions={[3, 5, 10, 20]}
      />
    </div>
  );
}

export default Table;
