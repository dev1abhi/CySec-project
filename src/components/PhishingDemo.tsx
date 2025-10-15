import React, { useState } from 'react';
import { Mail, ExternalLink, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

const PhishingDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'email' | 'fake-site' | 'analysis'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [enteredCredentials, setEnteredCredentials] = useState({ email: '', password: '' });

  const phishingEmail = {
    from: 'security@amazom.com',
    subject: 'Urgent: Verify Your Account Now',
    body: `Dear Customer,

We've detected suspicious activity on your account. For your security, please verify your account immediately by clicking the link below:

VERIFY ACCOUNT NOW: http://amazom-security.com/verify

If you don't verify within 24 hours, your account will be suspended.

Thank you,
Amazon Security Team`
  };

  const handleCredentialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('analysis');
  };

  return (
    <div className="space-y-6">
      {/* Step Navigation */}
      <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg">
        {[
          { id: 'email', label: 'Phishing Email', icon: Mail },
          { id: 'fake-site', label: 'Fake Website', icon: ExternalLink },
          { id: 'analysis', label: 'Analysis', icon: AlertCircle }
        ].map((step) => {
          const Icon = step.icon;
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                currentStep === step.id
                  ? 'bg-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Email Step */}
      {currentStep === 'email' && (
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Mail className="w-5 h-5 text-blue-400 mr-2" />
              Suspicious Email
            </h3>
            
            <div className="bg-white text-black rounded-lg p-4 font-mono text-sm">
              <div className="border-b border-gray-200 pb-3 mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div><strong>From:</strong> {phishingEmail.from}</div>
                    <div><strong>Subject:</strong> {phishingEmail.subject}</div>
                  </div>
                  <div className="text-red-600 text-xs flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    SUSPICIOUS
                  </div>
                </div>
              </div>
              <div className="whitespace-pre-line">
                {phishingEmail.body}
              </div>
            </div>

            <div className="mt-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
              <h4 className="font-semibold text-red-400 mb-2">Red Flags to Notice:</h4>
              <ul className="text-sm text-red-300 space-y-1">
                <li>• Misspelled domain: "amazom.com" instead of "amazon.com"</li>
                <li>• Urgent language creating false sense of emergency</li>
                <li>• Generic greeting ("Dear Customer")</li>
                <li>• Suspicious link destination</li>
                <li>• Threat of account suspension</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Fake Site Step */}
      {currentStep === 'fake-site' && (
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <ExternalLink className="w-5 h-5 text-orange-400 mr-2" />
              Fake Login Page
            </h3>
            
            {/* Simulated Browser */}
            <div className="bg-white rounded-lg overflow-hidden">
              {/* Fake Address Bar */}
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-4 bg-white px-3 py-1 rounded border text-sm text-gray-600 flex-1">
                    <span className="text-red-600"></span> http://amazom-security.com/verify
                  </div>
                </div>
              </div>

              {/* Fake Amazon Page */}
              <div className="p-8 text-black">
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-orange-600">amazom</h2>
                    <p className="text-gray-600 mt-2">Account Verification Required</p>
                  </div>

                  <form onSubmit={handleCredentialSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={enteredCredentials.email}
                        onChange={(e) => setEnteredCredentials({...enteredCredentials, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={enteredCredentials.password}
                          onChange={(e) => setEnteredCredentials({...enteredCredentials, password: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition-colors"
                    >
                      Verify Account
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-orange-900/30 border border-orange-700/50 rounded-lg">
              <h4 className="font-semibold text-orange-400 mb-2">Warning Signs:</h4>
              <ul className="text-sm text-orange-300 space-y-1">
                <li>• URL uses HTTP instead of HTTPS (🔓 icon)</li>
                <li>• Domain misspelling: "amazom" vs "amazon"</li>
                <li>• Suspicious subdomain: "amazom-security.com"</li>
                <li>• No official Amazon branding or styling</li>
                <li>• Urgency tactics pressuring immediate action</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Step */}
      {currentStep === 'analysis' && (
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              Attack Analysis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* What Happened */}
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-3">What Just Happened?</h4>
                <ul className="text-sm text-red-300 space-y-2">
                  <li>• Your credentials were captured by the fake site</li>
                  <li>• Data is now in the hands of attackers</li>
                  <li>• Your real account could be compromised</li>
                  <li>• Personal information may be stolen</li>
                </ul>
              </div>

              {/* Prevention */}
              <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-3">How to Prevent This</h4>
                <ul className="text-sm text-green-300 space-y-2">
                  <li>• Always check the URL carefully</li>
                  <li>• Look for HTTPS and valid certificates</li>
                  <li>• Be suspicious of urgent requests</li>
                  <li>• Navigate directly to sites, don't click email links</li>
                  <li>• Use two-factor authentication</li>
                </ul>
              </div>
            </div>

            {enteredCredentials.email && (
              <div className="mt-6 p-4 bg-gray-600 rounded-lg">
                <h4 className="font-semibold text-white mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mr-2" />
                  Captured Data (Simulation)
                </h4>
                <div className="bg-gray-800 p-3 rounded border font-mono text-sm">
                  <div className="text-gray-400">// Attacker's server logs:</div>
                  <div className="text-cyan-400">Email: {enteredCredentials.email}</div>
                  <div className="text-cyan-400">Password: {enteredCredentials.password}</div>
                  <div className="text-gray-400">Timestamp: {new Date().toISOString()}</div>
                  <div className="text-gray-400">IP: 192.168.1.100 (victim's IP)</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhishingDemo;