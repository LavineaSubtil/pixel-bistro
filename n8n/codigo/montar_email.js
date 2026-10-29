// Nó "Montar e-mail" (Code): monta o HTML do resumo semanal no estilo pixel
const dados = $('Ler classificação').first().json;
const resposta = $input.first().json;
const texto = resposta.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '{}';
const relatorio = JSON.parse(texto);

const m = dados.metricas;
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const reais = (v) => 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const lista = (itens) => itens.map((i) => `<li style="margin:0 0 6px">${esc(i)}</li>`).join('');
const coracoes = (n) => '♥'.repeat(Math.round(n)) + '♡'.repeat(5 - Math.round(n));

const card = (titulo, valor) => `
  <td style="padding:6px;width:25%">
    <div style="border:3px solid #1a1033;background:#f3eaff;padding:10px;box-shadow:4px 4px 0 #7b2ff7">
      <div style="font-size:11px;color:#5b4a7a;text-transform:uppercase">${titulo}</div>
      <div style="font-size:20px;font-weight:bold;color:#1a1033">${valor}</div>
    </div>
  </td>`;

const urgentesHtml = dados.analise.urgentes.length
  ? dados.analise.urgentes.map((u) => `<li style="margin:0 0 6px"><b>${esc(u.id)}</b> (nota ${esc(u.nota ?? '')}) · ${esc(u.comentario)}</li>`).join('')
  : '<li>Nenhuma avaliação urgente nesta semana. GG! 🎉</li>';

const html = `
<div style="font-family:Arial,Helvetica,sans-serif;background:#1a1033;padding:24px">
 <div style="max-width:640px;margin:0 auto;background:#ffffff;border:4px solid #b388ff">
  <div style="background:#7b2ff7;color:#fff;padding:18px 20px">
   <div style="font-family:'Courier New',monospace;font-size:12px;letter-spacing:2px">▶ RELATÓRIO DO CHEF · ${esc(dados.periodo.inicio)} a ${esc(dados.periodo.fim)}</div>
   <div style="font-size:24px;font-weight:bold;margin-top:6px">${esc(relatorio.titulo)}</div>
  </div>
  <div style="padding:20px;color:#1a1033;font-size:14px;line-height:1.5">
   <p style="margin-top:0">${esc(relatorio.resumo)}</p>
   <table style="width:100%;border-collapse:collapse"><tr>
    ${card('Pedidos', m.totalPedidos)}${card('Faturamento', reais(m.faturamento))}${card('Ticket médio', reais(m.ticketMedio))}${card('Nota média', m.notaMedia + ' ' + coracoes(m.notaMedia))}
   </tr></table>
   <h3 style="font-family:'Courier New',monospace;color:#7b2ff7">★ CONQUISTAS DA SEMANA</h3>
   <ul style="padding-left:18px">${lista(relatorio.destaques || [])}</ul>
   <h3 style="font-family:'Courier New',monospace;color:#c2185b">⚠ CHEFÕES PARA DERROTAR</h3>
   <ul style="padding-left:18px">${lista(relatorio.problemas || [])}</ul>
   <h3 style="font-family:'Courier New',monospace;color:#7b2ff7">➜ PRÓXIMAS MISSÕES</h3>
   <ol style="padding-left:18px">${lista(relatorio.acoes || [])}</ol>
   <h3 style="font-family:'Courier New',monospace;color:#c2185b">🚨 AVALIAÇÕES URGENTES</h3>
   <ul style="padding-left:18px">${urgentesHtml}</ul>
   <p style="font-size:12px;color:#5b4a7a;border-top:2px dashed #b388ff;padding-top:10px;margin-bottom:0">
    Top pratos: ${m.topPratos.map((t) => `${esc(t.prato)} (${t.qtd})`).join(' · ')}<br>
    Entregas atrasadas: ${m.pedidosAtrasados} de ${m.totalPedidos} (${m.percentualAtrasos}%) · Tempo médio: ${m.tempoMedioEntregaMin} min<br>
    Gerado automaticamente pelo n8n + Gemini.
   </p>
  </div>
 </div>
</div>`;

return [{ json: { assunto: `🎮 ${dados.restaurante}: ${relatorio.titulo}`, html, relatorio, metricas: m } }];
