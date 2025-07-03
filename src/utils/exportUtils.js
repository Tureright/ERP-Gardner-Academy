import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPDF = ({ title, headers, data, filename }) => {
  if (!data || !data.length) return;

  const doc = new jsPDF();
  doc.text(title, 14, 16);
  autoTable(doc, {
    startY: 20,
    head: [headers],
    body: data,
  });
  doc.save(`${filename}_${new Date().toISOString().split("T")[0]}.pdf`);
};

export const exportToCSV = ({ headers, data, filename }) => {
  if (!data || !data.length) return;

  const csvContent = [headers, ...data].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
