const mysql = require('mysql2/promise');

module.exports = async function (context, req) {
    try {
        // 獲取頁碼和每頁數量參數
        const page = parseInt(req.query.page) || 1;
        const pageSize = 100;
        const offset = (page - 1) * pageSize;

        // 創建數據庫連接
        const connection = await mysql.createConnection({
            host: 'vtm-db.mysql.database.azure.com',
            user: 'reader',
            password: 'n9WIbDdUUcUWSsiP',
            database: 'vtm',
            ssl: {
                rejectUnauthorized: true
            }
        });

        // 先獲取總記錄數
        const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM mytestpersontable');
        const totalRecords = countResult[0].total;

        // 分頁查詢數據
        const [rows] = await connection.execute(
            'SELECT * FROM mytestpersontable ORDER BY id LIMIT ? OFFSET ?',
            [parseInt(pageSize), parseInt(offset)]
        );
        
        // 關閉連接
        await connection.end();

        // 返回數據
        context.res.json({
            status: 200,
            data: rows,
            pagination: {
                currentPage: page,
                pageSize: pageSize,
                totalRecords: totalRecords,
                totalPages: Math.ceil(totalRecords / pageSize)
            }
        });

    } catch (error) {
        context.log.error('Database Error:', error);
        context.res.status(500).json({
            status: 500,
            message: '數據庫連接錯誤',
            error: error.message
        });
    }
};