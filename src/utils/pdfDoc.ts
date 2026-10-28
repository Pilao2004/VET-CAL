// Pequeno construtor de documentos A4 com a identidade do VET CALC PRO (cabeçalho, seções,
// parágrafos, listas, caixas de marcação, tabelas e rodapé), com quebra de página automática.
import { jsPDF } from 'jspdf';

const NAVY: [number, number, number] = [11, 29, 58];
const TEAL: [number, number, number] = [0, 168, 126];
const TEXT: [number, number, number] = [30, 41, 59];
const MUTED: [number, number, number] = [100, 116, 139];
const SOFT: [number, number, number] = [241, 245, 249];
const ALERT: [number, number, number] = [185, 28, 28];

const PAGE_W = 210;
const PAGE_H = 297;
const M = 16; // margem lateral
const CONTENT_W = PAGE_W - M * 2;
const BOTTOM = PAGE_H - 18;

export class PdfDoc {
  doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  y = 0;

  constructor(private title: string, private subtitle: string) {
    this.header();
  }

  private header() {
    const d = this.doc;
    d.setFillColor(...NAVY);
    d.rect(0, 0, PAGE_W, 24, 'F');
    d.setFillColor(0, 200, 150);
    d.roundedRect(M, 5, 14, 14, 2.5, 2.5, 'F');
    d.setFillColor(255, 255, 255);
    d.rect(M + 5.8, 7.8, 2.4, 8.4, 'F');
    d.rect(M + 2.8, 10.8, 8.4, 2.4, 'F');
    d.setTextColor(255, 255, 255);
    d.setFont('helvetica', 'bold');
    d.setFontSize(12);
    d.text('VET CALC PRO', M + 18, 11);
    d.setFont('helvetica', 'normal');
    d.setFontSize(8);
    d.text(this.title, M + 18, 16.5);
    d.setFontSize(7);
    d.text(this.subtitle, PAGE_W - M, 16.5, { align: 'right' });
    this.y = 32;
  }

  private ensure(height: number) {
    if (this.y + height > BOTTOM) {
      this.doc.addPage();
      this.header();
    }
  }

  h1(text: string) {
    this.ensure(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(17);
    this.doc.setTextColor(...NAVY);
    const lines = this.doc.splitTextToSize(text, CONTENT_W);
    this.doc.text(lines, M, this.y);
    this.y += lines.length * 7 + 2;
  }

  section(text: string) {
    this.ensure(16);
    this.y += 3;
    this.doc.setFillColor(...TEAL);
    this.doc.rect(M, this.y - 4.2, 1.6, 5.6, 'F');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.setTextColor(...NAVY);
    this.doc.text(text, M + 4, this.y);
    this.y += 7;
  }

  sub(text: string) {
    this.ensure(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9.5);
    this.doc.setTextColor(...TEXT);
    this.doc.text(text, M, this.y);
    this.y += 5;
  }

  p(text: string, opts: { muted?: boolean; size?: number } = {}) {
    const size = opts.size ?? 9;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(size);
    this.doc.setTextColor(...(opts.muted ? MUTED : TEXT));
    const lines: string[] = this.doc.splitTextToSize(text, CONTENT_W);
    const lh = size * 0.45;
    for (const line of lines) {
      this.ensure(lh + 1);
      this.doc.text(line, M, this.y);
      this.y += lh;
    }
    this.y += 2;
  }

  bullets(items: string[], opts: { indent?: number } = {}) {
    const x = M + (opts.indent ?? 0);
    this.doc.setFontSize(9);
    for (const item of items) {
      const lines: string[] = this.doc.splitTextToSize(item, CONTENT_W - (x - M) - 5);
      this.ensure(lines.length * 4.2 + 1);
      this.doc.setFillColor(...TEAL);
      this.doc.circle(x + 1.2, this.y - 1.1, 0.8, 'F');
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(...TEXT);
      this.doc.text(lines, x + 4.5, this.y);
      this.y += lines.length * 4.2 + 0.8;
    }
    this.y += 1.5;
  }

  checks(items: string[]) {
    this.doc.setFontSize(9);
    for (const item of items) {
      const lines: string[] = this.doc.splitTextToSize(item, CONTENT_W - 7);
      this.ensure(lines.length * 4.2 + 1.5);
      this.doc.setDrawColor(...MUTED);
      this.doc.setLineWidth(0.3);
      this.doc.rect(M, this.y - 3.1, 3.4, 3.4);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(...TEXT);
      this.doc.text(lines, M + 6, this.y);
      this.y += lines.length * 4.2 + 1.4;
    }
    this.y += 1.5;
  }

  /** Linhas para preencher à mão: [rótulo, largura relativa] por linha. */
  fields(rows: string[][]) {
    this.doc.setFontSize(8.5);
    for (const row of rows) {
      this.ensure(9);
      const w = CONTENT_W / row.length;
      row.forEach((label, i) => {
        const x = M + i * w;
        this.doc.setFont('helvetica', 'normal');
        this.doc.setTextColor(...MUTED);
        this.doc.text(label, x, this.y);
        this.doc.setDrawColor(203, 213, 225);
        this.doc.line(x, this.y + 4, x + w - 4, this.y + 4);
      });
      this.y += 9;
    }
    this.y += 1;
  }

  alert(text: string) {
    this.doc.setFontSize(8.8);
    const lines: string[] = this.doc.splitTextToSize(text, CONTENT_W - 8);
    const h = lines.length * 4.1 + 5;
    this.ensure(h + 2);
    this.doc.setFillColor(254, 242, 242);
    this.doc.setDrawColor(...ALERT);
    this.doc.roundedRect(M, this.y - 3.5, CONTENT_W, h, 2, 2, 'FD');
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...ALERT);
    this.doc.text(lines, M + 4, this.y + 0.8);
    this.y += h + 2;
  }

  note(text: string) {
    this.doc.setFontSize(8.5);
    const lines: string[] = this.doc.splitTextToSize(text, CONTENT_W - 8);
    const h = lines.length * 4 + 5;
    this.ensure(h + 2);
    this.doc.setFillColor(...SOFT);
    this.doc.roundedRect(M, this.y - 3.5, CONTENT_W, h, 2, 2, 'F');
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(...TEXT);
    this.doc.text(lines, M + 4, this.y + 0.8);
    this.y += h + 2;
  }

  table(head: string[], rows: string[][], widths: number[]) {
    const total = widths.reduce((a, b) => a + b, 0);
    const cols = widths.map((w) => (w / total) * CONTENT_W);
    const drawRow = (cells: string[], isHead: boolean, shade: boolean) => {
      this.doc.setFontSize(isHead ? 8 : 8.2);
      this.doc.setFont('helvetica', isHead ? 'bold' : 'normal');
      const wrapped = cells.map((c, i) => this.doc.splitTextToSize(c, cols[i] - 3) as string[]);
      const h = Math.max(...wrapped.map((w) => w.length)) * 3.7 + 3;
      if (this.y + h > BOTTOM) {
        this.doc.addPage();
        this.header();
        if (!isHead) drawRow(head, true, false);
        this.doc.setFontSize(isHead ? 8 : 8.2);
        this.doc.setFont('helvetica', isHead ? 'bold' : 'normal');
      }
      if (isHead) this.doc.setFillColor(...NAVY);
      else this.doc.setFillColor(...(shade ? SOFT : ([255, 255, 255] as [number, number, number])));
      this.doc.rect(M, this.y - 3.6, CONTENT_W, h, 'F');
      let x = M;
      wrapped.forEach((lines, i) => {
        this.doc.setTextColor(...(isHead ? ([255, 255, 255] as [number, number, number]) : TEXT));
        this.doc.text(lines, x + 1.5, this.y);
        x += cols[i];
      });
      this.y += h;
    };
    drawRow(head, true, false);
    rows.forEach((r, i) => drawRow(r, false, i % 2 === 1));
    this.y += 3;
  }

  space(mm = 3) {
    this.y += mm;
  }

  /** Rodapé com aviso e numeração em todas as páginas; devolve o PDF. */
  finish(footer: string): Blob {
    const pages = this.doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      this.doc.setPage(i);
      this.doc.setDrawColor(226, 232, 240);
      this.doc.line(M, PAGE_H - 13, PAGE_W - M, PAGE_H - 13);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7);
      this.doc.setTextColor(...MUTED);
      this.doc.text(this.doc.splitTextToSize(footer, CONTENT_W - 20), M, PAGE_H - 9);
      this.doc.text(`${i} / ${pages}`, PAGE_W - M, PAGE_H - 9, { align: 'right' });
    }
    return this.doc.output('blob');
  }
}
