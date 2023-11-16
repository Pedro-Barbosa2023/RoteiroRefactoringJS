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

// Função para gerar fatura em formato de string
function gerarFaturaStr(fatura, pecas, servicoCalculo) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${getPeca(pecas, apre).nome}: ${formatarMoeda(servicoCalculo.calcularTotalApresentacao(pecas, apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(servicoCalculo.calcularTotalFatura(pecas, fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${servicoCalculo.calcularTotalCreditos(pecas, fatura.apresentacoes)} \n`;
  return faturaStr;
}

// Classe para cálculos de fatura
class ServicoCalculoFatura {

  calcularCredito(pecas, apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (getPeca(pecas, apre).tipo === "comedia") 
      creditos += Math.floor(apre.audiencia / 5);
    return creditos;   
  }

  calcularTotalCreditos(pecas, apresentacoes) {
    let creditos = 0;
    for (let apre of apresentacoes) {
      creditos += this.calcularCredito(pecas, apre);
    }
    return creditos;
  }

  calcularTotalApresentacao(pecas, apre) {
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

  calcularTotalFatura(pecas, apresentacoes) {
    let totalFatura = 0;
    for (let apre of apresentacoes) {
      totalFatura += this.calcularTotalApresentacao(pecas, apre);
    }
    return totalFatura;
  }
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));

// Criar objeto da nova classe
const calc = new ServicoCalculoFatura();

// Gerar e exibir fatura em formato de string
const faturaStr = gerarFaturaStr(faturas, pecas, calc);
console.log("Fatura em String:\n", faturaStr);

// Comente o corpo da função gerarFaturaHTML e sua chamada para ter apenas uma saída
/*
// Função para gerar fatura em formato HTML
function gerarFaturaHTML(fatura, pecas) {
  let faturaHTML = `<html>\n<p> Fatura ${fatura.cliente} </p>\n<ul>\n`;

  for (let apre of fatura.apresentacoes) {
    const peca = getPeca(pecas, apre);
    const total = calc.calcularTotalApresentacao(pecas, apre);
    faturaHTML += `<li>  ${peca.nome}: ${formatarMoeda(total)} (${apre.audiencia} assentos) </li>\n`;
  }

  const totalFatura = calc.calcularTotalFatura(pecas, fatura.apresentacoes);
  const totalCreditos = calc.calcularTotalCreditos(pecas, fatura.apresentacoes);

  faturaHTML += `</ul>\n<p> Valor total: ${formatarMoeda(totalFatura)} </p>\n<p> Créditos acumulados: ${totalCreditos} </p>\n</html>`;
  return faturaHTML;
}

// Gerar e exibir fatura em formato HTML
const faturaHTML = gerarFaturaHTML(faturas, pecas);
console.log("\nFatura em HTML:\n", faturaHTML);
*/
