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

        // 查詢並計算每個公司的總訓練時間
        const [rows] = await connection.execute(`
            SELECT 
                company_id,
                COUNT(DISTINCT record_id) as total_records,
                SUM(TIMESTAMPDIFF(MINUTE, start_time, finish_time)) as total_minutes
            FROM data_module_record 
            WHERE start_time IS NOT NULL 
            AND finish_time IS NOT NULL 
            AND finish_time > start_time
            GROUP BY company_id 
            HAVING total_minutes > 0
            ORDER BY total_minutes DESC
        `);

        // 處理數據，將分鐘轉換為小時和分鐘
        const processedData = rows.map(row => {
            const totalMinutes = parseInt(row.total_minutes);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            
            return {
                company_id: row.company_id,
                total_records: row.total_records,
                training_time: `${hours}小時${minutes}分鐘`,
                total_minutes: totalMinutes // 用於排序
            };
        });
        
        // 關閉連接
        await connection.end();

        // 返回數據
        context.res.json({
            status: 200,
            data: processedData
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