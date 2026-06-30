const verificationService = require('../services/verificationService');
const verificationRepository = require('../repositories/verificationRepository');
const { success, error } = require('../utils/apiResponse');

async function directVerify(req, res) {
  const result = await verificationService.completeVerification(
    req.params.credentialId,
    req.user.id
  );
  return success(res, result, result.valid ? 'Credential verified' : 'Verification failed');
}

async function requestVerification(req, res) {
  const request = await verificationService.requestVerification(
    req.params.credentialId,
    req.user.id
  );

  if (!request) {
    return error(res, 'Credential not found', 404);
  }

  return success(res, request, 'Verification request created', 201);
}

async function getMyPendingRequests(req, res) {
  const requests = await verificationService.getPendingRequests(req.user.id);
  return success(res, requests, 'Pending requests retrieved successfully');
}

async function getMyAllRequests(req, res) {
  const requests = await verificationRepository.findByStudentId(req.user.id);
  return success(res, requests, 'Requests retrieved successfully');
}

async function approveRequest(req, res) {
  try {
    const request = await verificationService.approveRequest(
      req.params.requestId,
      req.user.id
    );

    if (!request) {
      return error(res, 'Request not found', 404);
    }

    return success(res, request, 'Verification request approved');
  } catch (err) {
    if (err.message === 'Request is not pending') {
      return error(res, 'Request is not pending', 400);
    }
    throw err;
  }
}

async function denyRequest(req, res) {
  try {
    const request = await verificationService.denyRequest(
      req.params.requestId,
      req.user.id
    );

    if (!request) {
      return error(res, 'Request not found', 404);
    }

    return success(res, request, 'Verification request denied');
  } catch (err) {
    if (err.message === 'Request is not pending') {
      return error(res, 'Request is not pending', 400);
    }
    throw err;
  }
}

async function getEmployerHistory(req, res) {
  const history = await verificationService.getEmployerHistory(req.user.id);
  return success(res, history, 'Verification history retrieved successfully');
}

async function getMyApprovedCredentials(req, res) {
  const credentials = await verificationRepository.findApprovedCredentialsForEmployer(req.user.id);
  return success(res, credentials, 'Approved credentials retrieved successfully');
}

async function getRequestById(req, res) {
  const request = await verificationRepository.findById(req.params.requestId);

  if (!request) {
    return error(res, 'Request not found', 404);
  }

  return success(res, request, 'Request retrieved successfully');
}

module.exports = {
  directVerify,
  requestVerification,
  getMyPendingRequests,
  getMyAllRequests,
  approveRequest,
  denyRequest,
  getEmployerHistory,
  getMyApprovedCredentials,
  getRequestById,
};
