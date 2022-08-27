import { Province, sampleProvinceData } from '.';

describe('province', () => {
  let asia: Province;
  beforeEach(() => {
    asia = new Province(sampleProvinceData());
  });
  it('shorfall', () => {
    expect(asia.shortfall).toBe(5);
  });
  it('profit', () => {
    expect(asia.profit).toBe(230);
  });
  it('change production', () => {
    asia.producers[0].production = 20;
    expect(asia.shortfall).toBe(-6);
    expect(asia.profit).toBe(292);
  });
});
