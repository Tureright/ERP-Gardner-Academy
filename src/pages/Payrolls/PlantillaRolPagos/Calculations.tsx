import React from 'react'

type Item = {
  name: string;
  value: number;
};

type Props = {
  title: string,
  items: Item[],
}

function Calculations({title, items}: Props) {
  return (
    <div>
      <h1>{title}</h1>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name}: {item.value}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Calculations