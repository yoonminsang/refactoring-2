import { Province, sampleProvinceData } from '.';

describe('province', () => {
  it('shorfall', () => {
    const asai = new Province(sampleProvinceData()); // 픽스처 설정
    expect(asai.shortfall).toBe(5);
  });
});
