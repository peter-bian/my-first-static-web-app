import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// 註冊 ChartJS 組件
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' 或 'chart'

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

  // 圖表數據
  const chartData = {
    labels: data.map(item => `公司 ${item.company_id}`),
    datasets: [
      {
        label: '訓練時間（分鐘）',
        data: data.map(item => item.total_minutes),
        backgroundColor: 'rgba(74, 144, 226, 0.5)',
        borderColor: 'rgba(74, 144, 226, 1)',
        borderWidth: 1,
      }
    ]
  };

  // 圖表配置
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '公司訓練時間統計圖表',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const hours = Math.floor(value / 60);
            const minutes = value % 60;
            return `${hours}小時${minutes}分鐘`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: '訓練時間（分鐘）'
        }
      },
      x: {
        title: {
          display: true,
          text: '公司'
        }
      }
    }
  };

  const toggleView = () => {
    setViewMode(viewMode === 'table' ? 'chart' : 'table');
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
        {data.length > 0 && (
          <button 
            className="view-toggle-button"
            onClick={toggleView}
          >
            切換至{viewMode === 'table' ? '圖表' : '表格'}視圖
          </button>
        )}
      </div>

      {error && <div className="error">錯誤: {error}</div>}
      {loading && <div className="loading">數據加載中...</div>}
      
      {isTableVisible && data.length > 0 && (
        <div className="data-container">
          {viewMode === 'table' ? (
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
          ) : (
            <div className="chart-container">
              <Bar options={chartOptions} data={chartData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;