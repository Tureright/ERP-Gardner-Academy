const schema = {
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
        },
        {
            title: '📧 Correo representante',
            dataIndex: 'representativeEmail',
            key: 'representativeEmail',
            align: "center",
        },
        {
            title: '🆔 Identificación representante',
            dataIndex: 'representativeId',
            key: 'representativeId',
            align: "center",
        }
    ],
    filterSchema: {
        studentName: {
            type: 'text',
            placeholder: 'Buscar por nombre estudiante...'
        },
        representativeEmail: {
            type: 'text',
            placeholder: 'Buscar por correo...'
        }
    }
};

export default schema;