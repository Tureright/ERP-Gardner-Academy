import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from "@/hooks/useEmployee";
import Calculations from "./PlantillaRolPagos/Calculations";

export default function EmployeePage() {
  return (
    <div>
      <h1>Roles de Pago</h1>
      <div className="flex flex-wrap max-w-4xl gap-2 bg-white p-5 ">
        <Calculations
          title={"Ingresos"}
          items={[
            { name: "lol", value: 5 },
            { name: "pago", value: 3 },
          ]}
        />
        <Calculations
          title={"Deducciones"}
          items={[
            { name: "lol", value: 5 },
            { name: "lol", value: 5 },
          ]}
        />
      </div>
    </div>
  );
}
