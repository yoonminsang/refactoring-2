import { statement as statementBefore } from './statement-before';
import { statement as statementAfter } from './statement-after';
import invoicesData from './json/invoices.json';
import playsData from './json/plays.json';
import { Invoice, Plays } from './types';
import { statement } from './statement';

describe('statement', () => {
  it('리팩터링 하기 전과 후 함수 비교', () => {
    expect(
      statementBefore(invoicesData[0] as Invoice, playsData as Plays)
    ).toBe(statement(invoicesData[0] as Invoice, playsData as Plays));
  });
});
