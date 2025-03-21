import mysql, { RowDataPacket } from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT || '3306'),

});

export async function query(sql: string, values: string[] = []): Promise<RowDataPacket[]> {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(sql, values);
    return rows as RowDataPacket[];
  }
  catch (error) {
    console.error("Database query error:", error); // Debugging log
    throw error;
  } finally {
    if (connection)
      connection.release();
  }
}