// EditableCalculations.tsx
import Button from "@/components/molecules/Button";
import React from "react";
import { Trash, Plus } from "lucide-react";

type Item = {
  description: string;
  amount: number;
};

type Props = {
  title: string;
  items: Item[];
  setItems: (items: Item[]) => void;
};

export default function EditableCalculations({ title, items, setItems }: Props) {
  const handleChange = (index: number, field: keyof Item, value: string) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === "amount" ? parseFloat(value) || 0 : value;
    setItems(updatedItems);
  };

  const handleDelete = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { description: "Nuevo", amount: 0.0 }]);
  };
  const total = items.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="flex flex-col grow shrink basis-[350px] p-4 border border-gray-300 rounded-md w-full bg-white">
      <h3 className="font-bold mb-2">{title}</h3>
      <ul className="flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item.description}
              onChange={(e) => handleChange(index, "description", e.target.value)}
              className="flex-grow border p-2 rounded"
            />
            <input
              type="number"
              step="0.01"
              value={item.amount}
              onChange={(e) => handleChange(index, "amount", e.target.value)}
              className="w-20 border p-2 rounded"
            />
            <Button 
              icon={<Trash />}
              variant="icon"
              onClick={() => handleDelete(index)}
              className="text-red-600 font-bold bg-transparent hover:bg-red-100 hover:text-black rounded"
            />
          </li>
        ))}
      </ul>
      <Button
      variant="icon"
        icon={<Plus />}
        onClick={handleAddItem}
        className="mt-4 text-sm text-success underline bg-payroll-gray flex justify-center items-center hover:bg-success hover:text-white"
      />

            <hr className="my-4 border-t border-gray-300" />

      <div className="flex justify-between text-gray-800 font-semibold">
        <p>Total {title}</p>
        <p>${total.toFixed(2)}</p>
      </div>
    </div>
  );
}
