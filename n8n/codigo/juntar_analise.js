// Nó "Ler classificação" (Code): transforma a resposta do Gemini em dados
const resposta = $input.first().json;
const texto = resposta.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '[]';
let classificacoes;
try {
  classificacoes = JSON.parse(texto);
} catch (e) {
  throw new Error('O Gemini não devolveu um JSON válido: ' + texto.slice(0, 300));
}

const base = $('Calcular métricas').first().json;
const contar = (lista) => lista.reduce((acc, k) => ((acc[k] = (acc[k] || 0) + 1), acc), {});

const sentimentos = contar(classificacoes.map((c) => c.sentimento));
const temas = Object.entries(contar(classificacoes.flatMap((c) => c.temas || [])))
  .sort((a, b) => b[1] - a[1])
  .map(([tema, qtd]) => ({ tema, qtd }));
const urgentes = classificacoes
  .filter((c) => c.urgente)
  .map((c) => ({ ...c, comentario: (base.avaliacoes.find((a) => a.id === c.id) || {}).comentario }));

return [{ json: { ...base, analise: { sentimentos, temas, urgentes, classificacoes } } }];
