const { error } = require('../utils/apiResponse');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(value, rules, fieldName) {
  const fieldErrors = [];

  if (rules.required && (value === undefined || value === null || value === '')) {
    fieldErrors.push(`${fieldName} is required`);
    return fieldErrors;
  }

  if (value === undefined || value === null || value === '') {
    return fieldErrors;
  }

  if (rules.type) {
    const expectedType = rules.type.toLowerCase();
    const actualType = typeof value;

    if (expectedType === 'array' && !Array.isArray(value)) {
      fieldErrors.push(`${fieldName} must be an array`);
    } else if (expectedType !== 'array' && actualType !== expectedType) {
      fieldErrors.push(`${fieldName} must be of type ${rules.type}`);
    }
  }

  if (typeof value === 'string') {
    if (rules.minLength !== undefined && value.length < rules.minLength) {
      fieldErrors.push(`${fieldName} must be at least ${rules.minLength} characters`);
    }
    if (rules.maxLength !== undefined && value.length > rules.maxLength) {
      fieldErrors.push(`${fieldName} must be at most ${rules.maxLength} characters`);
    }
  }

  if (rules.isEmail && typeof value === 'string' && !EMAIL_REGEX.test(value)) {
    fieldErrors.push(`${fieldName} must be a valid email`);
  }

  if (rules.isEnum && !rules.isEnum.includes(value)) {
    fieldErrors.push(`${fieldName} must be one of: ${rules.isEnum.join(', ')}`);
  }

  return fieldErrors;
}

function validateRequest(rules) {
  return (req, res, next) => {
    const errors = {};

    for (const [fieldName, fieldRules] of Object.entries(rules)) {
      const fieldErrors = validateField(req.body[fieldName], fieldRules, fieldName);
      if (fieldErrors.length > 0) {
        errors[fieldName] = fieldErrors;
      }
    }

    if (Object.keys(errors).length > 0) {
      return error(res, 'Validation failed', 400, errors);
    }

    return next();
  };
}

module.exports = validateRequest;
