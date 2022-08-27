import { Province, sampleProvinceData } from '.';

describe('province', () => {
  it('shorfall', () => {
    const asia = new Province(sampleProvinceData()); // 픽스처 설정
    expect(asia.shortfall).toBe(5);
  });
  it('profit', () => {
    const asia = new Province(sampleProvinceData());
    expect(asia.profit).toBe(230);
  });
});
