import { aartis } from '@/data/aartis';

export interface ShareableGroup {
  name: string;
  description?: string;
  aartiIds: string[];
}

/**
 * Generates a clean URL with query params to share a group
 */
export function generateGroupShareUrl(group: ShareableGroup, origin?: string): string {
  const base = origin || (typeof window !== 'undefined' ? window.location.origin : '');
  const params = new URLSearchParams();
  params.set('importGroup', '1');
  params.set('name', group.name.trim());
  if (group.description?.trim()) {
    params.set('desc', group.description.trim());
  }
  params.set('ids', group.aartiIds.join(','));

  return `${base}/groups?${params.toString()}`;
}

/**
 * Generates a formatted message ready to send via WhatsApp
 */
export function generateWhatsAppShareMessage(group: ShareableGroup, shareUrl: string): string {
  const validHymns = group.aartiIds
    .map(id => aartis.find(a => a.id === id))
    .filter(Boolean);

  const previewList = validHymns
    .slice(0, 8)
    .map((h, i) => `${i + 1}. ${h?.titleDevanagari}`)
    .join('\n');

  const moreCount = validHymns.length > 8 ? `\n...आणि आणखी ${validHymns.length - 8} रचना` : '';

  return (
    `🙏 *आरती व स्तोत्र संग्रह (Aarti App)* 🙏\n\n` +
    `मी तयार केलेला उपासना ग्रुप: *${group.name}*\n` +
    (group.description ? `_${group.description}_\n\n` : '\n') +
    `📜 *या ग्रुपमधील स्तोत्रे व आरत्या (${validHymns.length}):*\n` +
    `${previewList}${moreCount}\n\n` +
    `📲 *हा ग्रुप थेट तुमच्या ॲपमध्ये सेव्ह करून सलग पठण करण्यासाठी खालील लिंक उघडा:*\n` +
    `${shareUrl}`
  );
}

/**
 * Opens WhatsApp with prefilled message
 */
export function shareToWhatsApp(group: ShareableGroup): void {
  const shareUrl = generateGroupShareUrl(group);
  const message = generateWhatsAppShareMessage(group, shareUrl);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  
  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Extracts and validates shared group parameters from search params
 */
export function parseGroupShareParams(searchParams: URLSearchParams): ShareableGroup | null {
  const isImport = searchParams.get('importGroup') === '1';
  const name = searchParams.get('name');
  const idsParam = searchParams.get('ids');
  const desc = searchParams.get('desc') || '';

  if (!isImport || !name || !idsParam) {
    return null;
  }

  const rawIds = idsParam.split(',').map(s => s.trim()).filter(Boolean);
  const existingIds = new Set(aartis.map(a => a.id));
  const validIds = rawIds.filter(id => existingIds.has(id));

  if (validIds.length === 0) {
    return null;
  }

  return {
    name: name.trim(),
    description: desc.trim(),
    aartiIds: validIds,
  };
}
