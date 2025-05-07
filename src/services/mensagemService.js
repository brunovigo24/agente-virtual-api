const db = require('../database');

// Registra mensagem recebida (entrada)
exports.registrarEntrada = async (conversaId, mensagem) => {
  await db.query(
    `INSERT INTO mensagens (conversa_id, mensagem, tipo, data_hora)
     VALUES (?, ?, 'entrada', NOW())`,
    [conversaId, mensagem]
  );
};

// Registra mensagem enviada (saída)
exports.registrarSaida = async (conversaId, mensagem) => {
  await db.query(
    `INSERT INTO mensagens (conversa_id, mensagem, tipo, data_hora)
     VALUES (?, ?, 'saida', NOW())`,
    [conversaId, mensagem]
  );
};
