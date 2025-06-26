import { Tag } from 'antd';

const getMonthName = (dateString: string) => {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return months[date.getMonth()];
};

export const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('es-EC', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
};

const schema = {
    fields: [
        {
            title: '🏷️ Número factura',
            dataIndex: 'numero',
            key: 'numero',
            align: 'center',
            sorter: true,
        },
        {
            title: '🗓️ Fecha',
            dataIndex: 'fecha_emision',
            key: 'fecha_emision',
            align: 'center',
            sorter: true,
            render: (fecha_emision: string) => (
                <div className="flex items-center justify-center gap-2">
                    <span>{formatDate(fecha_emision)}</span>
                    <Tag color="blue" className="text-xs">
                        {getMonthName(fecha_emision)}
                    </Tag>
                </div>
            ),
        },
        {
            title: 'ℹ️ Cliente',
            dataIndex: ['comprador', 'razon_social'],
            key: 'comprador',
            align: 'center',
        },
        {
            title: '💲Total',
            dataIndex: ['totales', 'importe_total'],
            key: 'totales',
            align: 'center',
            render: (_, record) => (
                <span className="font-medium">${record.totales.importe_total.toFixed(2)}</span>
            ),
            sorter: true,
        },
        {
            title: '📈 Estado',
            dataIndex: 'estado',
            key: 'estado',
            align: 'center',
            render: (estado: string) => {
                const color = estado === 'AUTORIZADO' ? 'green' : 'volcano';
                return (
                    <Tag color={color} key={estado}>
                        {estado}
                    </Tag>
                );
            },
        }
    ],

    filterSchema: {
        numero: {
            type: 'text',
            placeholder: 'Buscar por número...'
        },
        'comprador.razon_social': {
            type: 'text',
            placeholder: 'Buscar por cliente...',
        },
    }
}
export default schema;