const db = require('../database');

exports.registrarEntrada = async (conversaId, mensagem) => {
  await db.query(
    `INSERT INTO mensagens (conversa_id, mensagem, tipo, data_hora)
     VALUES (?, ?, 'entrada', NOW())`,
    [conversaId, mensagem]
  );
};

exports.registrarSaida = async (conversaId, mensagem) => {
  await db.query(
    `INSERT INTO mensagens (conversa_id, mensagem, tipo, data_hora)
     VALUES (?, ?, 'saida', NOW())`,
    [conversaId, mensagem]
  );
};

exports.getMensagens = async (conversaId) => {
  const [rows] = await db.query(
    `SELECT * FROM mensagens 
     WHERE conversa_id = ?
     ORDER BY data_hora ASC`,
    [conversaId]
  );
  return rows;
};