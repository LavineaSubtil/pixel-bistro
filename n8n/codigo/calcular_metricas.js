// Nó "Calcular métricas" (Code, executa uma vez para todos os itens)
const pedidosResp = $('Buscar pedidos').first().json;
const avaliacoesResp = $('Buscar avaliações').first().json;
const pedidos = pedidosResp.pedidos || [];
const avaliacoes = avaliacoesResp.avaliacoes || [];

const brl = (v) => Number(v.toFixed(2));
const faturamento = pedidos.reduce((s, p) => s + p.total, 0);

const porPrato = {};
for (const p of pedidos) {
  for (const it of p.itens) {
    porPrato[it.item] = (porPrato[it.item] || 0) + it.qtd;
  }
}
const topPratos = Object.entries(porPrato)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3)
  .map(([prato, qtd]) => ({ prato, qtd }));

const atrasados = pedidos.filter((p) => p.tempoEntregaMin > p.tempoPrometidoMin + 5);
const tempoMedio = pedidos.length
  ? pedidos.reduce((s, p) => s + p.tempoEntregaMin, 0) / pedidos.length
  : 0;

const porBairro = {};
for (const p of pedidos) porBairro[p.bairro] = (porBairro[p.bairro] || 0) + 1;
const bairroTop = Object.entries(porBairro).sort((a, b) => b[1] - a[1])[0] || ['-', 0];

const notas = avaliacoes.map((a) => a.nota);
const notaMedia = notas.length ? notas.reduce((s, n) => s + n, 0) / notas.length : 0;
const distribuicaoNotas = [1, 2, 3, 4, 5].map((n) => ({ nota: n, qtd: notas.filter((x) => x === n).length }));

return [{
  json: {
    restaurante: pedidosResp.restaurante,
    periodo: pedidosResp.periodo,
    metricas: {
      totalPedidos: pedidos.length,
      faturamento: brl(faturamento),
      ticketMedio: brl(pedidos.length ? faturamento / pedidos.length : 0),
      topPratos,
      tempoMedioEntregaMin: Math.round(tempoMedio),
      pedidosAtrasados: atrasados.length,
      percentualAtrasos: pedidos.length ? Math.round((atrasados.length / pedidos.length) * 100) : 0,
      bairroComMaisPedidos: { bairro: bairroTop[0], pedidos: bairroTop[1] },
      totalAvaliacoes: avaliacoes.length,
      notaMedia: Number(notaMedia.toFixed(1)),
      distribuicaoNotas,
    },
    avaliacoes: avaliacoes.map((a) => ({ id: a.id, nota: a.nota, comentario: a.comentario })),
  },
}];
