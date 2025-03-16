import mysql, { RowDataPacket } from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0,

});

export async function query(sql: string, values: string[] = []): Promise<RowDataPacket[]> {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(sql, values);
    return rows as RowDataPacket[];
  } finally {
    connection.release();
  }
}