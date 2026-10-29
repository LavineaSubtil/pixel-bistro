// Nó "Validar avaliação" (Code): confere os dados que chegaram do site
const corpo = $input.first().json.body || {};
const nota = Number(corpo.nota);
const comentario = String(corpo.comentario || '').trim().slice(0, 1000);

if (!(nota >= 1 && nota <= 5)) throw new Error('A nota precisa ser de 1 a 5.');
if (comentario.length < 3) throw new Error('Escreva um comentário.');

return [{
  json: {
    nome: String(corpo.nome || 'Aventureiro anônimo').trim().slice(0, 60),
    pedido: String(corpo.pedido || 'Não informado').trim().slice(0, 80),
    nota,
    comentario,
    recebidaEm: new Date().toISOString(),
  },
}];
