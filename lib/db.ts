import mysql from 'mysql2/promise';
import { OkPacket } from 'mysql2'; // Import OkPacket type from mysql2

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const query = async (sql: string, values: any[] = []): Promise<any> => {
  const [results] = await pool.execute(sql, values);

  // If it's an "INSERT" query, return OkPacket (which includes affectedRows, insertId, etc.)
  if (sql.startsWith('INSERT') || sql.startsWith('UPDATE') || sql.startsWith('DELETE')) {
    return results as OkPacket;
  }
  
  // If it's a SELECT query, return RowDataPacket[] (array of rows)
  return results;
};
