const mysql = require('mysql2/promise');

module.exports = async function (context, req) {
    try {
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

        // 執行查詢
        const [rows] = await connection.execute('SELECT * FROM mytestpersontable');
        
        // 關閉連接
        await connection.end();

        // 返回數據
        context.res.json({
            status: 200,
            data: rows
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