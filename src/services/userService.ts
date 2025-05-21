import db from '../database'; 
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
  id: number;
  username: string;
  password: string;
}

export const findByUsername = async (username: string): Promise<User | null> => {
  const [rows] = await db.query<User[]>(
    'SELECT * FROM users WHERE username = ? LIMIT 1',
    [username]
  );
  return rows.length > 0 ? rows[0] : null;
};
