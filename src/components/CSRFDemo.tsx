import React, { useState } from 'react';
import { Lock, Shield, ExternalLink, AlertTriangle, Copy, CheckCircle } from 'lucide-react';

const CSRFDemo: React.FC = () => {
  const [hasCSRFProtection, setHasCSRFProtection] = useState(false);
  const [sessionToken] = useState('abc123xyz789session');
  const [csrfToken] = useState('csrf_token_xyz789abc123');
  const [transferAmount, setTransferAmount] = useState('1000');
  const [targetAccount, setTargetAccount] = useState('attacker@evil.com');
  const [attackExecuted, setAttackExecuted] = useState(false);
  const [copiedMaliciousLink, setCopiedMaliciousLink] = useState(false);

  const maliciousURL = `https://bank.example.com/transfer?amount=${transferAmount}&to=${targetAccount}&session=${sessionToken}`;

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setAttackExecuted(true);
  };

  const copyMaliciousLink = () => {
    navigator.clipboard.writeText(maliciousURL);
    setCopiedMaliciousLink(true);
    setTimeout(() => setCopiedMaliciousLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="csrf-protection"
              checked={hasCSRFProtection}
              onChange={(e) => setHasCSRFProtection(e.target.checked)}
              className="rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500"
            />
            <label htmlFor="csrf-protection" className="text-sm font-medium">
              CSRF Protection
            </label>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            hasCSRFProtection 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {hasCSRFProtection ? 'PROTECTED' : 'VULNERABLE'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Legitimate Banking Site */}
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Lock className="w-4 h-4 text-green-400 mr-2" />
              Legitimate Banking Site
            </h4>
            
            {/* Simulated Banking Interface */}
            <div className="bg-white text-black rounded-lg p-4">
              <div className="border-b border-gray-200 pb-3 mb-4">
                <h5 className="font-semibold text-blue-600">SecureBank Online</h5>
                <p className="text-sm text-gray-600">Session: {sessionToken.substring(0, 12)}...</p>
              </div>

              <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transfer Amount ($)
                  </label>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Account
                  </label>
                  <input
                    type="email"
                    value={targetAccount}
                    onChange={(e) => setTargetAccount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {hasCSRFProtection && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CSRF Token
                    </label>
                    <input
                      type="text"
                      value={csrfToken}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 font-mono text-xs"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Transfer Money
                </button>
              </form>

              {attackExecuted && (
                <div className={`mt-4 p-3 rounded-lg border ${
                  hasCSRFProtection
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {hasCSRFProtection ? (
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Transfer blocked! CSRF token validation failed.
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Transfer completed! ${transferAmount} sent to {targetAccount}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Malicious Attack Site */}
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <ExternalLink className="w-4 h-4 text-red-400 mr-2" />
              Malicious Attack Site
            </h4>
            
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
              <h5 className="font-medium text-red-400 mb-3">Evil Site (evil-site.com)</h5>
              
              <div className="space-y-3">
                <div className="text-sm text-red-300">
                  This malicious site attempts to trick your browser into making unauthorized requests 
                  to the banking site while you're logged in.
                </div>

                <div className="bg-gray-800 p-3 rounded border">
                  <div className="text-xs text-gray-400 mb-2">Malicious URL being generated:</div>
                  <div className="font-mono text-xs text-red-400 break-all">
                    {maliciousURL}
                  </div>
                  <button
                    onClick={copyMaliciousLink}
                    className="mt-2 flex items-center space-x-1 text-xs text-red-300 hover:text-red-200 transition-colors"
                  >
                    {copiedMaliciousLink ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy malicious link</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-gray-800 p-3 rounded border">
                  <div className="text-xs text-gray-400 mb-2">Hidden malicious form:</div>
                  <code className="text-xs text-red-400 block">
                    {`<form action="https://bank.example.com/transfer" method="POST">
  <input type="hidden" name="amount" value="${transferAmount}">
  <input type="hidden" name="to" value="${targetAccount}">
  <input type="submit" value="Click for free prize!">
</form>`}
                  </code>
                </div>

                <button
                  onClick={() => setAttackExecuted(true)}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors text-sm"
                >
                  🎁 Click for Free Prize! (Malicious Button)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
          <h5 className="text-red-400 font-medium text-sm mb-3">Vulnerable Code:</h5>
          <code className="text-xs font-mono text-red-300 block bg-gray-800 p-3 rounded">
            {`// No CSRF protection
app.post('/transfer', (req, res) => {
  const { amount, to } = req.body;
  // Transfer money without validation
  transferMoney(req.user.id, to, amount);
  res.json({ success: true });
});`}
          </code>
        </div>

        <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
          <h5 className="text-green-400 font-medium text-sm mb-3">Secure Code:</h5>
          <code className="text-xs font-mono text-green-300 block bg-gray-800 p-3 rounded">
            {`// With CSRF protection
app.post('/transfer', validateCSRF, (req, res) => {
  const { amount, to, csrfToken } = req.body;
  if (!isValidCSRFToken(csrfToken, req.session)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  transferMoney(req.user.id, to, amount);
  res.json({ success: true });
});`}
          </code>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-400 mb-3">Understanding CSRF Attacks</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-blue-300 mb-2">How CSRF Works:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• User logs into legitimate site</li>
              <li>• Visits malicious site in same browser</li>
              <li>• Malicious site sends requests to legitimate site</li>
              <li>• Browser includes session cookies automatically</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Common Targets:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• Banking transfers</li>
              <li>• Password changes</li>
              <li>• Email address updates</li>
              <li>• Account deletions</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Prevention:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• CSRF tokens</li>
              <li>• SameSite cookies</li>
              <li>• Referer validation</li>
              <li>• Double-submit patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSRFDemo;