// Salva um arquivo gerado no app. Dentro do claude.ai usa o recurso de downloads do Claude
// (o visualizador confirma); no site, o download comum do navegador.

export type SaveOutcome = 'saved' | 'declined' | 'unavailable';

let downloadsPromise: Promise<any | null> | null = null;

function getDownloads(): Promise<any | null> {
  if (!downloadsPromise) {
    const claude = (window as any).claude;
    downloadsPromise = claude?.use ? Promise.resolve(claude.use('downloads')).catch(() => null) : Promise.resolve(null);
  }
  return downloadsPromise;
}

function browserDownload(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

export async function saveFile(filename: string, blob: Blob): Promise<SaveOutcome> {
  const downloads = await getDownloads();
  if (downloads) {
    try {
      await downloads.save({ filename, data: blob });
      return 'saved';
    } catch (e: any) {
      if (e?.code === 'declined') return 'declined';
      if (e?.code !== 'unavailable' && e?.code !== 'not_granted' && e?.code !== 'capability_disabled') return 'unavailable';
    }
  }
  browserDownload(filename, blob);
  return 'saved';
}
