import createStatementData from './createStatementData';
import { Invoice, Plays, StatementData } from './types';

export function statement(invoice: Invoice, plays: Plays) {
  return renderPlainText(createStatementData(invoice, plays));
}

function renderPlainText(data: StatementData) {
  let result = `청구내역 (고객명: ${data.customer})\n`;
  for (let perf of data.performances) {
    result += `${perf.play.name} : ${usd(perf.amount)} (${perf.audience}석)\n`;
  }
  result += `총액: ${usd(data.totalAmount)}\n`;
  result += `적립 포인트: ${data.totalVolumeCredits}점\n`;
  return result;
}

export function htmlStatement(invoice: Invoice, plays: Plays) {
  return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data: StatementData) {
  let result = `<h1>청구내역 (고객명: ${data.customer})</h1>\n`;
  result += '<table>\n';
  result += '<tr><th>연극</th><th>좌석 수</th><th>금액</th></tr>';
  for (let perf of data.performances) {
    result += `<tr><td>${perf.play.name}</td><td>(${perf.audience}석)</td>`;
    result += `<td>${usd(perf.amount)}</td></tr>\n`;
  }
  result += `</table>\n`;
  result += `<p>총액: <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>적립 포인트: <em>${data.totalVolumeCredits}</em>점</p>\n`;
  return result;
}

function usd(aNumber: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}
