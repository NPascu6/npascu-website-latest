import { describe, it, expect } from 'vitest';
import {
  getRandomNumber,
  dateFormater,
  parseCSV,
  formatFieldToUpperCaseAndBreakCamelCase,
  getCellWidth,
} from '../components/util';
import type { ReusableColumn } from '../models/table';

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

  it('returns N/A when date is empty', () => {
    expect(dateFormater('')).toBe('N/A');
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

  describe('formatFieldToUpperCaseAndBreakCamelCase', () => {
    it('formats camelCase into spaced Title Case', () => {
      expect(formatFieldToUpperCaseAndBreakCamelCase('camelCaseField'))
        .toBe('Camel Case Field');
    });
  });

  describe('getCellWidth', () => {
    const columns: ReusableColumn[] = [
      { header: 'ID', key: 'id' },
      { header: 'Name', key: 'name' },
    ];

    it('returns 7% for id column', () => {
      expect(getCellWidth(columns, columns[0])).toBe('7%');
    });

    it('calculates width based on columns length', () => {
      expect(getCellWidth(columns, columns[1])).toBe(`${100 / columns.length + 13.5}%`);
    });
  });
