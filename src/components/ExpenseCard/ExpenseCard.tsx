'use client'
/*
TYPESCRIPT FEATURE INVENTORY:
Interfaces Found:
1. ExpenseCardProps - defines component contract
2. [Add your findings]

Type Annotations Found:
1. amount: number - ensures currency values are numeric
2. [Add your findings]

Autocomplete Helped:
1. [Your example]

Error I Fixed:
1. [Your example and how you fixed it]
*/


// src/components/ExpenseCard/ExpenseCard.tsx
import React from 'react';

// TypeScript interface defines the structure of props this component expects
// This acts like a contract - any parent component must provide these exact properties
export type ExpenseCategory = 'Food' | 'Transportation' | 'Entertainment' | 'Shopping' | 'Other';
// type SortOption = 'date' | 'amount' | 'category';
// type FilterOption = 'All' | ExpenseCategory;

export interface ExpenseCardProps {
  id: number;              // Unique identifier for each expense
  description: string;     // What the expense was for (e.g., "Lunch at Joe's Pizza")
  amount: number;         // Cost in dollars (will be formatted to show currency)
  category: ExpenseCategory;       // Type of expense (e.g., "Food", "Transportation")
  date: string;          // When the expense occurred (formatted as string)

  // Optional props (can be provided or not)
  onDelete?: (id: number) => void;    // The ? makes it optional
  highlighted?: boolean;              // Component might be highlighted
  showCategory?: boolean;             // Category display might be hidden
}

/**
 * Displays a single expense item with formatted currency and professional styling
 * @param {Object} props - Component props
 * @param {number} props.id - Unique identifier for the expense entry
 * @param {string} props.description - Human-readable description of the expense
 * @param {number} props.amount - Expense amount in dollars (will be formatted as currency)
 * @param {string} props.category - Expense category for organization and filtering
 * @param {string} props.date - Date when expense occurred (ISO string format)
 */
const ExpenseCard: React.FC<ExpenseCardProps> = ({ 
  id, 
  description, 
  amount, 
  category, 
  date, 
  // Optional props with default values
  highlighted = false,      // Default to false if not provided
  showCategory = true,      // Default to true if not provided
  onDelete                  // Might be undefined
}) => {
  // Format currency for professional display
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);

  // Format date for user-friendly display
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Delete button
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id)
    }
  };



  return (
    <article className={`bg-white rounded-lg p-4 mb-3 shadow-md transition-all duration-200 border-l-4 
      hover:shadow-lg relative cursor-pointer
    ${highlighted ? 'border-l-orange-500 bg-orange-50' : 'border-blue-500'}`}>
      <div className="flex justify-between items-center mb-2">
        {showCategory && (
          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold uppercase">{category}</span>
        )}
        <time className="text-gray-500 text-sm" dateTime={date}>
          {formattedDate}
        </time>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-base font-medium text-gray-900">{description}</h3>
        <p className="text-lg font-bold text-green-600">{formattedAmount}</p>
        {onDelete && (<button 
          className="absolute top-2 right-2
          bg-red-500 hover:bg-red-600
          text-white border-0 rounded-full
          w-6 h-6 cursor-pointer text-base
          flex items-center justify-center
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-red-400" 
          onClick={handleDelete}
          aria-label="Delete expense"
          >
          x
        </button>)
        }
      </div>
    </article>
  );
};

export default ExpenseCard;