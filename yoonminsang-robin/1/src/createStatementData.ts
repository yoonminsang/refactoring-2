import {
  Performance,
  Invoice,
  Plays,
  EnrichPerformance,
  StatementData,
  Play,
} from './types';

/*
변경점
핵심 : 조건부 로직을 다형서으로 바꾸기
1. 공연료 계산기 만들기(PerformanceCalculator 클래스)
2. 클래스의 생성자에 함수 선언 바꾸기 적용(aPlay)
3. 함수 옮기기를 통해 함수를 클래스로 이전(amount, volumeCredits)
공연료 계산기를 다형성 버전으로 만들기
4. 생성자를 팩터리 함수로 바꾸기
*/

class PerformanceCalculator {
  performance: Performance;
  play: Play;

  constructor(aPerformance: Performance, aPlay: Play) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount() {
    let result = 0;
    switch (this.play.type) {
      case 'tragedy': // 비극
        result = 40000;
        if (this.performance.audience > 30) {
          result += 1000 * (this.performance.audience - 30);
        }
        break;
      case 'comedy': // 희극
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20);
        }
        result += 300 * this.performance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르 : ${this.play.type}`);
    }
    return result;
  }

  get volumeCredits() {
    let result = 0;
    result += Math.max(this.performance.audience - 30, 0);
    if ('comedy' === this.play.type) {
      result += Math.floor(this.performance.audience / 5);
    }
    return result;
  }
}

function createPerformanceCalculator(aPerformance: Performance, aPlay: Play) {
  return new PerformanceCalculator(aPerformance, aPlay);
}

export default function createStatementData(
  invoice: Invoice,
  plays: Plays
): StatementData {
  const enrichPerformances = invoice.performances.map(enrichPerformance);
  return {
    customer: invoice.customer,
    performances: enrichPerformances,
    totalAmount: totalAmount(enrichPerformances),
    totalVolumeCredits: totalVolumeCredits(enrichPerformances),
  };

  function enrichPerformance(aPerformance: Performance): EnrichPerformance {
    const calculator = createPerformanceCalculator(
      aPerformance,
      playFor(aPerformance) // 함수선언바꾸기
    );
    return {
      ...aPerformance,
      play: calculator.play,
      amount: calculator.amount,
      volumeCredits: calculator.volumeCredits,
    };
  }

  function playFor(aPerformance: Performance) {
    return plays[aPerformance.playID];
  }

  function totalAmount(enrichPerformances: EnrichPerformance[]) {
    return enrichPerformances.reduce((acc, cur) => acc + cur.amount, 0);
  }

  function totalVolumeCredits(enrichPerformances: EnrichPerformance[]) {
    return enrichPerformances.reduce((acc, cur) => acc + cur.volumeCredits, 0);
  }
}
