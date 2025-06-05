import { describe, it, expect } from 'vitest';
import { getRandomNumber, dateFormater, parseCSV } from '../components/util';

describe('getRandomNumber', () => {
  it('returns values within the provided range', () => {
    for (let i = 0; i < 100; i++) {
      const num = getRandomNumber(1, 10);
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(10);
    }
  });
});

describe('dateFormater', () => {
  it('formats ISO strings to YYYY-MM-DD HH:mm', () => {
    const iso = '2024-01-02T03:04:00.000Z';
    expect(dateFormater(iso)).toBe('2024-01-02 03:04');
  });
});

describe('parseCSV', () => {
  it('parses CSV into expected object array', () => {
    const csv = `"id","form_name","form_definition"\n1,"Test Form",{\"a\":1}`;
    const result = parseCSV(csv);
    expect(result).toEqual([
      { id: 1, form_name: 'Test Form', form_definition: { a: 1 } }
    ]);
  });
});
