import {
  Performance,
  Invoice,
  Plays,
  EnrichPerformance,
  StatementData,
  Play,
} from './types';

class PerformanceCalculator {
  performance: Performance;
  play: Play;

  constructor(aPerformance: Performance, aPlay: Play) {
    this.performance = aPerformance;
    this.play = aPlay;
  }
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
    const calculator = new PerformanceCalculator(
      aPerformance,
      playFor(aPerformance) // 함수선언바꾸기
    );
    return {
      ...aPerformance,
      play: calculator.play,
      amount: amountFor(aPerformance),
      volumeCredits: volumeCreditsFor(aPerformance),
    };
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

  function totalAmount(enrichPerformances: EnrichPerformance[]) {
    return enrichPerformances.reduce((acc, cur) => acc + cur.amount, 0);
  }

  function totalVolumeCredits(enrichPerformances: EnrichPerformance[]) {
    return enrichPerformances.reduce((acc, cur) => acc + cur.volumeCredits, 0);
  }
}
