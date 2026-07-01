import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '@ethiocred/utils';

export default function RequestVerification() {
  const [credentialId, setCredentialId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentialId.trim()) return;
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await post(`/verification/request/${credentialId.trim()}`);
      setSuccess(true);
      setTimeout(() => navigate('/request-status'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-2 text-2xl font-semibold text-gray-900">Request Verification</h2>
      <p className="mb-6 text-sm text-gray-500">
        Submit a verification request to the credential holder.
      </p>

      <div className="max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="mb-6 text-sm leading-relaxed text-gray-600">
          Submit a verification request to the credential holder. The student must approve before you can verify.
        </p>

        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            Request sent — awaiting student approval. Redirecting...
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="credentialId" className="mb-1 block text-sm font-medium text-gray-700">
              Credential ID
            </label>
            <input
              id="credentialId"
              type="text"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              placeholder="Enter credential UUID"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || success}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
