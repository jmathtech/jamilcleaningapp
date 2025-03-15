import mysql from 'mysql2/promise';
import { OkPacket, RowDataPacket } from 'mysql2'; // Import OkPacket type from mysql2

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

});

export const query = async (sql: string, values: unknown[] = []): Promise<OkPacket | RowDataPacket[]> => {
  const [results] = await pool.execute(sql, values);

  // If it's an "INSERT" query, return OkPacket (which includes affectedRows, insertId, results, etc.)
  if (sql.startsWith('INSERT') || sql.startsWith('UPDATE') || sql.startsWith('DELETE')) {
    return results as OkPacket;
  }
  
  // If it's a SELECT query, return RowDataPacket[] (array of rows)
  return results as OkPacket | RowDataPacket[];
};
