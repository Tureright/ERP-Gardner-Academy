import React, { useEffect, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { getMatriculaData, getReservasData } from "@/services/firestore";
import { Tabs, Table, Select, Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { Option } = Select;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4560"];

const DashboardMatricula = () => {
  const [data, setData] = useState([]);
  const [nivelData, setNivelData] = useState([]);
  const [generoData, setGeneroData] = useState([]);
  const [jornadaData, setJornadaData] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [studentsByLevel, setStudentsByLevel] = useState([]);
  //const [students, setStudents] = useState([]); // o viene como prop
  const [searchText, setSearchText] = useState("");
  const [reservas, setReservas] = useState([]);
  const [searchReserva, setSearchReserva] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docs = await getMatriculaData();
        setData(docs);
        processData(docs);
      } catch (err) {
        message.error("Error cargando datos: " + err.message);
      }
    };
    fetchData();
  }, []);

  // Fetch reservas data
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const docs = await getReservasData();
        // docs is array of objects with fields: cedula,nombre,apellidos,nivel,anio
        const formatted = docs.map((item) => ({ key: item.cedula, ...item }));
        setReservas(formatted);
      } catch (err) {
        message.error("Error cargando reservas de cupo: " + err.message);
      }
    };
    fetchReservas();
  }, []);

  const processData = (docs) => {
    const nivelesCount = {};
    const generosCount = {};
    const jornadasCount = {};
    const nivelesSet = new Set();

    docs.forEach((item) => {
      const nivel = item.informacionAcademica?.seleccionNiveles;
      const genero = item.estudiante?.genero;
      const jornada = item.informacionAcademica?.seleccionHorario;

      if (nivel) {
        nivelesCount[nivel] = (nivelesCount[nivel] || 0) + 1;
        nivelesSet.add(nivel);
      }
      if (genero) {
        const genKey = genero.toLowerCase();
        generosCount[genKey] = (generosCount[genKey] || 0) + 1;
      }
      if (jornada) {
        jornadasCount[jornada] = (jornadasCount[jornada] || 0) + 1;
      }
    });

    setNivelData(Object.entries(nivelesCount).map(([name, value]) => ({ name, value })));
    setGeneroData(Object.entries(generosCount).map(([name, value]) => ({ name, value })));
    setJornadaData(Object.entries(jornadasCount).map(([name, value]) => ({ name, value })));
    setLevelOptions(["Todos", ...nivelesSet]);
    if (nivelesSet.size > 0) {
      setLevelOptions(["Todos", ...nivelesSet]);
      setSelectedLevel("Todos");
      filterStudentsByLevel(docs, "Todos");
    }
  };

  const filterStudentsByLevel = (docs, level) => {
    const filtered = docs
      .filter((item) =>
        level === "Todos" || item.informacionAcademica?.seleccionNiveles === level
      )
      .map((item) => ({
        key: item.estudiante?.cedulaEstudiante,
        cedula: item.estudiante?.cedulaEstudiante,
        nombres: item.estudiante?.nombresEstudiante,
        apellidos: item.estudiante?.apellidosEstudiante,
        nivel: item.informacionAcademica?.seleccionNiveles,
        jornada: item.informacionAcademica?.seleccionHorario,
        genero: item.estudiante?.genero,
      }));
    setStudentsByLevel(filtered);
  };

  const getVisibleStudents = () => {
    let filtered = [...studentsByLevel];      // Aplica búsqueda si hay texto
    if (searchText.trim() !== "") {
      const search = searchText.trim().toLowerCase();
      filtered = filtered.filter((student) =>
        `${student.nombres} ${student.apellidos} ${student.cedula} ${student.nivel} ${student.jornada} ${student.genero}`
          .toLowerCase()
          .includes(search)
      );
    }
    else if (selectedLevel && selectedLevel !== "Todos") {
      filtered = filtered.filter((student) => student.nivel === selectedLevel);
    }
    return filtered;
  };

  const handleLevelChange = (value) => {
    setSelectedLevel(value);
    filterStudentsByLevel(data, value);
  };

  // Visible reservas after search
  const getVisibleReservas = () => {
    let filtered = [...reservas];
    if (searchReserva.trim()) {
      const q = searchReserva.trim().toLowerCase();
      filtered = filtered.filter((r) =>
        [r.nombre, r.apellidos, r.cedula, r.nivel]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    return filtered;
  };

  const reservasColumns = [
    { title: "Cédula", dataIndex: "cedula", key: "cedula" },
    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
    { title: "Apellidos", dataIndex: "apellidos", key: "apellidos" },
    { title: "Nivel", dataIndex: "nivel", key: "nivel" },
    { title: "Año", dataIndex: "anio", key: "anio" },
  ];

  const downloadPDF = () => {
    const students = getVisibleStudents();
    if (!students.length) {
      message.warning("No hay datos para exportar a PDF");
      return;
    }
    const doc = new jsPDF();
    doc.text("Listado de Estudiantes", 14, 16);
    autoTable(doc, {
      startY: 20,
      head: [["Cédula", "Nombres", "Apellidos", "Nivel", "Jornada", "Género"]],
      body: students.map((st) => [
        st.cedula,
        st.nombres,
        st.apellidos,
        st.nivel,
        st.jornada,
        st.genero,
      ]),
    });
    doc.save(
      `lista_${selectedLevel ? selectedLevel.replace(/\s+/g, "_") : "todos"}_${new Date()
        .toISOString()
        .split("T")[0]}.pdf`
    );
  };
  const downloadCSV = () => {
    const students = getVisibleStudents();
    if (!students.length) {
      message.warning("No hay datos para descargar");
      return;
    }
    const header = [
      "Cédula",
      "Nombres",
      "Apellidos",
      "Nivel",
      "Horario",
      "Género",
    ];
    const rows = students.map((st) => [
      st.cedula,
      st.nombres,
      st.apellidos,
      st.nivel,
      st.jornada,
      st.genero,
    ]);
    const csvContent = [header, ...rows]
      .map((e) => e.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `lista_${selectedLevel ? selectedLevel.replace(/\s+/g, "_") : "todos"}_${new Date()
        .toISOString()
        .split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    { title: "Cédula", dataIndex: "cedula", key: "cedula" },
    { title: "Nombres", dataIndex: "nombres", key: "nombres" },
    { title: "Apellidos", dataIndex: "apellidos", key: "apellidos" },
    { title: "Nivel", dataIndex: "nivel", key: "nivel" },
    { title: "Jornada", dataIndex: "jornada", key: "jornada" },
    { title: "Género", dataIndex: "genero", key: "genero" },
  ];

  return (
    <Tabs
      defaultActiveKey="1"
      items={[
        {
          key: "1",
          label: "Reportes",
          children: (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              <div className="bg-white rounded-2xl shadow p-4">
                <h2 className="text-xl font-semibold mb-2">Estudiantes por Nivel</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={nivelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl shadow p-4">
                <h2 className="text-xl font-semibold mb-2">Estudiantes por Género</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={generoData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {generoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl shadow p-4 md:col-span-2">
                <h2 className="text-xl font-semibold mb-2">Estudiantes por Jornada</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={jornadaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ),
        },
        {
          key: "2",
          label: "Listas de Estudiantes",
          children: (
            <div className="p-4">
              {/* Buscador y botones de descarga */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Buscar por nombre, cédula, nivel..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="border p-2 rounded w-full max-w-md"
                />

                <div className="flex gap-2">
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={downloadCSV}
                    disabled={getVisibleStudents().length === 0}
                  >
                    Descargar CSV
                  </Button>
                  <Button
                    type="default"
                    onClick={downloadPDF}
                    disabled={getVisibleStudents().length === 0}
                  >
                    Descargar PDF
                  </Button>
                </div>
              </div>

              {/* Filtro por nivel */}
              <Select
                placeholder="Filtrar por nivel"
                style={{ width: 240, marginBottom: 16 }}
                value={selectedLevel}
                onChange={handleLevelChange}
                allowClear
              >
                {levelOptions.map((lvl) => (
                  <Option key={lvl} value={lvl}>{lvl}</Option>
                ))}
              </Select>

              {/* Tabla de resultados */}
              <Table
                columns={columns}
                dataSource={getVisibleStudents()}
                pagination={{ pageSize: 10 }}
                style={{ marginTop: 16 }}
              />
            </div>
          ),
        },
        {
          key: "3",
          label: "Listas de Reservas",
          children: (
            <div className="p-4">
              <input
                type="text"
                placeholder="Buscar por nombre, cédula o nivel..."
                value={searchReserva}
                onChange={(e) => setSearchReserva(e.target.value)}
                className="border p-2 rounded w-full max-w-md mb-4"
              />
              <Table
                columns={reservasColumns}
                dataSource={getVisibleReservas()}
                pagination={{ pageSize: 10 }}
              />
            </div>
          ),
        }
      ]}
    />
  );
};

export default DashboardMatricula;