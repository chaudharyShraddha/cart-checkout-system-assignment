import { formatCurrencyWithCommas } from './currency';

describe('Currency Utils', () => {
  describe('formatCurrencyWithCommas', () => {
    it('should format amount with ₹ symbol', () => {
      expect(formatCurrencyWithCommas(100)).toContain('₹');
    });

    it('should format whole numbers correctly', () => {
      expect(formatCurrencyWithCommas(1000)).toBe('₹1,000.00');
      expect(formatCurrencyWithCommas(10000)).toBe('₹10,000.00');
      expect(formatCurrencyWithCommas(100000)).toBe('₹1,00,000.00');
    });

    it('should format decimal numbers correctly', () => {
      expect(formatCurrencyWithCommas(99.99)).toBe('₹99.99');
      expect(formatCurrencyWithCommas(1234.56)).toBe('₹1,234.56');
    });

    it('should handle zero', () => {
      expect(formatCurrencyWithCommas(0)).toBe('₹0.00');
    });

    it('should format large amounts with Indian numbering system', () => {
      expect(formatCurrencyWithCommas(1234567.89)).toBe('₹12,34,567.89');
    });
  });
});

