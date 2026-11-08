// End values retain the precision of the approved copy's R$ 500,000 table.
// Annual checkpoints: approved copy (IOX 90), B3 2025 annual index returns.
export const historicalSeries = {
  iox: { label:'IOX 90', color:'#a0dbb4', factors:[1, 1.1871, 1.1871 * 1.2021, 814824 / 500000] },
  ibov: { label:'Ibovespa', color:'#f4f5f3', factors:[1, .8964, .8964 * 1.3395, 695098 / 500000] },
  ifix: { label:'IFIX', color:'#cfb47e', factors:[1, .9411, .9411 * 1.2115, 566722 / 500000] },
};

export function historicalValues(amount) {
  return Object.fromEntries(Object.entries(historicalSeries).map(([key, series]) => [key, series.factors.map(factor => amount * factor)]));
}
