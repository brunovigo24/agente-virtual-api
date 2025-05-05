const db = require('../database');

exports.getOrCreateAtiva = async (cliente) => {
  // Busca conversa ativa usando subquery para id_cliente pelo telefone
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

  // Cria nova conversa com etapa_atual = 'menu_principal'
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

