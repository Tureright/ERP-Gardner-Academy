import { IVA_OPTIONS } from '../config/constants';

const ivaMapping = IVA_OPTIONS.reduce((acc, option) => {
    acc[option.value] = option.label;
    return acc;
}, {});

const schema = {
    fields: [
        {
            title: '🏷️ Codigo',
            dataIndex: 'codigo_principal',
            key: 'codigo_principal',
            align: 'center',
            sorter: true,
            render: (codigo_principal: string) => (
                <span className="font-medium">{codigo_principal || 'N/A'}</span>
            ),
        },
        {
            title: 'ℹ️ Descripción',
            dataIndex: 'descripcion',
            key: 'descripcion',
            align: 'center',
            sorter: true,
            render: (descripcion: string) => (
                <span className="font-medium">{descripcion || 'N/A'}</span>
            ),
        },
        {
            title: '💲Precio Unitario',
            dataIndex: 'precio_unitario',
            key: 'precio_unitario',
            align: 'center',
            sorter: true,
            render: (_, { precio_unitario }) => {
                return (
                    <span className="font-medium">${precio_unitario?.toFixed(2) || '0.00'}</span>
                )
            }
        },
        {
            title: '💰 IVA',
            dataIndex: 'codigo_iva',
            key: 'codigo_iva',
            align: 'center',
            sorter: true,
            render: (_, { codigo_iva }) => {
                return (
                    <span className="font-medium">{ivaMapping[codigo_iva] || 'No definido'}</span>
                )
            }
        }
    ],

    filterSchema: {
        codigo_principal: {
            type: 'text',
            placeholder: 'Buscar por código...'
        },
        descripcion: {
            type: 'text',
            placeholder: 'Buscar por descripción...'
        }
    }
}
export default schema;