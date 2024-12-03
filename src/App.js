import React, { useState } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchModuleRecords = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/message?page=${page}`);
      const result = await response.json();
      if (result.status === 200) {
        setData(result.data);
        setPagination(result.pagination);
        setIsTableVisible(true);
        setCurrentPage(page);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('獲取數據失敗');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchModuleRecords(newPage);
  };

  const renderPagination = () => {
    if (!pagination) return null;

    const { currentPage, totalPages } = pagination;
    const pageNumbers = [];
    
    // 計算要顯示的頁碼範圍
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // 確保始終顯示5個頁碼（如果有）
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(5, totalPages);
      } else {
        startPage = Math.max(1, totalPages - 4);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button 
          className="page-button"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          首頁
        </button>
        <button
          className="page-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          上一頁
        </button>
        {pageNumbers.map(number => (
          <button
            key={number}
            className={`page-button ${number === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}
        <button
          className="page-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          下一頁
        </button>
        <button
          className="page-button"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          末頁
        </button>
        <span className="page-info">
          共 {pagination.totalRecords} 條記錄，
          第 {currentPage}/{totalPages} 頁
        </span>
      </div>
    );
  };

  return (
    <div className="container">
      <h1>數據查詢系統</h1>
      
      <div className="button-group">
        <button 
          className="query-button"
          onClick={() => fetchModuleRecords(1)}
          disabled={loading}
        >
          查詢模塊記錄
        </button>
      </div>

      {error && <div className="error">錯誤: {error}</div>}
      {loading && <div className="loading">數據加載中...</div>}
      
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
          {renderPagination()}
        </div>
      )}
    </div>
  );
}

export default App;