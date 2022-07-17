import { statement as statementBefore } from './statement-before';
import { statement as statementAfter } from './statement-after';
import invoicesData from './json/invoices.json';
import playsData from './json/plays.json';

const beforeRefactor = statementBefore(
  JSON.parse(JSON.stringify(invoicesData))[0],
  JSON.parse(JSON.stringify(playsData))
);

describe('statement', () => {
  it('', () => {
    expect(beforeRefactor).toBe(
      statementAfter(
        JSON.parse(JSON.stringify(invoicesData))[0],
        JSON.parse(JSON.stringify(playsData))
      )
    );
  });
});
