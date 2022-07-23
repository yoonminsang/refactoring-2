import { Performance, Invoice, Plays } from './types';

// 1.1~1.5
/*
변경점
1. amountFor이라는 함수 추출
2. thisAmount라는 변수를 result로 변경
3. amountFor의 perf라는 인수를 aPerformance로 변경(매개변수 역할이 뚜렷하지 않을 때는 부정 관사(a/an)를 붙인다.
4. play 임시 변수 제거하기(임의 변수를 질의 함수로 바꾸기)
5. 리팩터링을 통해서 성능이 나빠졌다. 만약 심각하게 느려지더라도 성능을 개선하기 수월하다.
6. thisAmount 임시 변수 제거하기
7. 임시 변수에 함수를 대입한 형태인 format을 변경(만만해서)
8. volumeCredits 리팩터링(반복문 쪼개기, 문장 슬라이스하기(변수 초기화 위치 밑으로 이동), 함수 추출하기, 변수 인라인하기)
9. totalAmount 리팩터링(8과 동일)
*/

/*
의문점
타입스크립트에서도 부정관사를 붙여야할까?
중첩함수가 좋은 방법일까?
지역변수를 줄이기위해 함수를 사용하는데 이게 항상 옳은 방법일까?
함수에 객체 전체를 전달하는게 좋을까 필요한 데이터만 전달하는게 좋을까?
*/

// 1.6~1.10
/*
변경점

*/

export function statement(invoice: Invoice, plays: Plays) {
  const statementData: any = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  return renderPlainText(statementData, plays);

  function enrichPerformance(aPerformance: Performance) {
    const result: any = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    return result;
  }

  function playFor(aPerformance: Performance) {
    return plays[aPerformance.playID];
  }

  function amountFor(aPerformance: Performance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
      case 'tragedy': // 비극
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case 'comedy': // 희극
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르 : ${playFor(aPerformance).type}`);
    }
    return result;
  }

  function renderPlainText(data: any, plays: Plays) {
    let result = `청구내역 (고객명: ${data.customer})\n`;
    for (let perf of data.performances) {
      result += `${perf.play.name} : ${usd(perf.amount / 100)} (${
        perf.audience
      }석)\n`;
    }
    result += `총액: ${usd(totalAmount() / 100)}\n`;
    result += `적립 포인트: ${totalVolumeCredits()}점\n`;
    return result;

    function usd(aNumber: number) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(aNumber);
    }

    function totalAmount() {
      let result = 0;
      for (let perf of data.performances) {
        result += amountFor(perf);
      }
      return result;
    }

    function volumeCreditsFor(aPerformance: Performance) {
      let result = 0;
      result += Math.max(aPerformance.audience - 30, 0);
      if ('comedy' === playFor(aPerformance).type) {
        result += Math.floor(aPerformance.audience / 5);
      }
      return result;
    }

    function totalVolumeCredits() {
      let result = 0;
      for (let perf of data.performances) {
        result += volumeCreditsFor(perf);
      }
      return result;
    }
  }
}
