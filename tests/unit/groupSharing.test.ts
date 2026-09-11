import { describe, it, expect } from 'vitest';
import {
  generateGroupShareUrl,
  generateWhatsAppShareMessage,
  parseGroupShareParams,
} from '@/lib/groupSharing';

describe('WhatsApp Group Sharing & Import Utility', () => {
  const sampleGroup = {
    name: 'श्रावण सोमवार शिव उपासना',
    description: 'महादेव स्तोत्रे व आरती',
    aartiIds: [
      'shiva-panchakshara-stotra',
      'lingashtakam',
      'shiva-lavthavti',
    ],
  };

  it('generates a valid portable share URL with query parameters', () => {
    const url = generateGroupShareUrl(sampleGroup, 'https://aartiapp.com');
    expect(url).toContain('https://aartiapp.com/groups?');
    expect(url).toContain('importGroup=1');
    expect(url).toContain('name=%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A4%BE%E0%A4%B5%E0%A4%A3');
    expect(url).toContain('ids=shiva-panchakshara-stotra%2Clingashtakam%2Cshiva-lavthavti');
  });

  it('generates a respectful WhatsApp message containing hymn titles and share link', () => {
    const shareUrl = generateGroupShareUrl(sampleGroup, 'https://aartiapp.com');
    const message = generateWhatsAppShareMessage(sampleGroup, shareUrl);

    expect(message).toContain('श्रावण सोमवार शिव उपासना');
    expect(message).toContain('महादेव स्तोत्रे व आरती');
    expect(message).toContain('श्री शिव पञ्चाक्षर स्तोत्रम्');
    expect(message).toContain('श्री लिङ्गाष्टकम्');
    expect(message).toContain('लवथवती विक्राळा');
    expect(message).toContain(shareUrl);
  });

  it('correctly parses valid group share parameters from URLSearchParams', () => {
    const params = new URLSearchParams({
      importGroup: '1',
      name: 'माझी दैनंदिन पूजा',
      desc: 'सकाळची पूजा',
      ids: 'ganesha-sukhkarta,shiva-lavthavti,devi-durge-durgat',
    });

    const result = parseGroupShareParams(params);
    expect(result).not.toBeNull();
    expect(result?.name).toBe('माझी दैनंदिन पूजा');
    expect(result?.description).toBe('सकाळची पूजा');
    expect(result?.aartiIds).toEqual([
      'ganesha-sukhkarta',
      'shiva-lavthavti',
      'devi-durge-durgat',
    ]);
  });

  it('filters out non-existent or invalid hymn IDs when importing', () => {
    const params = new URLSearchParams({
      importGroup: '1',
      name: 'मिश्र ग्रुप',
      desc: 'काही चुकीचे आयडी',
      ids: 'ganesha-sukhkarta,invalid-fake-hymn-id,shiva-lavthavti',
    });

    const result = parseGroupShareParams(params);
    expect(result).not.toBeNull();
    expect(result?.aartiIds).toEqual(['ganesha-sukhkarta', 'shiva-lavthavti']);
    expect(result?.aartiIds).not.toContain('invalid-fake-hymn-id');
  });

  it('returns null if importGroup flag is missing or no valid IDs found', () => {
    const missingFlag = new URLSearchParams({
      name: 'टेस्ट',
      ids: 'ganesha-sukhkarta',
    });
    expect(parseGroupShareParams(missingFlag)).toBeNull();

    const allInvalidIds = new URLSearchParams({
      importGroup: '1',
      name: 'टेस्ट',
      ids: 'non-existent-1,non-existent-2',
    });
    expect(parseGroupShareParams(allInvalidIds)).toBeNull();
  });
});
