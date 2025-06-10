import React, { useEffect, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { getMatriculaData } from "@/services/firestore";
import { Tabs, Table, Select, Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;
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
    setLevelOptions([...nivelesSet]);
    if (nivelesSet.size > 0) {
      const first = nivelesSet.values().next().value;
      setSelectedLevel(first);
      filterStudentsByLevel(docs, first);
    }
  };

  const filterStudentsByLevel = (docs, level) => {
    const filtered = docs
      .filter((item) => item.informacionAcademica?.seleccionNiveles === level)
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

  const handleLevelChange = (value) => {
    setSelectedLevel(value);
    filterStudentsByLevel(data, value);
  };

  const downloadCSV = () => {
    if (!studentsByLevel.length) {
      message.warning("No hay datos para descargar");
      return;
    }
    const header = [
      "Cédula",
      "Nombres",
      "Apellidos",
      "Nivel",
      "Jornada",
      "Género",
    ];
    const rows = studentsByLevel.map((st) => [
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
      `lista_${selectedLevel.replace(/\s+/g, "_")}.csv`
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
    <Tabs defaultActiveKey="1">
      <TabPane tab="Reportes" key="1">
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
      </TabPane>

      <TabPane tab="Listas de Estudiantes" key="2">
        <div className="p-4">
          <Select
            style={{ width: 240, marginBottom: 16 }}
            value={selectedLevel}
            onChange={handleLevelChange}
          >
            {levelOptions.map((lvl) => (
              <Option key={lvl} value={lvl}>{lvl}</Option>
            ))}
          </Select>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={downloadCSV}
            disabled={!selectedLevel}
            style={{ marginLeft: 16 }}
          >
            Descargar CSV
          </Button>

          <Table
            columns={columns}
            dataSource={studentsByLevel}
            pagination={{ pageSize: 10 }}
            style={{ marginTop: 16 }}
          />
        </div>
      </TabPane>
    </Tabs>
  );
};

export default DashboardMatricula;
/*
import React, { useEffect, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { getMatriculaData } from "@/services/firestore";
import { Tabs, Table, Select, Button, message } from "antd";
import { DownloadOutlined, FilePdfOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const { TabPane } = Tabs;
const { Option } = Select;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4560"];

const DashboardMatricula = () => {
  const [data, setData] = useState([]);
  const [nivelData, setNivelData] = useState([]);
  const [generoData, setGeneroData] = useState([]);
  const [jornadaData, setJornadaData] = useState([]);
  const [levelOptions, setLevelOptions] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedJornada, setSelectedJornada] = useState(null);
  const [selectedModalidad, setSelectedModalidad] = useState(null);
  const [studentsByLevel, setStudentsByLevel] = useState([]);

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
    setLevelOptions([...nivelesSet]);
    if (nivelesSet.size > 0) {
      const first = nivelesSet.values().next().value;
      setSelectedLevel(first);
      filterStudents(docs, first, selectedJornada, selectedModalidad);
    }
  };

  const filterStudents = (docs, nivel, jornada, modalidad) => {
    const filtered = docs.filter((item) => {
      const niv = item.informacionAcademica?.seleccionNiveles;
      const jor = item.informacionAcademica?.seleccionHorario;
      const mod = item.informacionAcademica?.seleccionModalidad;
      return (!nivel || niv === nivel) && (!jornada || jor === jornada) && (!modalidad || mod === modalidad);
    }).map((item) => ({
      key: item.estudiante?.cedulaEstudiante,
      cedula: item.estudiante?.cedulaEstudiante,
      nombres: item.estudiante?.nombresEstudiante,
      apellidos: item.estudiante?.apellidosEstudiante,
      nivel: item.informacionAcademica?.seleccionNiveles,
      jornada: item.informacionAcademica?.seleccionHorario,
      modalidad: item.informacionAcademica?.seleccionModalidad,
      genero: item.estudiante?.genero,
    }));
    setStudentsByLevel(filtered);
  };

  const handleLevelChange = (value) => {
    setSelectedLevel(value);
    filterStudents(data, value, selectedJornada, selectedModalidad);
  };

  const handleJornadaChange = (value) => {
    setSelectedJornada(value);
    filterStudents(data, selectedLevel, value, selectedModalidad);
  };

  const handleModalidadChange = (value) => {
    setSelectedModalidad(value);
    filterStudents(data, selectedLevel, selectedJornada, value);
  };

  const downloadCSV = () => {
    if (!studentsByLevel.length) {
      message.warning("No hay datos para descargar");
      return;
    }
    const header = ["Cédula", "Nombres", "Apellidos", "Nivel", "Jornada", "Modalidad", "Género"];
    const rows = studentsByLevel.map((st) => [
      st.cedula,
      st.nombres,
      st.apellidos,
      st.nivel,
      st.jornada,
      st.modalidad,
      st.genero,
    ]);
    const csvContent = [header, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `lista_${selectedLevel.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    if (!studentsByLevel.length) {
      message.warning("No hay datos para exportar a PDF");
      return;
    }
    const doc = new jsPDF();
    doc.text("Lista de Estudiantes", 14, 16);
    autoTable(doc, {
      head: [["Cédula", "Nombres", "Apellidos", "Nivel", "Jornada", "Modalidad", "Género"]],
      body: studentsByLevel.map((st) => [
        st.cedula,
        st.nombres,
        st.apellidos,
        st.nivel,
        st.jornada,
        st.modalidad,
        st.genero,
      ]),
      startY: 20,
    });
    doc.save(`lista_${selectedLevel.replace(/\s+/g, "_")}.pdf`);
  };

  const columns = [
    { title: "Cédula", dataIndex: "cedula", key: "cedula" },
    { title: "Nombres", dataIndex: "nombres", key: "nombres" },
    { title: "Apellidos", dataIndex: "apellidos", key: "apellidos" },
    { title: "Nivel", dataIndex: "nivel", key: "nivel" },
    { title: "Jornada", dataIndex: "jornada", key: "jornada" },
    { title: "Modalidad", dataIndex: "modalidad", key: "modalidad" },
    { title: "Género", dataIndex: "genero", key: "genero" },
  ];

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Reportes" key="1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {/* Gráficos existentes 
        </div>
      </TabPane>
      <TabPane tab="Listas de Estudiantes" key="2">
        <div className="p-4">
          <Select placeholder="Nivel" style={{ width: 180, marginBottom: 8 }} value={selectedLevel} onChange={handleLevelChange}>
            {levelOptions.map((lvl) => (
              <Option key={lvl} value={lvl}>{lvl}</Option>
            ))}
          </Select>
          <Select placeholder="Jornada" style={{ width: 180, marginLeft: 8 }} onChange={handleJornadaChange} allowClear>
            <Option value="Matutina">Matutina</Option>
            <Option value="Vespertina">Vespertina</Option>
          </Select>
          <Select placeholder="Modalidad" style={{ width: 180, marginLeft: 8 }} onChange={handleModalidadChange} allowClear>
            <Option value="Presencial">Presencial</Option>
            <Option value="Virtual">Virtual</Option>
            <Option value="Mixta">Mixta</Option>
          </Select>

          <Button type="primary" icon={<DownloadOutlined />} onClick={downloadCSV} style={{ marginLeft: 16 }}>Descargar CSV</Button>
          <Button icon={<FilePdfOutlined />} onClick={downloadPDF} style={{ marginLeft: 8 }}>Exportar PDF</Button>

          <Table columns={columns} dataSource={studentsByLevel} pagination={{ pageSize: 10 }} style={{ marginTop: 16 }} />
        </div>
      </TabPane>
    </Tabs>
  );
};

export default DashboardMatricula;*/
