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
    <form className="expense-form" onSubmit={handleSubmit}>
      <h3>Add New Expense</h3>
      
      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="What did you spend money on?"
          className={errors.description ? 'error' : ''}
          required
        />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount">Amount *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={errors.amount ? 'error' : ''}
            required
          />
          {errors.amount && <span className="form-error">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={errors.category ? 'error' : ''}
          >
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && <span className="form-error">{errors.category}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className={errors.date ? 'error' : ''}
          required
        />
        {errors.date && <span className="form-error">{errors.date}</span>}
      </div>

      <button type="submit" className="submit-button">
        Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;