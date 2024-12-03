import React, { useState } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(false);

  const fetchModuleRecords = async () => {
    try {
      const response = await fetch(`/api/message`);
      const result = await response.json();
      if (result.status === 200) {
        setData(result.data);
        setIsTableVisible(true);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('獲取數據失敗');
    }
  };

  return (
    <div className="container">
      <h1>數據查詢系統</h1>
      
      <div className="button-group">
        <button 
          className="query-button"
          onClick={fetchModuleRecords}
        >
          查詢模塊記錄
        </button>
      </div>

      {error && <div className="error">錯誤: {error}</div>}
      
      {isTableVisible && data.length > 0 && (
        <div className="table-container">
          <h2>模塊記錄數據</h2>
          <table>
            <thead>
              <tr>
                {Object.keys(data[0]).map(key => (
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
      )}
    </div>
  );
}

export default App;