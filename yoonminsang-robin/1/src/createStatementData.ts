import {
  Performance,
  Invoice,
  Plays,
  EnrichPerformance,
  StatementData,
} from './types';

export default function createStatementData(invoice: Invoice, plays: Plays) {
  const performances = invoice.performances.map(enrichPerformance);
  const result: StatementData = {
    customer: invoice.customer,
    performances,
    totalAmount: totalAmount(performances),
    totalVolumeCredits: totalVolumeCredits(performances),
  };
  return result;

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
