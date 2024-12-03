import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async function () {
      try {
        const response = await fetch(`/api/message`);
        const result = await response.json();
        if (result.status === 200) {
          setData(result.data);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError('獲取數據失敗');
      }
    })();
  }, []);

  if (error) return <div className="error">錯誤: {error}</div>;
  
  return (
    <div>
      <h1>人員列表</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {data.length > 0 && Object.keys(data[0]).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;