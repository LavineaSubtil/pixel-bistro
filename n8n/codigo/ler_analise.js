// Nó "Ler análise" (Code): junta a avaliação com a análise do Gemini
const resposta = $input.first().json;
const texto = resposta.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '{}';
let analise;
try {
  analise = JSON.parse(texto);
} catch (e) {
  throw new Error('O Gemini não devolveu um JSON válido: ' + texto.slice(0, 300));
}
const avaliacao = $('Validar avaliação').first().json;
const precisaAlerta = Boolean(analise.urgente) || avaliacao.nota <= 2 || analise.sentimento === 'negativo';

return [{ json: { ...avaliacao, ...analise, precisaAlerta } }];
