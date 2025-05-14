const db = require('../database');

exports.criar = async (conversaId) => {
  const [result] = await db.query(
    'INSERT INTO etapas (conversa_id, etapa_1) VALUES (?, ?)',
    [conversaId, 'menu_principal']
  );
  return result.insertId;
};

exports.registrarEtapa = async (conversaId, novaEtapa) => {
  const [rows] = await db.query(
    'SELECT * FROM etapas WHERE conversa_id = ?',
    [conversaId]
  );

  if (rows.length === 0) {
    await exports.criar(conversaId);
    await db.query('UPDATE etapas SET etapa_2 = ? WHERE conversa_id = ?', [novaEtapa, conversaId]);
    return;
  }

  const etapaAtual = rows[0];
  if (!etapaAtual.etapa_2) {
    await db.query('UPDATE etapas SET etapa_2 = ? WHERE conversa_id = ?', [novaEtapa, conversaId]);
  } else if (!etapaAtual.etapa_3) {
    await db.query('UPDATE etapas SET etapa_3 = ? WHERE conversa_id = ?', [novaEtapa, conversaId]);
  } else if (!etapaAtual.etapa_4) {
    await db.query('UPDATE etapas SET etapa_4 = ? WHERE conversa_id = ?', [novaEtapa, conversaId]);
  } else if (!etapaAtual.etapa_5) {
    await db.query('UPDATE etapas SET etapa_5 = ? WHERE conversa_id = ?', [novaEtapa, conversaId]);
  } else {
    console.warn(`Todas as etapas já preenchidas para a conversa ${conversaId}`);
  }
};


exports.getEtapas = async (conversaId) => {
  const [rows] = await db.query(
    'SELECT * FROM etapas WHERE conversa_id = ?',
    [conversaId]
  );
  return rows[0] || null;
};

exports.resetar = async (conversaId) => {
  const [rows] = await db.query(
    `UPDATE etapas
     SET etapa_1 = NULL, etapa_2 = NULL, etapa_3 = NULL, etapa_4 = NULL
     WHERE conversa_id = ?`,
    [conversaId]
  );
  return rows;
};

exports.removerUltimaEtapa = async (conversaId) => {
  const [rows] = await db.query('SELECT * FROM etapas WHERE conversa_id = ?', [conversaId]);
  const etapas = rows[0];

  if (!etapas) return;

  const colunas = ['etapa_5', 'etapa_4', 'etapa_3', 'etapa_2', 'etapa_1'];

  for (let coluna of colunas) {
    if (etapas[coluna]) {
      await db.query(`UPDATE etapas SET ${coluna} = NULL WHERE conversa_id = ?`, [conversaId]);
      break;
    }
  }
};

