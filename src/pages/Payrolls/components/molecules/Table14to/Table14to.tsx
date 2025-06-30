import MoreInfo from "@/components/atoms/MoreInfo";
import Button from "@/components/molecules/Button";
import { useEmployees } from "@/hooks/useEmployee";
import { ArrowBigRightDash } from "lucide-react";
import React, { useEffect, useState } from "react";
type Props ={
    onNumEmployees?: (numEmployees: string) => void;
}
export default function Table14to({onNumEmployees}:Props) {
  const { data } = useEmployees();
  const employeesLength = data?.data.length ?? 0;
    useEffect(() => {
    if (onNumEmployees) {
      onNumEmployees(employeesLength.toString());
    }
  }, [employeesLength, onNumEmployees]);

  const [sbu, setSbu] = useState<number>(470);
  const [customSbu, setCustomSbu] = useState<string>("470");

  const [numEmployees, setNumEmployees] = useState<number>(employeesLength);
  const [customNumEmployees, setCustomNumEmployees] =
    useState<string>(employeesLength);

  const handleChangeSBU = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomSbu(e.target.value);
  };
  const handleChangeNumEmployees = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomNumEmployees(e.target.value);
  };

  const handleCalculate = () => {
    const parsedSBU = parseFloat(customSbu);
    if (!isNaN(parsedSBU) && parsedSBU > 0) {
      setSbu(parsedSBU);
    }

    const parsedNumEmployees = parseFloat(customNumEmployees);
    if (!isNaN(parsedNumEmployees) && parsedNumEmployees > 0) {
      setNumEmployees(parsedNumEmployees);
    }
  };

  const total = sbu * numEmployees;

    const endDate14to = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const lastYear = currentYear - 1;
    return { currentYear, lastYear };
  };

  return (
    <div className="flex items-center justify-between border border-gray-300 rounded-md p-4 max-w-4xl mx-auto bg-white shadow-sm space-x-6">
      {/* Sección izquierda: Input SBU */}
      <div className="flex flex-col w-1/3">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
          SBU
        </label>
        <input
          type="number"
          value={customSbu}
          onChange={handleChangeSBU}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
        />

        <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
          Cantidad de docentes
        </label>
        <input
          type="number"
          value={customNumEmployees}
          onChange={handleChangeNumEmployees}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Sección media: botón calcular con flecha */}
      <div className="flex flex-col items-center justify-center w-1/3">
        <Button
          text="Calcular"
          icon={<ArrowBigRightDash />}
          variant="text-icon"
          onClick={handleCalculate}
          className=""
        />
      </div>

      {/* Sección derecha: Resultado */}
      <div className="flex flex-col items-start w-1/3">
        <p className="text-sm text-gray-700 mb-1">
          <span className="font-semibold">
            Total para {numEmployees} docentes:
          </span>
        </p>
        <div className="flex flex-row gap-2 items-center">
          <p className="text-lg font-bold text-dark-cyan">
            ${total.toFixed(2)}
          </p>

          <MoreInfo
            message={`Dinero que debe ser apartado hasta el 15 de agosto de ${endDate14to().currentYear}`}
          />
        </div>
      </div>
    </div>
  );
}
