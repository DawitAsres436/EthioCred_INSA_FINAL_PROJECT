const institutionRepository = require('../repositories/institutionRepository');
const auditService = require('./auditService');
const {
  generateRSAKeyPair,
  encryptPrivateKey,
  generateKeyFingerprint,
} = require('../crypto/keyManager');

async function registerInstitution(data, adminId) {
  const institution = await institutionRepository.createInstitution(data);

  const { publicKey, privateKey } = generateRSAKeyPair();
  const encryptedJson = encryptPrivateKey(privateKey);
  const fingerprint = generateKeyFingerprint(publicKey);

  await institutionRepository.saveKeyPair(
    institution.id,
    publicKey,
    encryptedJson,
    fingerprint
  );

  await auditService.log({
    userId: adminId,
    action: auditService.INSTITUTION_REGISTERED,
    entityType: 'institution',
    entityId: institution.id,
    ipAddress: null,
    details: { name: institution.name },
  });

  return {
    ...institution,
    public_key: publicKey,
    fingerprint,
  };
}

async function approveInstitution(institutionId, adminId) {
  const institution = await institutionRepository.updateStatus(
    institutionId,
    'ACTIVE',
    adminId
  );

  if (!institution) {
    return null;
  }

  await auditService.log({
    userId: adminId,
    action: auditService.INSTITUTION_APPROVED,
    entityType: 'institution',
    entityId: institution.id,
    ipAddress: null,
    details: { name: institution.name },
  });

  return institution;
}

async function suspendInstitution(institutionId, adminId) {
  return institutionRepository.updateStatus(institutionId, 'SUSPENDED', adminId);
}

async function getTrustRegistry() {
  return institutionRepository.getActiveInstitutionsWithPublicKeys();
}

async function getInstitutionById(id) {
  return institutionRepository.findById(id);
}

async function getAllInstitutions() {
  return institutionRepository.getAllInstitutions();
}

module.exports = {
  registerInstitution,
  approveInstitution,
  suspendInstitution,
  getTrustRegistry,
  getInstitutionById,
  getAllInstitutions,
};
