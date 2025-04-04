export function isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }
    // Basic email format check using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
    
  }

  
  // You can add other validation functions here (e.g., isValidPhoneNumber)