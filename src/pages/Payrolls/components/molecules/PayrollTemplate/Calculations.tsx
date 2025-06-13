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
  const total = items.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '16px',
      padding: '16px',
      backgroundColor: '#f2f2f2',
      borderRadius: '8px',
      flex: 1,
      minWidth: '350px',
      fontSize: '16px'
    }}>
      <div>
        <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{title}</h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {items.map((item, index) => (
            <li key={index}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <p style={{ flex: 1, textAlign: 'left' }}>{item.description}</p>
                <p style={{ width: '16px', textAlign: 'center', fontWeight: 'bold' }}>$</p>
                <p style={{ width: '64px', textAlign: 'right', color: '#666' }}>
                  {item.amount.toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <hr style={{ borderTop: '1px solid black', margin: '16px 0' }} />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <p style={{ fontWeight: 'bold', flexGrow: 1 }}>Total {title}</p>
          <p style={{ fontWeight: 'bold' }}>${total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default Calculations;
