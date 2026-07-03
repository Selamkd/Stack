import { FileDown } from 'lucide-react';
import { useState } from 'react';
import ToolShell from './ToolShell';

const FILLER =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

function escapePdfText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars) {
      lines.push(current.trim());
      current = word;
    } else {
      current += ' ' + word;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}

function buildPdf(pageCount: number, title: string): Blob {
  const objects: string[] = [];
  const fontObjNum = 3;
  const pageObjNums: number[] = [];
  let nextObj = 4;

  for (let i = 0; i < pageCount; i++) {
    pageObjNums.push(nextObj);
    nextObj += 2;
  }

  objects[1] = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  objects[2] = `2 0 obj\n<< /Type /Pages /Kids [${pageObjNums
    .map((n) => `${n} 0 R`)
    .join(' ')}] /Count ${pageCount} >>\nendobj\n`;
  objects[3] =
    '3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';

  for (let i = 0; i < pageCount; i++) {
    const pageNum = pageObjNums[i];
    const contentNum = pageNum + 1;

    const lines: string[] = [];
    lines.push(`${escapePdfText(title)} — page ${i + 1} of ${pageCount}`);
    lines.push('');
    for (let p = 0; p < 3; p++) {
      lines.push(...wrapText(FILLER, 90));
      lines.push('');
    }

    const textOps = lines
      .map((line, idx) =>
        idx === 0
          ? `(${escapePdfText(line)}) Tj`
          : `T* (${escapePdfText(line)}) Tj`
      )
      .join('\n');
    const stream = `BT\n/F1 11 Tf\n14 TL\n72 720 Td\n${textOps}\nET`;

    objects[pageNum] =
      `${pageNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] ` +
      `/Resources << /Font << /F1 ${fontObjNum} 0 R >> >> /Contents ${contentNum} 0 R >>\nendobj\n`;
    objects[contentNum] = `${contentNum} 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj\n`;
  }

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  const totalObjects = nextObj - 1;

  for (let i = 1; i <= totalObjects; i++) {
    offsets[i] = pdf.length;
    pdf += objects[i];
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${totalObjects + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= totalObjects; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}

export default function PdfGenerator() {
  const [pages, setPages] = useState(1);
  const [filename, setFilename] = useState('sample');

  function download() {
    const blob = buildPdf(Math.max(1, Math.min(50, pages)), filename || 'sample');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename || 'sample'}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolShell
      icon={FileDown}
      iconColor="text-red-300/70"
      title="Sample PDF"
      description="Real, valid PDFs for testing uploads and previews — generated in your browser"
    >
      <div className="panel max-w-md space-y-4 p-5">
        <div>
          <label className="mb-1.5 block text-xs text-zinc-400">
            File name
          </label>
          <input
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="input-base w-full px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-zinc-400">Pages</label>
          <input
            type="number"
            min={1}
            max={50}
            value={pages}
            onChange={(e) => setPages(parseInt(e.target.value) || 1)}
            className="input-base w-28 px-3 py-2 text-sm"
          />
        </div>
        <button
          onClick={download}
          className="flex items-center gap-2 rounded-lg bg-clay/15 px-4 py-2 text-sm font-medium text-clay transition-colors hover:bg-clay/25"
        >
          <FileDown size={14} />
          Download PDF
        </button>
      </div>
    </ToolShell>
  );
}
