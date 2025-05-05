const db = require('../database');

exports.findOrCreateByTelefone = async (telefone, nomePessoa) => {
  // Remove tudo após o '@', inclusive
  const telefoneLimpo = telefone.split('@')[0];

  const [rows] = await db.query('SELECT * FROM clientes WHERE telefone = ?', [telefoneLimpo]);

  if (rows.length > 0) {
    return rows[0];
  }

  const [result] = await db.query(
    'INSERT INTO clientes (telefone, nome) VALUES (?, ?)',
    [telefoneLimpo, nomePessoa]
  );

  const [newRows] = await db.query('SELECT * FROM clientes WHERE id = ?', [result.insertId]);
  return newRows[0];
};
