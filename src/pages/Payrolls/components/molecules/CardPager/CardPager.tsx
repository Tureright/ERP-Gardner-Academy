import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Plus,
  SearchIcon,
} from "lucide-react";
import { useEmployees } from "@/hooks/useEmployee";
import Card from "../../atoms/Card/Card";
import { EmployeeData, EmployeeResponse } from "@/types";
import Button from "@/components/molecules/Button";

type Props = {
  title: string;
  showAddButton?: boolean;
  selectedId?: string;
  onSelect?: (employee: EmployeeResponse) => void;
};

export default function CardPager({
  title,
  showAddButton,
  selectedId,
  onSelect,
}: Props) {
  const { data, isLoading, error } = useEmployees();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error cargando empleados.</p>;

  const filteredEmployees = data?.data.filter((employee: EmployeeResponse) => {
    const fullName = `${employee.firstName} ${employee.lastName}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const settings = {
    className: "center",
    centerMode: true,
    infinite: false,
    centerPadding: "30px",
    slidesToShow: 1,
    speed: 500,
    rows: 2,
    slidesPerRow: 5,
    dots: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesPerRow: 4 } },
      { breakpoint: 1024, settings: { slidesPerRow: 3 } },
      { breakpoint: 768, settings: { slidesPerRow: 2 } },
      { breakpoint: 640, settings: { slidesPerRow: 1, centerPadding: "0px" } },
    ],
  };

  return (
    <div className="">
      <h2 className="text-[2rem] mb-4 text-gray-500">{title}</h2>
      <div className="mx-auto p-6 bg-purple-light rounded-lg shadow-md">
        <div className="flex justify-end mb-4 space-x-4 flex-wrap">
          <div className="relative w-full max-w-[500px]">
            <input
              type="text"
              placeholder="Buscar empleado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {showAddButton && (
            <Button
              text="Agregar profesor"
              icon={<Plus size={20} strokeWidth={2} />}
              variant="text-icon"
              onClick={() => console.log("Nuevo profesor")}
              className="text-white bg-dark-cyan hover:bg-dark-cyan"
            />
          )}
        </div>

        {filteredEmployees?.length === 0 ? (
          <p className="text-center text-gray-500">No se encontraron empleados.</p>
        ) : (
          <Slider {...settings}>
            {filteredEmployees.map((employee: EmployeeResponse) => (
              <div
                key={employee.id}
                className={`p-2 cursor-pointer rounded-md transition-colors ${
                  selectedId === employee.id ? "bg-purple-primary" : ""
                }`}
                onClick={() => onSelect?.(employee)}
              >
                <Card employee={employee} />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <button
      className="absolute z-10 left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-dark-cyan hover:bg-purple-primary text-purple-light rounded-full flex items-center justify-center shadow focus:outline-none"
      onClick={onClick}
    >
      <ChevronLeftIcon className="w-6 h-6" />
    </button>
  );
}

function NextArrow(props) {
  const { onClick } = props;
  return (
    <button
      className="absolute z-10 right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-dark-cyan hover:bg-purple-primary text-purple-light rounded-full flex items-center justify-center shadow focus:outline-none"
      onClick={onClick}
    >
      <ChevronRightIcon className="w-6 h-6" />
    </button>
  );
}
