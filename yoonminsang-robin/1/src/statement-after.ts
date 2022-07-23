import {
  Performance,
  Invoice,
  Plays,
  EnrichPerformance,
  StatementData,
} from './types';

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
- 타입스크립트에서도 부정관사를 붙여야할까?
- 중첩함수가 좋은 방법일까?
- 지역변수를 줄이기위해 함수를 사용하는데 이게 항상 옳은 방법일까?
- 함수에 객체 전체를 전달하는게 좋을까 필요한 데이터만 전달하는게 좋을까?
*/

// 1.6
/*
변경점
data, ui 분리. + 중간 구조체 생성
*/

/*
의문점
- 타입스크립트에서는 객체에 유동적으로 값을 넣을 수 없다. 
  그래서 책에서처럼 객체의 값을 수정하면서 객체를 함수에 전달할 수 없다. 
  nullish로 타입을 재정의하고 함수에 전달할 수 있지만 이때 타입이 일정하지 않다. 
  ex) a함수에서는 id가 없고 b함수에서는 id 존재 그래서 객체전체를 함수에 전달하지 않고 필요한 데이터만 뽑아서 전달했다.

- 여기서 생기는 문제점 2가지
  1. 필요한 데이터만 뽑아서 전달하기 힘든경우도 있다.
    - 필요한 데이터가 바뀐다면 유지보수 어려움
  2. 필요한 데이터가 단순한 값이 아니라면(함수로 생성, 객체의 key로 접근, 등등) 지역변수 혹은 함수를 이용해 접근해야 함.
    - 지역변수로 접근하면 지역변수를 생성한다는 문제가 있고 함수를 이용해 접근한다면 가독성이나 유지보수 측면에서 단점이 있다.
*/

export function statement(invoice: Invoice, plays: Plays) {
  const performances = invoice.performances.map(enrichPerformance);
  const statementData: StatementData = {
    customer: invoice.customer,
    performances,
    totalAmount: totalAmount(performances),
    totalVolumeCredits: totalVolumeCredits(performances),
  };
  return renderPlainText(statementData);

  function enrichPerformance(aPerformance: Performance) {
    const result: EnrichPerformance = {
      ...aPerformance,
      play: playFor(aPerformance),
      amount: amountFor(aPerformance),
      volumeCredits: volumeCreditsFor(aPerformance),
    };
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

  function volumeCreditsFor(aPerformance: Performance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ('comedy' === playFor(aPerformance).type) {
      result += Math.floor(aPerformance.audience / 5);
    }
    return result;
  }

  function totalAmount(performances: EnrichPerformance[]) {
    return performances.reduce((acc, cur) => acc + cur.amount, 0);
  }

  function totalVolumeCredits(performances: EnrichPerformance[]) {
    return performances.reduce((acc, cur) => acc + cur.volumeCredits, 0);
  }
}

function renderPlainText(data: StatementData) {
  let result = `청구내역 (고객명: ${data.customer})\n`;
  for (let perf of data.performances) {
    result += `${perf.play.name} : ${usd(perf.amount / 100)} (${
      perf.audience
    }석)\n`;
  }
  result += `총액: ${usd(data.totalAmount / 100)}\n`;
  result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
  return result;
}

function usd(aNumber: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber);
}
