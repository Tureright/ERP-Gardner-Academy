// EditableCalculations.tsx
import Button from "@/components/molecules/Button";
import React, { useState } from "react";
import { Trash, Plus } from "lucide-react";

type Item = { description: string; amount: number };
type SpecialConfig = {
  [description: string]: { lockDescription: boolean; lockAmount: boolean };
};

type Props = {
  title: string;
  items: Item[];
  setItems: (items: Item[]) => void;
  specialConfig?: SpecialConfig;
};

export default function EditableCalculations({
  title,
  items,
  setItems,
  specialConfig = {},
}: Props) {
  const [editingAmounts, setEditingAmounts] = useState<{ [index: number]: string }>({});

  const handleChange = (index: number, field: keyof Item, value: string) => {
    const config = specialConfig[items[index].description];
    if (field === "description" && config?.lockDescription) return;
    const updated = [...items];
    if (field === "description") updated[index].description = value;
    setItems(updated);
  };

  const handleDelete = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddItem = () => {
    setItems([...items, { description: "Nuevo", amount: 0 }]);
  };

  const total = items.reduce((sum, it) => sum + it.amount, 0);

  const handleAmountChange = (index: number, value: string) => {
    const config = specialConfig[items[index].description];
    if (config?.lockAmount) return;
    const sanitized = value.replace(",", ".");
    if (/^\d*\.?\d*$/.test(sanitized) || sanitized === "") {
      setEditingAmounts((p) => ({ ...p, [index]: sanitized }));
      if (sanitized === "" || /^[0-9]+(\.[0-9]+)?$/.test(sanitized)) {
        const updated = [...items];
        updated[index].amount = sanitized === "" ? 0 : parseFloat(sanitized);
        setItems(updated);
      }
    }
  };

  return (
    <div className="flex flex-col grow shrink basis-[350px] p-4 border border-gray-300 rounded-md w-full bg-white">
      <h3 className="font-bold mb-2">{title}</h3>
      <ul className="flex flex-col gap-3">
        {items.map((item, idx) => {
          const config = specialConfig[item.description] ?? { lockDescription: false, lockAmount: false };

          return (
            <li key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleChange(idx, "description", e.target.value)}
                disabled={config.lockDescription}
                className={`flex-grow border p-2 rounded ${
                  config.lockDescription ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              <input
                type="text"
                inputMode="decimal"
                value={editingAmounts[idx] ?? item.amount.toString()}
                onChange={(e) => handleAmountChange(idx, e.target.value)}
                onBlur={() => {
                  setEditingAmounts((p) => {
                    const c = { ...p };
                    delete c[idx];
                    return c;
                  });
                }}
                disabled={config.lockAmount}
                className={`w-20 border p-2 rounded ${
                  config.lockAmount ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              <Button
                icon={<Trash />}
                variant="icon"
                onClick={() => handleDelete(idx)}
                className="text-red-600 bg-transparent hover:bg-red-100 rounded"
              />
            </li>
          );
        })}
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
