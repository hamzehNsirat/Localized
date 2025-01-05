// utils/validators.js

// Helper to capitalize the first letter
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const validateFirstName = (value) => {
    const newValue = value.trim();
    if (!newValue) return "First name is required";
    if (newValue.length < 2) return "First name must be at least 2 characters long";
    if (/\d/.test(newValue)) return "First name cannot contain numbers";
    if (/\s/.test(newValue)) return "First name cannot contain spaces"; 
    return null;
};

export const validateLastName = (value) => {
    const newValue = value.trim();
    if (!newValue) return "Last name is required";
    if (newValue.length < 2) return "Last name must be at least 2 characters long";
    if (/\d/.test(newValue)) return "Last name cannot contain numbers";
    if (/\s{2,}/.test(newValue))
        return "Last name cannot have multiple consecutive spaces";
    return null;
};

export const validateUsername = (value) => {
    const newValue = value.trim();
    const usernameRegex = /^[^\s]+$/;
    if (!newValue) return "Username is required";
    if (newValue.length < 6) return "Username must be at least 6 characters long";
    if (!usernameRegex.test(newValue)) return "Username cannot contain spaces";
    return null;
};

export const validateEmail = (value) => {
    const newValue = value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newValue) return "Email is required";
    if (!emailRegex.test(newValue)) return "Please enter a valid email address";
    return null;
};

export const validatePhone = (value) => {
    const phoneRegex = /^(0?(77|78|79))\d{7}$/;
    if (!value) return "Phone is required";
    if (!phoneRegex.test(value)) {
        return "Phone must start with 077, 078, or 079 and be 9 or 10 digits long";
    }
    return null;
};

export const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(value))
        return "Password must contain at least one uppercase letter";
    if (!/[0-9]/.test(value)) return "Password must contain at least one number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
        return "Password must contain at least one special character";
    return null;
};

export const validateConfirmPassword = (value, formData) => {
    if (!value) return "Confirm password is required";
    if (formData.password !== value) return "Passwords do not match";
    return null;
};

export const validateCompanyName = (value) => {
    const newValue = value.trim();
    if (!newValue) return "Company name is required";
    if (newValue.length < 2)
        return "Company name must be at least 2 characters long";
    return null; 
};

export const validateCompanyAddressCity = (value) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) return "City is required";
  if (trimmedValue.length < 2) return "City must be at least 2 characters long";
  if (/\d/.test(trimmedValue)) return "City cannot contain numbers";

  return null;
};

export const validateCompanyStreet = (value) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) return "Street is required";
  if (trimmedValue.length < 2) return "Street must be at least 2 characters long";

  return null;
};


export const validateCompanyBuildingNo = (value) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) return "Building number is required";
  if (trimmedValue.length < 1) return "Building number must be at least 1 character long";

  return null;
};

export const validateCompanyDescription = (value) => {
  const trimmedValue = value.trim();

  if (trimmedValue.length > 0 && trimmedValue.length < 10) {
    return "Description must be at least 10 characters long if provided";
  }
  if (trimmedValue.length > 500) {
    return "Description cannot exceed 500 characters";
  }

  return null;
};



// Generic field validator
export const validateField = (field, value, formData = {}) => {
    switch (field) {
        case "firstName":
            return validateFirstName(value);
        case "lastName":
            return validateLastName(value);
        case "username":
            return validateUsername(value);
        case "email":
            return validateEmail(value);
        case "phone":
            return validatePhone(value);
        case "password":
            return validatePassword(value);
        case "confirmPassword":
            return validateConfirmPassword(value, formData);
        case "companyName":
            return validateCompanyName(value);
        case "companyEmail":
            return validateEmail(value);
        case "companyPhoneNumber":
            return validatePhone(value);
        case "companyAddress":
            return validateCompanyAddressCity(value);
        case "companyStreet":
            return validateCompanyStreet(value);
        case "companyBuildingNo":
            return validateCompanyBuildingNo(value);
        case "description":
            return validateCompanyDescription(value);
        default:
            return null;
    }
};
