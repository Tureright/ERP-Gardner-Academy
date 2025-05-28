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
    const formattedDate = date.toLocaleString("es-ES", {
      month: "long",
      year: "numeric",
    });
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  },
  formatDateDDMMYYYY: function (date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  },
  numberToMoneyWords: numeroALetras,

};


function numeroALetras(num: number | string): string {
  const UNIDADES = [
    '', 'Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve'
  ];
  const DECENAS = [
    '', 'Diez', 'Veinte', 'Treinta', 'Cuarenta', 'Cincuenta',
    'Sesenta', 'Setenta', 'Ochenta', 'Noventa'
  ];
  const DIEZ_A_DIECINUEVE = [
    'Diez', 'Once', 'Doce', 'Trece', 'Catorce', 'Quince',
    'Dieciséis', 'Diecisiete', 'Dieciocho', 'Diecinueve'
  ];
  const CENTENAS = [
    '', 'Ciento', 'Doscientos', 'Trescientos', 'Cuatrocientos',
    'Quinientos', 'Seiscientos', 'Setecientos', 'Ochocientos', 'Novecientos'
  ];

  function convertirGrupoTresCifras(n: number): string {
    const centenas = Math.floor(n / 100);
    const decenasUnidades = n % 100;
    let texto = '';

    if (n === 0) return 'Cero';

    if (centenas === 1 && decenasUnidades === 0) {
      texto += 'Cien';
    } else if (centenas > 0) {
      texto += CENTENAS[centenas] + ' ';
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
          texto += ' y ' + UNIDADES[unidad];
        }
      }
    }

    return texto.trim();
  }

  function seccionesMilesMillones(n: number): string {
    if (n === 0) return 'Cero';

    const millones = Math.floor(n / 1_000_000);
    const miles = Math.floor((n % 1_000_000) / 1_000);
    const cientos = n % 1_000;

    let texto = '';

    if (millones > 0) {
      texto += millones === 1
        ? 'Un Millón '
        : `${convertirGrupoTresCifras(millones)} Millones `;
    }

    if (miles > 0) {
      texto += miles === 1
        ? 'Mil '
        : `${convertirGrupoTresCifras(miles)} Mil `;
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
