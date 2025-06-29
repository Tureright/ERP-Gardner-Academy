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

const getMonthColor = (dateString: string) => {
    const [year, month] = dateString.split('-').map(Number);
    
    // Primavera (Septiembre - Noviembre)
    if (month >= 9 && month <= 11) {
        return '#01969C'; // Dark Cyan - Fresco como la primavera
    }
    // Verano (Diciembre - Febrero)
    else if (month === 12 || month <= 2) {
        return '#CE6596'; // Pink - Calor del verano
    }
    // Otoño (Marzo - Mayo)
    else if (month >= 3 && month <= 5) {
        return '#5A2E6B'; // Purple - Madurez del otoño
    }
    // Invierno (Junio - Agosto)
    else {
        return '#EADBF0'; // Pale Purple - Suavidad del invierno
    }
};

const schema = {
    fields: [
        {
            title: '🏷️ Número factura',
            dataIndex: 'numero',
            key: 'numero',
            align: 'center',
            sorter: true,
            render: (numero: string) => (
                <span className="font-medium">{numero}</span>
            ),
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
            dataIndex: 'comprador.razon_social',
            key: 'comprador',
            align: 'center',
            sorter: true,
            render: (_, record) => (
                <span className="font-medium">{record.comprador?.razon_social || 'N/A'}</span>
            ),
        },
        {
            title: '💲Total',
            dataIndex: 'totales.importe_total',
            key: 'totales',
            align: 'center',
            sorter: true,
            render: (_, record) => (
                <span className="font-medium">${record.totales?.importe_total?.toFixed(2) || '0.00'}</span>
            ),
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