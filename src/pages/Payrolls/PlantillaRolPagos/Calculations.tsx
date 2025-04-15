import React from "react";
import styles from "./Calculations.module.css";

type Item = {
  name: string;
  value: number;
};

type Props = {
  title: string;
  items: Item[];
};

function Calculations({ title, items }: Props) {
  return (
    <div className={styles.calculationsContainer}>
      <h3>{title}</h3>

      <div>
        <ul className="flex flex-col gap-2">
          {items.map((item, index) => (
            <li key={index}>
              <div className={styles.calculationsItem}>
                <p>{item.name}</p>
                <p>$ {item.value}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <hr className={styles.divider} />

      <div className="flex flex-row">
        <p className="flex-grow">Total {title}</p>
        <p>$ 156.25</p>
      </div>
    </div>
  );
}

export default Calculations;
