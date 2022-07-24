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
5. 조건부 로직을 다형성으로 바꾸기(amount, volumeCredits)
*/

/*
의문점
amount에 abstract을 적용하려고 했는데 getter라서 할 수가 없다.
즉 지금의 경우에는 템플릿 메소드 패턴을 언어적으로 지원하지 않는다.
아래와 같은 방법으로 템플릿 메소드 패턴을 직접 구현해야할까?
```
  const ERR = (v) => {
    throw v;
  };
  const OVERRIDE = (parent, method) => (typeof parent.prototype[method] === 'function' ? method : ERR());
  const TMPL = (self, method, ...arg) => ('_' + method in self ? self['_' + method](...arg) : ERR());

  const Subdata = class {
    clear() {
      TMPL(this, 'clear')();
    }
  };
  const Stage = class extends SubData {
    [HOOK(Subdata, 'clear')]() {
      this.stage = 0;
      this.isNext();
    }
  };
```
*/

abstract class PerformanceCalculator {
  performance: Performance;
  play: Play;

  constructor(aPerformance: Performance, aPlay: Play) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount(): number {
    throw new Error('서브클래스에서 처리하도록 설계되었습니다.');
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}
class ComedyCalculator extends PerformanceCalculator {
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

function createPerformanceCalculator(aPerformance: Performance, aPlay: Play) {
  switch (aPlay.type) {
    case 'tragedy':
      return new TragedyCalculator(aPerformance, aPlay);
    case 'comedy':
      return new ComedyCalculator(aPerformance, aPlay);
    default:
      throw new Error(`알 수 없는 장르: ${aPlay.type}`);
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
