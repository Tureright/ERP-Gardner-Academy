import MoreInfo from "@/components/atoms/MoreInfo";
import React from "react";
import Table13er from "../components/molecules/Table13er/Table13er";
import Button from "@/components/molecules/Button";
import { Undo } from "lucide-react";

type Props = {};

export default function DecimotercerPage({}: Props) {
  const get13SueldoPeriod = () => {
    const today = new Date();
    const month = today.getMonth(); // 0 = enero, 11 = diciembre
    const currentYear = today.getFullYear();

    // Si ya estamos en diciembre, empezamos un nuevo periodo
    const baseYear = month === 11 ? currentYear + 1 : currentYear;

    return {
      startYear: baseYear - 1,
      endYear: baseYear,
    };
  };

  const { startYear, endYear } = get13SueldoPeriod();

  return (
    <div className="p-4 space-y-5 max-w-4xl mx-auto">
      <div>
        <Button
          icon={<Undo size={20} />}
          variant="icon"
          onClick={() => window.history.back()}
          className="mb-2"
        />
      </div>

      <div className="flex flex-row items-center gap-2">
        <h2 className="text-[2rem]">Décimo Tercer Sueldo</h2>
      </div>

      <p>
        Esta sección muestra el valor estimado del Décimo Tercer Sueldo para
        cada docente que cumple con los requisitos para recibirlo.
      </p>

      <div>
        El décimo tercer sueldo se calcula tomando la doceava parte de todos los
        ingresos registrados desde el{" "}
        <strong className="text-purple-primary">
          1 de diciembre de {startYear}
        </strong>{" "}
        (año anterior) hasta el{" "}
        <strong className="text-purple-primary">
          30 de noviembre de {endYear}
        </strong>{" "}
        (año actual).{" "}
        <MoreInfo message="No se tomarán ingresos externos, como el Fondo de Reserva." />
      </div>

      <p>
        <strong className="text-purple-primary">Fecha límite de pago:</strong>{" "}
        24 de diciembre de {endYear}.
      </p>

      <Table13er />
    </div>
  );
}
