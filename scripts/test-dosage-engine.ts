import { runAutomatedDosageTests } from '../src/utils/calculatorEngine';

console.log('====================================================');
console.log('VET CALC PRO — EXECUÇÃO DE TESTES DETERMINÍSTICOS');
console.log('====================================================\n');

const suite = runAutomatedDosageTests();

suite.results.forEach((test, idx) => {
  const icon = test.passed ? '✅ [PASSOU]' : '❌ [FALHOU]';
  console.log(`${icon} Teste ${idx + 1}: ${test.name}`);
  console.log(`   Categoria: ${test.category}`);
  console.log(`   Esperado: ${test.expectedVolumeMl} mL | Obtido: ${test.actualVolumeMl} mL`);
  console.log(`   Detalhes: ${test.details}\n`);
});

console.log('====================================================');
console.log(`RESULTADO FINAL: ${suite.passedCount} de ${suite.totalCount} testes passaram.`);
if (suite.allPassed) {
  console.log('TODOS OS TESTES DETERMINÍSTICOS FORAM APROVADOS COM SUCESSO!');
} else {
  console.error('ALERTA: HOUVE FALHA EM TESTES CRÍTICOS!');
  process.exit(1);
}
