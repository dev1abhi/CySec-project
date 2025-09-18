import React, { useState, useEffect } from 'react';
import { Code, AlertTriangle, Shield, Play } from 'lucide-react';

const XSSDemo: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [isVulnerable, setIsVulnerable] = useState(true);
  const [executedScript, setExecutedScript] = useState('');

  const vulnerableExamples = [
    '<script>alert("XSS Attack!")</script>',
    '<img src="x" onerror="alert(\'Malicious Script Executed!\')">',
    '<svg onload="alert(\'SVG XSS Attack!\')">',
    'javascript:alert("Protocol Handler Attack")'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isVulnerable) {
      setExecutedScript(userInput);
      // Simulate script execution for demonstration
      if (userInput.includes('alert')) {
        setTimeout(() => {
          alert('🚨 XSS Attack Executed! (This is a safe simulation)');
        }, 100);
      }
    } else {
      setExecutedScript(sanitizeInput(userInput));
    }
  };

  const sanitizeInput = (input: string) => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="vulnerable"
              checked={isVulnerable}
              onChange={(e) => setIsVulnerable(e.target.checked)}
              className="rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500"
            />
            <label htmlFor="vulnerable" className="text-sm font-medium">
              Vulnerable Mode
            </label>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isVulnerable 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-green-500/20 text-green-400 border border-green-500/30'
          }`}>
            {isVulnerable ? 'VULNERABLE' : 'PROTECTED'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="bg-gray-600 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Code className="w-4 h-4 text-cyan-400 mr-2" />
              User Input
            </h4>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter your comment or message..."
                className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-500 rounded-md text-white resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Submit</span>
              </button>
            </form>

            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-300 mb-2">Try these XSS payloads:</h5>
              <div className="space-y-1">
                {vulnerableExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setUserInput(example)}
                    className="block w-full text-left px-3 py-2 bg-gray-800 border border-gray-600 rounded text-xs font-mono text-yellow-400 hover:bg-gray-700 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="bg-gray-600 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Shield className="w-4 h-4 text-green-400 mr-2" />
              Application Output
            </h4>
            
            <div className="bg-white text-black rounded-lg p-4 min-h-32">
              <div className="border-b border-gray-200 pb-2 mb-3">
                <h5 className="font-semibold">User Comments</h5>
              </div>
              
              {executedScript && (
                <div className="bg-gray-50 p-3 rounded border">
                  <div className="text-sm text-gray-600 mb-1">Latest comment:</div>
                  <div 
                    className="text-black"
                    dangerouslySetInnerHTML={{ 
                      __html: isVulnerable ? executedScript : sanitizeInput(executedScript)
                    }}
                  />
                </div>
              )}
              
              {!executedScript && (
                <div className="text-gray-500 text-sm italic">
                  No comments yet. Try submitting some input above.
                </div>
              )}
            </div>

            {/* Code Comparison */}
            <div className="mt-4 space-y-3">
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3">
                <h5 className="text-red-400 font-medium text-sm mb-2">Vulnerable Code:</h5>
                <code className="text-xs font-mono text-red-300 block bg-gray-800 p-2 rounded">
                  {`// Dangerous: Direct HTML injection
element.innerHTML = userInput;`}
                </code>
              </div>

              <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-3">
                <h5 className="text-green-400 font-medium text-sm mb-2">Secure Code:</h5>
                <code className="text-xs font-mono text-green-300 block bg-gray-800 p-2 rounded">
                  {`// Safe: Sanitized input
element.textContent = sanitizeInput(userInput);`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-400 mb-3">Understanding XSS Attacks</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Types of XSS:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• Stored XSS</li>
              <li>• Reflected XSS</li>
              <li>• DOM-based XSS</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Impact:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• Session hijacking</li>
              <li>• Data theft</li>
              <li>• Malware distribution</li>
              <li>• Account takeover</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Prevention:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• Input validation</li>
              <li>• Output encoding</li>
              <li>• Content Security Policy</li>
              <li>• Use secure frameworks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XSSDemo;