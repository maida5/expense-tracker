// src/components/ExpenseForm/ExpenseForm.tsx
import React, { useState } from 'react';
import './ExpenseForm.css';
import type { ExpenseCategory } from '../ExpenseCard/ExpenseCard';

interface FormErrors {
  description?: string;
  amount?: string;
  category?: string;
  date?: string;
}

// Form data interface
interface ExpenseFormData {
  description: string;
  amount: string;
  category: ExpenseCategory;
  date: string;
}

/**
 * Form component for creating new expense entries with validation
 * @param {Object} props - Component props
 * @param {function} props.onSubmit - Callback function when form is submitted, receives expense data
 */
interface ExpenseFormProps {
  onSubmit: (expenseData: {
    description: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
  }) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit }) => {
  // Form state using controlled components pattern
  const [formData, setFormData] = useState<ExpenseFormData>({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0] // Today's date as default
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // This function validates an expense form and returns whether it's valid
// along with any validation error messages.
const validateExpenseForm = (
  data: ExpenseFormData
): { isValid: boolean; errors: FormErrors } => {
  
  // Create an empty object to hold any validation error messages.
  const validationErrors: FormErrors = {};

  // 1. Check if the description is missing or just whitespace.
  if (!data.description.trim()) {
    validationErrors.description = 'Description is required';
  }

  // 2. Convert the "amount" string into a number.
  const amount = parseFloat(data.amount);

  // 3. Check if the amount is invalid (NaN) or less than/equal to zero.
  if (isNaN(amount) || amount <= 0) {
    validationErrors.amount = 'Amount must be a positive number';
  }

  // 4. Check if a category was not selected.
  if (!data.category) {
    validationErrors.category = 'Category is required';
  }

  // 5. Check if a date was not provided.
  if (!data.date) {
    validationErrors.date = 'Date is required';
  }

  // 6. Return:
  //    - isValid: true if no errors were added, false otherwise
  //    - errors: the object containing any validation messages
  return {
    isValid: Object.keys(validationErrors).length === 0,
    errors: validationErrors
  };
};

  /**
   * Handles input changes for all form fields using computed property names
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - Change event from form inputs
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  };

  /**
   * Handles form submission with validation and data processing
   * @param {React.FormEvent<HTMLFormElement>} e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    const validation = validateExpenseForm(formData);

    if (!validation.isValid) {
      // ...store the error messages in React state.
      // Each field can then display its own error message in the UI.
      // Example: errors.amount = "Amount must be a positive number"
      setErrors(validation.errors);
      return; // stop submission
    }
    setErrors({});

    // Basic validation
    if (!formData.description.trim() || !formData.amount || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      alert('Amount must be greater than 0');
      return;
    }

    // Submit processed data
    onSubmit({
      description: formData.description.trim(),
      amount: amount,
      category: formData.category,
      date: formData.date
    });

    // Reset form after successful submission
    setFormData({
      description: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <form className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-200" onSubmit={handleSubmit}>
      <h3 className="text-xl font-bold text-gray-900 mb-5">Add New Expense</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5" 
        htmlFor="description">Description *</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="What did you spend money on?"
          className={`w-full px-3 py-2.5 border border-gray-300 rounded-md
            text-sm bg-white text-gray-700 transition-colors duration-200
            hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
            placeholder-gray-400

            ${errors.description ? 'error' : ''}`}
          required
        />
        {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5"  htmlFor="amount">Amount *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`w-full px-3 py-2.5 border border-gray-300 rounded-md
            text-sm bg-white text-gray-700 transition-colors duration-200
            hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
            placeholder-gray-400 
            ${errors.amount ? 'error' : ''}`}
            required
          />
          {errors.amount && <span className="text-red-500 text-xs mt-1">{errors.amount}</span>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5"  htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={`w-full px-3 py-2.5 border border-gray-300 rounded-md
            text-sm bg-white text-gray-700 transition-colors duration-200
            hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
            placeholder-gray-400 cursor-pointer
            ${errors.category ? 'error' : ''}`}
          >
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && <span className="text-red-500 text-xs mt-1">{errors.category}</span>}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1.5"  htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className={`w-full px-3 py-2.5 border border-gray-300 rounded-md
            text-sm bg-white text-gray-700 transition-colors duration-200
            hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500
            placeholder-gray-400
            ${errors.date ? 'error' : ''}`}
          required
        />
        {errors.date && <span className="text-red-500 text-xs mt-1">{errors.date}</span>}
      </div>

      <button type="submit" className="px-4 py-2.5 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 border inline-flex items-center justify-center min-w-20
      bg-blue-500 text-white border-blye-500
      hover:bg-blue-600 hover:border-blue-600 hover:-translate-y-0.5
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      disabled:hover:transform-none">
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;