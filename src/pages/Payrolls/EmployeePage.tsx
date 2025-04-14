import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from "@/hooks/useEmployee";
import Calculations from "./PlantillaRolPagos/Calculations";

export default function EmployeePage() {

  return (
    <div>
      <h1>Roles de Pago</h1>
      <Calculations title={"Ingresos"} items={[{name: "lol", value: 5}, {name: "pago", value: 3}]} />
      <Calculations title={"Egresos"} items={[{name: "lol", value: 5}, {name: "lol", value: 5}]} />

    </div>
  );
}
