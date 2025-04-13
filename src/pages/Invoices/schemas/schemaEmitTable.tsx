const schema = {
    sheetName: 'Invoices',
    fields: [
        {
            title: '👤 Nombre del estudiante',
            dataIndex: "studentName",
            key: "studentName",
            align: "center",
        },
        {
            title: '📱 Teléfono representante',
            dataIndex: 'representativePhone',
            key: 'representativePhone',
            align: "center",
            type: 'text',
            rules: [{ required: true, message: 'Por favor ingrese el teléfono' }]
        },
        {
            title: '📧 Correo representante',
            dataIndex: 'representativeEmail',
            key: 'representativeEmail',
            type: 'text',
            align: "center",
            rules: [
                { required: true, message: 'Por favor ingrese el correo' },
                { type: 'email', message: 'Por favor ingrese un correo válido' }
            ]
        },
        {
            title: '🆔 Identificación representante',
            dataIndex: 'representativeId',
            key: 'representativeId',
            align: "center",
            type: 'text',
            rules: [{ required: true, message: 'Por favor ingrese la identificación' }]
        }
    ],
    filterSchema: {
        studentName: {
            type: 'text',
            placeholder: 'Buscar por nombre...'
        },
        representativeEmail: {
            type: 'text',
            placeholder: 'Buscar por correo...'
        }
    }
};

export default schema;