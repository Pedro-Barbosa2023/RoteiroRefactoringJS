var Util = require("./util.js");

module.exports = function gerarFaturaStr(fatura, servicoCalculo) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${servicoCalculo.repo.getPeca(apre).nome}: ${Util.formatarMoeda(servicoCalculo.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${Util.formatarMoeda(servicoCalculo.calcularTotalFatura(fatura.apresentacoes))}\n`;
  faturaStr += `Créditos acumulados: ${servicoCalculo.calcularTotalCreditos(fatura.apresentacoes)} \n`;
  return faturaStr;
};
