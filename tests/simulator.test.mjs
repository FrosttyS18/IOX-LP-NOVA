import test from 'node:test';
import assert from 'node:assert/strict';
import { historicalValues } from '../historical-series.js';

test('R$ 50 mil reproduzem os resultados e a queda de 2024 da LP original', () => {
  const values = historicalValues(50000);
  assert.equal(Math.round(values.iox[3]), 81482);
  assert.equal(Math.round(values.ibov[3]), 69510);
  assert.equal(Math.round(values.ifix[3]), 56672);
  assert.equal(Math.round(values.ibov[1]), 44820);
  assert.equal(Math.round(values.iox[1]), 59355);
  assert.equal(Math.round(values.iox[2]), 71351);
});

test('R$ 500 mil preservam a precisão dos três resultados de origem', () => {
  const values = historicalValues(500000);
  assert.equal(values.iox[3], 814824);
  assert.equal(values.ibov[3], 695098);
  assert.equal(values.ifix[3], 566722);
});

test('o valor personalizado escala os resultados sem alterar os pontos iniciais', () => {
  const values = historicalValues(75000);
  assert.equal(values.iox[0], 75000);
  assert.equal(values.ibov[0], 75000);
  assert.equal(values.ifix[0], 75000);
  assert.equal(Math.round(values.iox[3]), 122224);
  assert.equal(Math.round(values.ibov[3]), 104265);
  assert.equal(Math.round(values.ifix[3]), 85008);
});
