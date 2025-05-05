const db = require('../database');

exports.getOrCreateAtiva = async (cliente) => {
  // Busca conversa ativa
  const [rows] = await db.query(
    'SELECT * FROM conversas WHERE id_cliente = ? AND fim_em IS NULL ORDER BY inicio_em DESC LIMIT 1',
    [cliente.id]
  );

  if (rows.length > 0) {
    return rows[0];
  }

  // Cria nova conversa
  const [result] = await db.query(
    'INSERT INTO conversas (id_cliente) VALUES (?)',
    [cliente.id]
  );

  const [novaConversa] = await db.query(
    'SELECT * FROM conversas WHERE id = ?',
    [result.insertId]
  );

  return novaConversa[0];
};

exports.atualizarEtapa = async (conversaId, novaEtapa) => {
  const [rows] = await pool.query(
    'UPDATE conversas SET etapa_atual = ? WHERE id = ?',
    [novaEtapa, conversaId]
  );
  return rows;
};

