import { Genre, Invoice, Plays } from './types';

// before를 보고 내가 간단하게 해본 리팩터리

/*
개선 사항

1. thisAmount를 계산하는 switch case문을 함수로 추출
2. perf라는 변수는 모호해서 performance라는 변수로 수정
3. volumeCredits(포인트 적립) 로직을 함수로 추출
4. format이라는 함수를 외부에 정의
*/

/*
책의 리팩터링과 다른 점

1. 함수에 값을 전달할때 나는 필요한 값만 전달했는데 책에서는 전체 객체를 전달했다.
2. 나는 switch case문 내부에서 return했는데 책에서는 break를 사용하고 마지막에 return 했다.
*/

const format = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
}).format;

function getThisAmount(audience: number, type: Genre) {
  let thisAmount = 0;
  switch (type) {
    case 'tragedy': // 비극
      thisAmount = 40000;
      if (audience > 30) {
        thisAmount += 1000 * (audience - 30);
      }
      return thisAmount;
    case 'comedy': // 희극
      thisAmount = 30000;
      if (audience > 20) {
        thisAmount += 10000 + 500 * (audience - 20);
      }
      thisAmount += 300 * audience;
      return thisAmount;
    default:
      throw new Error(`알 수 없는 장르 : ${type}`);
  }
}

function getAddVolumeCredits(audience: number, type: Genre) {
  // 포인트를 적립한다.
  let addVolumeCredits = 0;
  addVolumeCredits += Math.max(audience - 30, 0);

  // 희극 관객 5명마다 추가 포인트를 제공한다.
  if ('comedy' === type) {
    addVolumeCredits += Math.floor(audience / 5);
  }
  return addVolumeCredits;
}

export function statement(invoice: Invoice, plays: Plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구내역 (고객명: ${invoice.customer})\n`;

  for (const performance of invoice.performances) {
    const play = plays[performance.playID];

    const thisAmount = getThisAmount(performance.audience, play.type);

    volumeCredits += getAddVolumeCredits(performance.audience, play.type);

    result += `${play.name} : ${format(thisAmount / 100)} (${
      performance.audience
    }석)\n`;
    totalAmount += thisAmount;
  }

  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;

  return result;
}
