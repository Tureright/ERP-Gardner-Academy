import React from "react";

type Item = {
  description: string;
  amount: number;
};

type Props = {
  title: string;
  items: Item[];
};

function Calculations({ title, items }: Props) {
  return (
    <div className="flex flex-col justify-between gap-4 p-4 bg-gray-100 rounded-lg flex-1 min-w-[350px] text-base">
      <div>
        <h3 className="text-xl mb-3">{title}</h3>
        <ul className="flex flex-col gap-2">
          {items.map((item, index) => (
            <li key={index}>
              <div className="flex items-center justify-between gap-2">
                <p className="flex-1 text-left ">{item.description}</p>
                <p className="text-center w-4 font-semibold">$</p>
                <p className="text-right w-16 text-gray-500">{item.amount.toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <hr className="border-t border-black my-4" />

        <div className="flex flex-row">
          <p className="font-semibold flex-grow">Total {title}</p>
          <p className="font-semibold">
            $
            {items
              .reduce((acc, item) => {
                return acc + item.amount;
              }, 0)
              .toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Calculations;
