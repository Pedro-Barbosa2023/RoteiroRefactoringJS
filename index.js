const { readFileSync } = require('fs');

// Função extraída
function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR",
    { style: "currency", currency: "BRL",
      minimumFractionDigits: 2 }).format(valor/100);
}

// Função extraída
function getPeca(pecas, apresentacao) {
  return pecas[apresentacao.id];
}

// Função extraída
function calcularCredito(pecas, apre) {  
  let creditos = 0;
  creditos += Math.max(apre.audiencia - 30, 0);
  if (getPeca(pecas, apre).tipo === "comedia") 
    creditos += Math.floor(apre.audiencia / 5);
  return creditos;   
}

// Função extraída
function calcularTotalCreditos(pecas, apresentacoes) {
  let creditos = 0;
  for (let apre of apresentacoes) {
    creditos += calcularCredito(pecas, apre);
  }
  return creditos;
}

// Função extraída
function calcularTotalApresentacao(pecas, apre) {
  let total = 0;
  const peca = getPeca(pecas, apre);

  switch (peca.tipo) {
    case "tragedia":
      total = 40000;
      if (apre.audiencia > 30) {
        total += 1000 * (apre.audiencia - 30);
      }
      break;
    case "comedia":
      total = 30000;
      if (apre.audiencia > 20) {
        total += 10000 + 500 * (apre.audiencia - 20);
      }
      total += 300 * apre.audiencia;
      break;
    default:
      throw new Error(`Peça desconhecida: ${peca.tipo}`);
  }
  return total;
}

// Função extraída
function calcularTotalFatura(pecas, apresentacoes) {
  let totalFatura = 0;
  for (let apre of apresentacoes) {
    totalFatura += calcularTotalApresentacao(pecas, apre);
  }
  return totalFatura;
}

// Função para gerar fatura em formato de string
function gerarFaturaStr(fatura, pecas) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
  return faturaStr;
}

// Função para gerar fatura em formato HTML
function gerarFaturaHTML(fatura, pecas) {
  let faturaHTML = `<html>\n<p> Fatura ${fatura.cliente} </p>\n<ul>\n`;

  for (let apre of fatura.apresentacoes) {
    const peca = getPeca(pecas, apre);
    const total = calcularTotalApresentacao(pecas, apre);
    faturaHTML += `<li>  ${peca.nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos) </li>\n`;
  }

  const totalFatura = calcularTotalFatura(pecas, fatura.apresentacoes);
  const totalCreditos = calcularTotalCreditos(pecas, fatura.apresentacoes);

  faturaHTML += `</ul>\n<p> Valor total: ${formatarMoeda(totalFatura)} </p>\n<p> Créditos acumulados: ${totalCreditos} </p>\n</html>`;
  return faturaHTML;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

// Gerar e exibir fatura em formato de string
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log("Fatura em String:\n", faturaStr);

// Gerar e exibir fatura em formato HTML
const faturaHTML = gerarFaturaHTML(faturas, pecas);
console.log("\nFatura em HTML:\n", faturaHTML);
