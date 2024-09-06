export const handleApiError = (
  error: any,
  showError: (message: string | null) => void
) => {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        showError(error.response.data || 'Invalid request.');
        break;
      case 401:
        showError('Unauthorized. Please log in.');
        break;
      case 404:
        showError('Resource not found.');
        break;
      case 500:
        showError('Server error. Please try again later.');
        break;
      default:
        showError('An unexpected error occurred.');
        break;
    }
  } else {
    showError('Network error. Please try again later.');
  }
};
