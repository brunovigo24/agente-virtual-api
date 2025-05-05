const db = require('../database');

exports.findOrCreateByTelefone = async (telefone, nomePessoa) => {
  const [rows] = await db.query('SELECT * FROM clientes WHERE telefone = ?', [telefone]);

  if (rows.length > 0) {
    return rows[0];
  }

  const [result] = await db.query(
    'INSERT INTO clientes (telefone, nome) VALUES (?, ?)',
    [telefone, nomePessoa]
  );

  const [newRows] = await db.query('SELECT * FROM clientes WHERE id = ?', [result.insertId]);
  return newRows[0];
};
