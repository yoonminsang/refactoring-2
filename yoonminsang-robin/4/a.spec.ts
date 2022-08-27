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
  it('zero demand', () => {
    asia.demand = 0;
    expect(asia.shortfall).toBe(-25);
    expect(asia.profit).toBe(0);
  });
});

describe('no producers', () => {
  let noProducers: Province;
  beforeEach(() => {
    const data = {
      name: 'No producers',
      producers: [],
      demand: 30,
      price: 20,
    };
    noProducers = new Province(data);
  });
  it('shortfall', () => {
    expect(noProducers.shortfall).toBe(30);
  });
  it('profit', () => {
    expect(noProducers.profit).toBe(0);
  });
});
