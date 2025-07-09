import { EmployeeResponse, PayrollData, PayrollFullTemplate, workPeriods } from "@/types";
import { func } from "prop-types";

// utils.tsx
type Item = {
  description: string;
  amount: number;
};
export const mathUtils = {
  sumAmounts: function (items: Item[]): number {
    return items.reduce((acc, item) => acc + item.amount, 0);
  },
  formatMonthYear: function (date: Date): string {
    //Recibe desde la base de datos (formato local i.e. 2025-06-10 o Tue Jun 10 2025 23:09:56 GMT-0500 (hora de Ecuador) )
    //  y devuelve el mes y año en español i.e: Junio de 2025 en STRING
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      year: "numeric",
    }; 
    const formatter = new Intl.DateTimeFormat("es-ES", options);
    return formatter.format(date);
  },
  formatDateDDMMYYYY: function (date: Date): string {
    //Recibe desde la base de datos (formato local i.e. 2025-06-10 o Tue Jun 10 2025 23:09:56 GMT-0500 (hora de Ecuador) )
    // y devuelve la fecha en formato DD/MM/YYYY en STRING
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    const formatter = new Intl.DateTimeFormat("es-ES", options);
    return formatter.format(date);

  },
  numberToMoneyWords: numeroALetras,
  formatToFullTemplate: function (
    payrollData: PayrollData,
    employee: EmployeeResponse,
    payrollId: string
  ): PayrollFullTemplate {
    return {
      id: payrollId,
      employeeId: employee.id,
      earnings: payrollData.earnings,
      deductions: payrollData.deductions,
      payrollDate: payrollData.payrollDate,
      firstName: employee.firstName,
      lastName: employee.lastName,
      nationalId: employee.nationalId,
      birthDate: employee.birthDate,
      jobPosition: getCurrentJobPosition(employee.workPeriods), 
      payrollMonth: payrollData.payrollMonth, //IMPLEMENTAR ESTO EN EL BACKEND
    };
  }
};
export function getCurrentJobPosition(workPeriods: workPeriods[]): string {
  //Si el work period  tiene endDate como "Actualmente trabajando" entonces devuelve el jobPosition si no hay ninguno, entonces devuelve un string vacío
  const currentWorkPeriod = workPeriods.find(
    (period) => period.endDate === "Actualmente trabajando"
  );
  return currentWorkPeriod ? currentWorkPeriod.jobPosition : "No trabaja";

}

function numeroALetras(num: number | string): string {
  const UNIDADES = [
    "",
    "Uno",
    "Dos",
    "Tres",
    "Cuatro",
    "Cinco",
    "Seis",
    "Siete",
    "Ocho",
    "Nueve",
  ];
  const DECENAS = [
    "",
    "Diez",
    "Veinte",
    "Treinta",
    "Cuarenta",
    "Cincuenta",
    "Sesenta",
    "Setenta",
    "Ochenta",
    "Noventa",
  ];
  const DIEZ_A_DIECINUEVE = [
    "Diez",
    "Once",
    "Doce",
    "Trece",
    "Catorce",
    "Quince",
    "Dieciséis",
    "Diecisiete",
    "Dieciocho",
    "Diecinueve",
  ];
  const CENTENAS = [
    "",
    "Ciento",
    "Doscientos",
    "Trescientos",
    "Cuatrocientos",
    "Quinientos",
    "Seiscientos",
    "Setecientos",
    "Ochocientos",
    "Novecientos",
  ];

  function convertirGrupoTresCifras(n: number): string {
    const centenas = Math.floor(n / 100);
    const decenasUnidades = n % 100;
    let texto = "";

    if (n === 0) return "Cero";

    if (centenas === 1 && decenasUnidades === 0) {
      texto += "Cien";
    } else if (centenas > 0) {
      texto += CENTENAS[centenas] + " ";
    }

    if (decenasUnidades > 0) {
      if (decenasUnidades < 10) {
        texto += UNIDADES[decenasUnidades];
      } else if (decenasUnidades < 20) {
        texto += DIEZ_A_DIECINUEVE[decenasUnidades - 10];
      } else {
        const decena = Math.floor(decenasUnidades / 10);
        const unidad = decenasUnidades % 10;
        texto += DECENAS[decena];
        if (unidad > 0) {
          texto += " y " + UNIDADES[unidad];
        }
      }
    }

    return texto.trim();
  }

  function seccionesMilesMillones(n: number): string {
    if (n === 0) return "Cero";

    const millones = Math.floor(n / 1_000_000);
    const miles = Math.floor((n % 1_000_000) / 1_000);
    const cientos = n % 1_000;

    let texto = "";

    if (millones > 0) {
      texto +=
        millones === 1
          ? "Un Millón "
          : `${convertirGrupoTresCifras(millones)} Millones `;
    }

    if (miles > 0) {
      texto += miles === 1 ? "Mil " : `${convertirGrupoTresCifras(miles)} Mil `;
    }

    if (cientos > 0) {
      texto += convertirGrupoTresCifras(cientos);
    }

    return texto.trim();
  }

  const entero = Math.floor(num);
  const centavos = Math.round((num - entero) * 100);

  let resultado = `${seccionesMilesMillones(entero)} dólares americanos`;

  if (centavos > 0) {
    resultado += ` con ${seccionesMilesMillones(centavos)} centavos`;
  }

  return resultado;
}

export function convertirMesTextoAISO(fechaTexto) {
    // Mapeo de meses en español a su número correspondiente
    const meses = {
        enero: 0, febrero: 1, marzo: 2, abril: 3,
        mayo: 4, junio: 5, julio: 6, agosto: 7,
        septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
    };

    const partes = fechaTexto.toLowerCase().split(" de ");
    if (partes.length !== 2) return null;

    const mesTexto = partes[0].trim();
    const anio = parseInt(partes[1]);

    const mesNumero = meses[mesTexto];
    if (mesNumero === undefined) return null;

    const fecha = new Date(Date.UTC(anio, mesNumero, 1));
    return fecha.toISOString();
}

export function toUTCISOString(dateStr: string): string {
  const date = new Date(dateStr);
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  return utcDate.toISOString(); // "2024-12-25T00:00:00.000Z"
}
