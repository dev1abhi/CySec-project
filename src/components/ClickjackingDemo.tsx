import React, { useState } from 'react';
import { MousePointer, Shield, AlertTriangle, Eye, EyeOff } from 'lucide-react';

const ClickjackingDemo: React.FC = () => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickedButton, setLastClickedButton] = useState<string>('');
  const [hasFrameProtection, setHasFrameProtection] = useState(false);

  const handleButtonClick = (buttonName: string) => {
    setClickCount(prev => prev + 1);
    setLastClickedButton(buttonName);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-overlay"
              checked={showOverlay}
              onChange={(e) => setShowOverlay(e.target.checked)}
              className="rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500"
            />
            <label htmlFor="show-overlay" className="text-sm font-medium">
              Show Malicious Overlay
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="frame-protection"
              checked={hasFrameProtection}
              onChange={(e) => setHasFrameProtection(e.target.checked)}
              className="rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500"
            />
            <label htmlFor="frame-protection" className="text-sm font-medium">
              X-Frame-Options Protection
            </label>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            hasFrameProtection 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {hasFrameProtection ? 'PROTECTED' : 'VULNERABLE'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Legitimate Site */}
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Shield className="w-4 h-4 text-blue-400 mr-2" />
              Legitimate Banking Site
            </h4>
            
            <div className="bg-white text-black rounded-lg p-6 relative overflow-hidden">
              {hasFrameProtection && (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-50">
                  <div className="text-center">
                    <Shield className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <h3 className="font-bold text-gray-800">Frame Protection Active</h3>
                    <p className="text-sm text-gray-600">This page cannot be embedded in frames</p>
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-blue-600">SecureBank</h3>
                <p className="text-gray-600">Online Banking Portal</p>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border">
                  <h4 className="font-semibold text-blue-800 mb-2">Account Actions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleButtonClick('Transfer Money')}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Transfer Money
                    </button>
                    <button
                      onClick={() => handleButtonClick('Delete Account')}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Delete Account
                    </button>
                    <button
                      onClick={() => handleButtonClick('Change Password')}
                      className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
                    >
                      Change Password
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Account Balance</h4>
                  <p className="text-2xl font-bold text-green-600">$25,000.00</p>
                </div>
              </div>

              {clickCount > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                    <span className="text-yellow-800 text-sm">
                      Action performed: <strong>{lastClickedButton}</strong> (Click #{clickCount})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Malicious Site with Overlay */}
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <MousePointer className="w-4 h-4 text-red-400 mr-2" />
              Malicious Site (with hidden iframe)
            </h4>
            
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 relative overflow-hidden">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-red-400">FREE PRIZES!</h3>
                <p className="text-red-300">Click the button below to claim your reward!</p>
              </div>

              {/* Fake Prize Button */}
              <div className="relative">
                <button onClick={() => !showOverlay && alert("Here is a prize💵💵💰💰💸💸🤑🤑")} className="w-full bg-yellow-500 text-black py-4 px-6 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors">
                  🎁 CLAIM YOUR $1000 PRIZE! 🎁
                </button>

                {/* Hidden Banking Interface Overlay */}
                {showOverlay && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="relative w-full h-full">
                      {/* Invisible overlay that would capture clicks */}
                      <div 
                        className="absolute bg-blue-600 opacity-30 border-2 border-blue-400"
                        style={{
                          top: '25%',
                          left: '10%',
                          width: '80%',
                          height: '20%',
                          zIndex: 10
                        }}
                      >
                        <div className="p-2 text-xs text-white">Hidden: Transfer Money Button</div>
                      </div>
                      <div 
                        className="absolute bg-red-600 opacity-30 border-2 border-red-400"
                        style={{
                          top: '50%',
                          left: '10%',
                          width: '80%',
                          height: '20%',
                          zIndex: 10
                        }}
                      >
                        <div className="p-2 text-xs text-white">Hidden: Delete Account Button</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-red-300">
                  {showOverlay ? (
                    <span className="flex items-center justify-center">
                      <Eye className="w-4 h-4 mr-1" />
                      Overlay visible (for demonstration)
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <EyeOff className="w-4 h-4 mr-1" />
                      Overlay hidden (real attack scenario)
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-300">
              <h5 className="font-medium mb-2">How the attack works:</h5>
              <ul className="space-y-1 text-gray-400">
                <li>• Malicious site loads legitimate site in invisible iframe</li>
                <li>• Transparent overlay positioned over legitimate buttons</li>
                <li>• User thinks they're clicking on prize button</li>
                <li>• Actually clicking on hidden banking interface</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Code Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
          <h5 className="text-red-400 font-medium text-sm mb-3">Vulnerable Code:</h5>
          <code className="text-xs font-mono text-red-300 block bg-gray-800 p-3 rounded">
            {`<!-- No frame protection -->
<html>
  <head>
    <title>Banking Site</title>
    <!-- Missing X-Frame-Options header -->
  </head>
  <body>
    <button onclick="transferMoney()">
      Transfer Money
    </button>
  </body>
</html>`}
          </code>
        </div>

        <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
          <h5 className="text-green-400 font-medium text-sm mb-3">Secure Code:</h5>
          <code className="text-xs font-mono text-green-300 block bg-gray-800 p-3 rounded">
            {`<!-- With frame protection -->
<html>
  <head>
    <title>Banking Site</title>
    <meta http-equiv="X-Frame-Options" content="DENY">
    <!-- Or use CSP: frame-ancestors 'none' -->
  </head>
  <body>
    <button onclick="transferMoney()">
      Transfer Money
    </button>
  </body>
</html>`}
          </code>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-400 mb-3">Understanding Clickjacking Attacks</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Attack Types:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• UI redressing</li>
              <li>• Iframe overlay</li>
              <li>• Likejacking (social media)</li>
              <li>• Cursorjacking</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Common Targets:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• Banking transactions</li>
              <li>• Social media likes/shares</li>
              <li>• Account settings</li>
              <li>• File downloads</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Prevention:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• X-Frame-Options header</li>
              <li>• Content Security Policy</li>
              <li>• Frame-killing JavaScript</li>
              <li>• SameSite cookies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClickjackingDemo;