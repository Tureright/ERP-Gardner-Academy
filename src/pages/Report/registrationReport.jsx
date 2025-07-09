import React, { useEffect, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { getMatriculaData, getReservasData } from "@/services/firestore";
import { Tabs, Table, Select, Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { allFields } from "@/services/Report/exportableFields";
import get from "lodash.get";
import "../../styles/reportes.css";
import { exportToPDF, exportToCSV } from "@/utils/exportUtils";


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
  const [searchText, setSearchText] = useState("");
  const [reservas, setReservas] = useState([]);
  const [searchReserva, setSearchReserva] = useState("");
  const [selectedFields, setSelectedFields] = useState([]); // Estado para las columnas seleccionadas

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

  const getFullStudentObjects = () => {
    const visibles = getVisibleStudents();
    return data.filter((d) =>
      visibles.some((v) => v.cedula === d.estudiante?.cedulaEstudiante)
    );
  };

  const generateExportRows = () => {
    const students = getVisibleStudents();

    if (!students.length) return { header: [], rows: [] };

    // Si no hay campos seleccionados, usar los por defecto
    const defaultFields = [
      { key: "cedula", label: "Cédula" },
      { key: "nombres", label: "Nombres" },
      { key: "apellidos", label: "Apellidos" },
      { key: "nivel", label: "Nivel" },
      { key: "jornada", label: "Jornada" },
      { key: "genero", label: "Género" },
    ];

    const fields = selectedFields.length > 0
      ? selectedFields.map(fieldKey => {
        const found = allFields.find(f => f.key === fieldKey);
        return found || { key: fieldKey, label: fieldKey }; // Fallback
      })
      : defaultFields;

    const header = fields.map(f => f.label);

    const rows = students.map(student =>
      fields.map(({ key }) =>
        key.split(".").reduce((obj, part) => obj?.[part], student) ?? ""
      )
    );

    return { header, rows };
  };

const downloadPDF = () => {
  const { header, rows } = generateExportRows();
  if (!rows.length) {
    message.warning("No hay datos para exportar a PDF");
    return;
  }

  exportToPDF({
    title: "Listado de Estudiantes",
    headers: header,
    data: rows,
    filename: `lista_${selectedLevel || "todos"}`
  });
};
const downloadCSV = () => {
  const { header, rows } = generateExportRows();
  if (!rows.length) {
    message.warning("No hay datos para descargar");
    return;
  }

  exportToCSV({
    headers: header,
    data: rows,
    filename: `lista_${selectedLevel || "todos"}`
  });
};

const downloadReservasCSV = () => {
  const reservas = getVisibleReservas();
  if (!reservas.length) {
    message.warning("No hay datos para descargar");
    return;
  }

  const headers = ["Cédula", "Nombre", "Apellidos", "Nivel", "Año"];
  const data = reservas.map(({ cedula, nombre, apellidos, nivel, anio }) =>
    [cedula, nombre, apellidos, nivel, anio]
  );

  exportToCSV({ headers, data, filename: "reservas" });
};

const downloadReservasPDF = () => {
  const reservas = getVisibleReservas();
  if (!reservas.length) {
    message.warning("No hay datos para exportar");
    return;
  }

  const headers = ["Cédula", "Nombre", "Apellidos", "Nivel", "Año"];
  const data = reservas.map(({ cedula, nombre, apellidos, nivel, anio }) =>
    [cedula, nombre, apellidos, nivel, anio]
  );

  exportToPDF({
    title: "Listado de Reservas de Cupo",
    headers,
    data,
    filename: "reservas"
  });
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
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Buscar por nombre, cédula, nivel..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="border p-2 rounded w-full max-w-md"
                />
                <div className="flex gap-2">
                  <Select
                    mode="multiple"
                    placeholder="Elige columnas a exportar"
                    value={selectedFields}
                    onChange={(values) => {
                      if (values.includes("ALL")) {
                        setSelectedFields(allFields.map((field) => field.key));
                      } else if (values.includes("NONE")) {
                        setSelectedFields([]);
                      } else {
                        setSelectedFields(values);
                      }
                    }}
                    className="select-export-columns"
                    dropdownClassName="select-dropdown"
                    maxTagCount="responsive"
                  >
                    <Option value="ALL">Todos</Option>
                    <Option value="NONE">Ninguno</Option>
                    {allFields.map(({ key, label }) => (
                      <Option key={key} value={key}>
                        {label}
                      </Option>
                    ))}
                  </Select>

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

              <Table
                columns={columns}
                dataSource={getVisibleStudents()}
                pagination={{ pageSize: 10 }}
                style={{ marginTop: 16 }}
              />
            </div >
          ),
        },
        {
          key: "3",
          label: "Listas de Reservas",
          children: (
            <div className="p-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Buscar por nombre, cédula o nivel..."
                  value={searchReserva}
                  onChange={(e) => setSearchReserva(e.target.value)}
                  className="border p-2 rounded w-full max-w-md mb-4"
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
              <Table
                columns={reservasColumns}
                dataSource={getVisibleReservas()}
                pagination={{ pageSize: 10 }}
                style={{ marginTop: 16 }}
              />
            </div>
          ),
        }
      ]}
    />
  );
};

export default DashboardMatricula;
/*
import React, { useEffect, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { getMatriculaData, getReservasData } from "@/services/firestore";
import { Tabs, Table, Select, Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { allFields } from "@/services/Report/exportableFields";
import { exportToPDF, exportToCSV } from "@/utils/exportUtils";

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
  const [searchText, setSearchText] = useState("");
  const [reservas, setReservas] = useState([]);
  const [searchReserva, setSearchReserva] = useState("");
  const [selectedFields, setSelectedFields] = useState([]);

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

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const docs = await getReservasData();
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
    let filtered = [...studentsByLevel];
    if (searchText.trim() !== "") {
      const search = searchText.trim().toLowerCase();
      filtered = filtered.filter((student) =>
        `${student.nombres} ${student.apellidos} ${student.cedula} ${student.nivel} ${student.jornada} ${student.genero}`
          .toLowerCase()
          .includes(search)
      );
    } else if (selectedLevel && selectedLevel !== "Todos") {
      filtered = filtered.filter((student) => student.nivel === selectedLevel);
    }
    return filtered;
  };

  const getVisibleReservas = () => {
    let filtered = [...reservas];
    if (searchReserva.trim()) {
      const q = searchReserva.trim().toLowerCase();
      filtered = filtered.filter((r) =>
        [r.nombre, r.apellidos, r.cedula, r.nivel].join(" ").toLowerCase().includes(q)
      );
    }
    return filtered;
  };

    const handleLevelChange = (value) => {
    setSelectedLevel(value);
    filterStudentsByLevel(data, value);
  };

  const reservasColumns = [
    { title: "Cédula", dataIndex: "cedula", key: "cedula" },
    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
    { title: "Apellidos", dataIndex: "apellidos", key: "apellidos" },
    { title: "Nivel", dataIndex: "nivel", key: "nivel" },
    { title: "Año", dataIndex: "anio", key: "anio" },
  ];

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
          children: <div>...gráficos aquí...</div>,
        },
        {
          key: "2",
          label: "Listas de Estudiantes",
          children: (
            <div className="p-4">
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
                    onClick={() => exportToCSV(getVisibleStudents(), selectedFields, allFields, selectedLevel)}
                    disabled={getVisibleStudents().length === 0}
                  >
                    Descargar CSV
                  </Button>
                  <Button
                    type="default"
                    onClick={() => exportToPDF(getVisibleStudents(), selectedFields, allFields, selectedLevel)}
                    disabled={getVisibleStudents().length === 0}
                  >
                    Descargar PDF
                  </Button>
                </div>
              </div>
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
              <Table
                columns={columns}
                dataSource={getVisibleStudents()}
                pagination={{ pageSize: 10 }}
              />
            </div>
          ),
        },
        {
          key: "3",
          label: "Listas de Reservas",
          children: (
            <div className="p-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Buscar por nombre, cédula o nivel..."
                  value={searchReserva}
                  onChange={(e) => setSearchReserva(e.target.value)}
                  className="border p-2 rounded w-full max-w-md"
                />
                <div className="flex gap-2">
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => exportToCSV(getVisibleReservas(), null, null, "reservas")}
                    disabled={getVisibleReservas().length === 0}
                  >
                    Descargar CSV
                  </Button>
                  <Button
                    type="default"
                    onClick={() => exportToPDF(getVisibleReservas(), null, null, "reservas")}
                    disabled={getVisibleReservas().length === 0}
                  >
                    Descargar PDF
                  </Button>
                </div>
              </div>
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
*/