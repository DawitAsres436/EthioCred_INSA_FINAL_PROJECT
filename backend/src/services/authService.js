const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');
const { signToken } = require('../config/jwt');

function formatUserResponse(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    full_name: user.full_name,
    institution_id: user.institution_id,
  };
}

async function login(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    return null;
  }

  const passwordValid = await bcrypt.compare(password, user.password_hash);
  if (!passwordValid) {
    return null;
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    institution_id: user.institution_id,
  });

  return { token, user: formatUserResponse(user) };
}

async function loginWithFayda(fayda_id) {
  const user = await userRepository.findByFaydaId(fayda_id);
  if (!user) {
    return null;
  }

  if (user.role !== 'STUDENT') {
    return null;
  }

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    institution_id: user.institution_id,
  });

  return { token, user: formatUserResponse(user) };
}

async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

async function validatePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = {
  login,
  loginWithFayda,
  hashPassword,
  validatePassword,
};
