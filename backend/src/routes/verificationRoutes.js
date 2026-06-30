const express = require('express');
const verificationController = require('../controllers/verificationController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.post(
  '/verify/:credentialId',
  authenticate,
  authorize('EMPLOYER'),
  verificationController.directVerify
);

router.post(
  '/request/:credentialId',
  authenticate,
  authorize('EMPLOYER'),
  verificationController.requestVerification
);

router.get(
  '/requests/pending',
  authenticate,
  authorize('STUDENT'),
  verificationController.getMyPendingRequests
);

router.get(
  '/requests/mine',
  authenticate,
  authorize('STUDENT'),
  verificationController.getMyAllRequests
);

router.post(
  '/requests/:requestId/approve',
  authenticate,
  authorize('STUDENT'),
  verificationController.approveRequest
);

router.post(
  '/requests/:requestId/deny',
  authenticate,
  authorize('STUDENT'),
  verificationController.denyRequest
);

router.get(
  '/history',
  authenticate,
  authorize('EMPLOYER'),
  verificationController.getEmployerHistory
);

router.get(
  '/approved',
  authenticate,
  authorize('EMPLOYER'),
  verificationController.getMyApprovedCredentials
);

router.get('/requests/:requestId', authenticate, verificationController.getRequestById);

module.exports = router;
