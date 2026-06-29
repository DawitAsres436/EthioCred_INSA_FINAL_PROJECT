const { Readable } = require('stream');
const csv = require('csv-parser');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseCsvBuffer(fileBuffer) {
  return new Promise((resolve, reject) => {
    const rows = [];
    Readable.from(fileBuffer)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

function validateCsvRows(rows) {
  const valid = [];
  const invalid = [];

  rows.forEach((row, index) => {
    const errors = [];

    if (!row.full_name || typeof row.full_name !== 'string' || !row.full_name.trim()) {
      errors.push('full_name is required and must be a non-empty string');
    }

    if (!row.fayda_id || typeof row.fayda_id !== 'string' || !row.fayda_id.trim()) {
      errors.push('fayda_id is required and must be a non-empty string');
    }

    if (!row.email || typeof row.email !== 'string' || !EMAIL_REGEX.test(row.email.trim())) {
      errors.push('email is required and must be a valid email format');
    }

    if (!row.degree_name || typeof row.degree_name !== 'string' || !row.degree_name.trim()) {
      errors.push('degree_name is required and must be a non-empty string');
    }

    const graduationYear = parseInt(row.graduation_year, 10);
    if (
      row.graduation_year === undefined ||
      row.graduation_year === '' ||
      Number.isNaN(graduationYear) ||
      graduationYear < 1900 ||
      graduationYear > 2100 ||
      String(graduationYear).length !== 4
    ) {
      errors.push('graduation_year is required and must be a 4-digit number between 1900 and 2100');
    }

    const gpa = parseFloat(row.gpa);
    if (
      row.gpa === undefined ||
      row.gpa === '' ||
      Number.isNaN(gpa) ||
      gpa < 0 ||
      gpa > 4
    ) {
      errors.push('gpa is required and must be a decimal number between 0.00 and 4.00');
    }

    if (errors.length > 0) {
      invalid.push({ row: { ...row, _rowIndex: index + 1 }, errors });
    } else {
      valid.push({
        full_name: row.full_name.trim(),
        fayda_id: row.fayda_id.trim(),
        email: row.email.trim(),
        degree_name: row.degree_name.trim(),
        major: row.major ? row.major.trim() : null,
        graduation_year: graduationYear,
        gpa,
      });
    }
  });

  return { valid, invalid };
}

module.exports = { parseCsvBuffer, validateCsvRows };
