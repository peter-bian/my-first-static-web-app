import React, { useState } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCompanyTrainingTime = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/message');
      const result = await response.json();
      if (result.status === 200) {
        setData(result.data);
        setIsTableVisible(true);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('獲取數據失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>公司訓練時間統計</h1>
      
      <div className="button-group">
        <button 
          className="query-button"
          onClick={fetchCompanyTrainingTime}
          disabled={loading}
        >
          查詢公司訓練時間
        </button>
      </div>

      {error && <div className="error">錯誤: {error}</div>}
      {loading && <div className="loading">數據加載中...</div>}
      
      {isTableVisible && data.length > 0 && (
        <div className="table-container">
          <h2>訓練時間統計</h2>
          <table>
            <thead>
              <tr>
                <th>公司ID</th>
                <th>總訓練記錄數</th>
                <th>總訓練時間</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.company_id}</td>
                  <td>{row.total_records}</td>
                  <td>{row.training_time}</td>
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