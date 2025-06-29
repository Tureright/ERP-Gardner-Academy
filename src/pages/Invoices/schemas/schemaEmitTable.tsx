const schema = {
    fields: [
        {
            title: '👤 Nombre del estudiante',
            dataIndex: "studentName",
            key: "studentName",
            align: "center",
            sorter: true,
            render: (studentName: string) => (
                <span className="font-medium">{studentName}</span>
            ),
        },
        {
            title: '📱 Teléfono representante',
            dataIndex: 'representativePhone',
            key: 'representativePhone',
            align: "center",
            render: (representativePhone: string) => (
                <span className="font-medium">{representativePhone || 'N/A'}</span>
            ),
        },
        {
            title: '📧 Correo representante',
            dataIndex: 'representativeEmail',
            key: 'representativeEmail',
            align: "center",
            sorter: true,
            render: (representativeEmail: string) => (
                <span className="font-medium">{representativeEmail || 'N/A'}</span>
            ),
        },
        {
            title: '🆔 Identificación representante',
            dataIndex: 'representativeId',
            key: 'representativeId',
            align: "center",
            render: (representativeId: string) => (
                <span className="font-medium">{representativeId || 'N/A'}</span>
            ),
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