// Currency formatting utilities for Indian Rupees (₹)

// Format amount with thousand separators (e.g., ₹1,23,456.78)
export const formatCurrencyWithCommas = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

