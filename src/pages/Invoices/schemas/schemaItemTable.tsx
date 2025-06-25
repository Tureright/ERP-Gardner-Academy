const schema = {
    fields: [
        {
            title: '🏷️ Codigo',
            dataIndex: 'codigo_principal',
            key: 'codigo_principal',
            align: 'center',
        },
        {
            title: 'ℹ️ Descripción',
            dataIndex: 'descripcion',
            key: 'descripcion',
            align: 'center',
        },
        {
            title: '💲Precio Unitario',
            dataIndex: 'precio_unitario',
            key: 'precio_unitario',
            align: 'center',
            render: (_, { precio_unitario }) => {
                return (
                    <span>${precio_unitario.toFixed(2)}</span>
                )
            }
        },
        {
            title: '💰 IVA',
            dataIndex: 'codigo_iva',
            key: 'codigo_iva',
            align: 'center',
            render: (_, { codigo_iva }) => {
                const ivaMapping = {
                    '0': '0%',
                    '2': '12%',
                    '3': '14%',
                    '4': '15%',
                    '5': '5%',
                    '6': 'No Objeto de IVA',
                    '7': 'Exento',
                    '8': 'IVA Diferenciado',
                    '10': '13%',
                };
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