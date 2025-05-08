const db = require('../database');

// Busca conversa ativa (NÃO cria nova)
exports.getAtiva = async (cliente) => {
  const [rows] = await db.query(
    `SELECT * FROM conversas
     WHERE id_cliente = (
       SELECT id FROM clientes WHERE telefone = ?
     ) AND fim_em IS NULL
     ORDER BY id DESC
     LIMIT 1`,
    [cliente.telefone]
  );
  if (rows.length > 0) {
    return rows[0];
  }
  return null;
};

// Cria nova conversa
exports.criar = async (cliente) => {
  const [result] = await db.query(
    'INSERT INTO conversas (id_cliente, etapa_atual) VALUES (?, ?)',
    [cliente.id, 'menu_principal']
  );
  const [novaConversa] = await db.query(
    'SELECT * FROM conversas WHERE id = ?',
    [result.insertId]
  );
  return novaConversa[0];
};

exports.atualizarEtapa = async (conversaId, novaEtapa) => {
  const [rows] = await db.query(
    'UPDATE conversas SET etapa_atual = ? WHERE id = ?',
    [novaEtapa, conversaId]
  );
  return rows;
};

exports.atualizarUltimaInteracao = async (conversaId) => {
  await db.query('UPDATE conversas SET ultima_interacao = NOW() WHERE id = ?', [conversaId]);
};

exports.finalizarConversa = async (conversaId) => {
  const [rows] = await db.query(
    'UPDATE conversas SET fim_em = NOW() WHERE id = ?',
    [conversaId]
  );
  return rows;
};
