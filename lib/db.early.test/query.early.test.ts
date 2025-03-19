
import mysql, { RowDataPacket } from 'mysql2/promise';
import { query } from '../db';




jest.mock("mysql2/promise", () => {
  const mockPool = {
    getConnection: jest.fn(),
  };
  const mockConnection = {
    query: jest.fn(),
    release: jest.fn(),
  };
  mockPool.getConnection.mockResolvedValue(mockConnection);
  return {
    createPool: jest.fn(() => mockPool),
    mockConnection,
  };
});

describe('query() query method', () => {
  const mockConnection = mysql.mockConnection;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy Path Tests
  describe('Happy Path', () => {
    it('should return rows when a valid SQL query is executed', async () => {
      // Arrange
      const sql = 'SELECT * FROM users WHERE id = ?';
      const values = ['1'];
      const expectedRows: RowDataPacket[] = [{ id: 1, name: 'John Doe' }];
      mockConnection.query.mockResolvedValue([expectedRows]);

      // Act
      const result = await query(sql, values);

      // Assert
      expect(result).toEqual(expectedRows);
      expect(mockConnection.query).toHaveBeenCalledWith(sql, values);
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it('should handle queries with no values', async () => {
      // Arrange
      const sql = 'SELECT * FROM users';
      const expectedRows: RowDataPacket[] = [{ id: 1, name: 'John Doe' }];
      mockConnection.query.mockResolvedValue([expectedRows]);

      // Act
      const result = await query(sql);

      // Assert
      expect(result).toEqual(expectedRows);
      expect(mockConnection.query).toHaveBeenCalledWith(sql, []);
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle empty SQL string gracefully', async () => {
      // Arrange
      const sql = '';
      const expectedRows: RowDataPacket[] = [];
      mockConnection.query.mockResolvedValue([expectedRows]);

      // Act
      const result = await query(sql);

      // Assert
      expect(result).toEqual(expectedRows);
      expect(mockConnection.query).toHaveBeenCalledWith(sql, []);
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it('should handle SQL errors gracefully', async () => {
      // Arrange
      const sql = 'SELECT * FROM non_existent_table';
      const error = new Error('Table does not exist');
      mockConnection.query.mockRejectedValue(error);

      // Act & Assert
      await expect(query(sql)).rejects.toThrow('Table does not exist');
      expect(mockConnection.query).toHaveBeenCalledWith(sql, []);
      expect(mockConnection.release).toHaveBeenCalled();
    });

    it('should handle null values in the values array', async () => {
      // Arrange
      const sql = 'SELECT * FROM users WHERE id = ?';
      const values = [null];
      const expectedRows: RowDataPacket[] = [];
      mockConnection.query.mockResolvedValue([expectedRows]);

      // Act
      const result = await query(sql, values);

      // Assert
      expect(result).toEqual(expectedRows);
      expect(mockConnection.query).toHaveBeenCalledWith(sql, values);
      expect(mockConnection.release).toHaveBeenCalled();
    });
  });
});