import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { get, post, formatDate, formatDateTime } from '@ethiocred/utils';
import Loader from '../../components/Loader/Loader.jsx';
import { saveVerificationResult } from '../../utils/verificationCache.js';

const FAILURE_MESSAGES = {
  CONSENT_REQUIRED:
    'You do not have approved access to verify this credential. Please request access first.',
  CREDENTIAL_NOT_FOUND: 'Credential does not exist in the system',
  UNTRUSTED_INSTITUTION: 'Issuing institution is not in the Trust Registry',
  NO_PUBLIC_KEY: 'Issuing institution is not in the Trust Registry',
  INTEGRITY_VIOLATION: 'Credential data has been tampered with',
  INVALID_SIGNATURE: 'Digital signature verification failed',
  CREDENTIAL_REVOKED: 'This credential has been revoked by the institution',
};

export default function VerifyCredential() {
  const [approvedCredentials, setApprovedCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [verifyingId, setVerifyingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    get('/verification/approved')
      .then(({ data }) => setApprovedCredentials(data.data || []))
      .catch((err) =>
        setError(err.response?.data?.message || err.message || 'Failed to load approved credentials')
      )
      .finally(() => setLoading(false));
  }, []);

  const handleVerify = async (credential) => {
    setVerifyingId(credential.credential_id);
    setError('');
    setResult(null);

    try {
      const { data } = await post(`/verification/verify/${credential.credential_id}`);
      const verificationResult = data.data;
      setResult(verificationResult);
      saveVerificationResult(verificationResult, {
        id: credential.credential_id,
        serial_number: credential.serial_number,
        holder_name: credential.holder_name,
        institution_name: credential.institution_name,
        degree_name: credential.degree_name,
        major: credential.major,
        graduation_year: credential.graduation_year,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setVerifyingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Verify Credential</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {approvedCredentials.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm text-center">
          <p className="text-gray-600 mb-4">
            You don&apos;t have access to verify any credentials yet. Go to Request Verification to
            ask a student for access.
          </p>
          <Link
            to="/request"
            className="inline-flex px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Request Verification
          </Link>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {approvedCredentials.map((credential) => (
            <div
              key={credential.request_id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <p>
                  <span className="text-gray-500">Student:</span>{' '}
                  <strong>{credential.holder_name}</strong>
                </p>
                <p>
                  <span className="text-gray-500">Degree:</span>{' '}
                  <strong>{credential.degree_name}</strong>
                </p>
                <p>
                  <span className="text-gray-500">Institution:</span>{' '}
                  <strong>{credential.institution_name}</strong>
                </p>
                <p>
                  <span className="text-gray-500">Graduation Year:</span>{' '}
                  <strong>{credential.graduation_year}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleVerify(credential)}
                disabled={verifyingId === credential.credential_id}
                className="shrink-0 flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {verifyingId === credential.credential_id ? <Loader /> : null}
                {verifyingId === credential.credential_id ? 'Verifying...' : 'Verify This Credential'}
              </button>
            </div>
          ))}
        </div>
      )}

      {result && (
        <div
          className={`rounded-xl p-8 shadow-sm border-2 ${
            result.valid
              ? 'bg-green-50 border-green-300'
              : 'bg-red-50 border-red-300'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            {result.valid ? (
              <CheckCircle className="text-green-600" size={48} />
            ) : (
              <XCircle className="text-red-600" size={48} />
            )}
            <div>
              <h3
                className={`text-2xl font-bold ${
                  result.valid ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {result.valid ? 'CREDENTIAL VERIFIED' : 'VERIFICATION FAILED'}
              </h3>
              {!result.valid && result.step != null && (
                <p className="text-sm text-red-600 mt-1">Failed at step {result.step}</p>
              )}
            </div>
          </div>

          {result.valid && result.credential ? (
            <div className="bg-white/70 rounded-lg p-4 space-y-2 text-sm">
              <p><span className="text-gray-500">Holder:</span> <strong>{result.credential.holder_name}</strong></p>
              <p><span className="text-gray-500">Degree:</span> <strong>{result.credential.degree_name}</strong></p>
              <p><span className="text-gray-500">Major:</span> <strong>{result.credential.major || '—'}</strong></p>
              <p><span className="text-gray-500">Institution:</span> <strong>{result.credential.institution_name}</strong></p>
              <p><span className="text-gray-500">Year:</span> <strong>{result.credential.graduation_year}</strong></p>
              <p><span className="text-gray-500">GPA:</span> <strong>{result.credential.gpa}</strong></p>
              <p><span className="text-gray-500">Issue Date:</span> <strong>{formatDate(result.credential.issue_date)}</strong></p>
              <p className="text-xs text-gray-400 pt-2">Verified at {formatDateTime(new Date().toISOString())}</p>
            </div>
          ) : (
            <p className="text-red-800 font-medium text-lg">
              {FAILURE_MESSAGES[result.reason] || result.message || result.reason}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
