
// Define and export constants
export const TOAST_TYPE_ERROR = 'error';
export const TOAST_TYPE_SUCCESS = 'success';
export const TOAST_TYPE_LOADING = 'loading';
export const TOAST_TYPE_INFO = 'info';

export const DELETE_BUDGET_CONFIRMATION_MESSAGE = `
  <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5; margin: 0;">
    Are you sure you want to delete this budget?
  </p>
  <p style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; margin: 10px 0 0;">
    <span style="color: red; font-weight: bold;">
      Deleting this budget will remove all associated goals, including both recurring and normal expenses.
    </span>
  </p>
`