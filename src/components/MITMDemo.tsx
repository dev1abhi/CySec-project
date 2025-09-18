import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Shield, AlertTriangle, Monitor, Smartphone, Router } from 'lucide-react';

const MITMDemo: React.FC = () => {
  const [connectionType, setConnectionType] = useState<'secure' | 'insecure'>('insecure');
  const [interceptedData, setInterceptedData] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  const mockTraffic = [
    'GET /login HTTP/1.1\nHost: example.com\nUser-Agent: Mozilla/5.0...',
    'POST /api/user HTTP/1.1\nContent-Type: application/json\n{"username":"alice","password":"secret123"}',
    'GET /profile HTTP/1.1\nHost: social-media.com\nCookie: session=abc123xyz789',
    'POST /messages HTTP/1.1\nContent-Type: text/plain\n"Hey, can you send me the project files?"',
    'GET /banking/balance HTTP/1.1\nHost: bank.com\nAuthorization: Bearer eyJhbGciOiJIUzI1...'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCapturing && connectionType === 'insecure') {
      interval = setInterval(() => {
        const randomTraffic = mockTraffic[Math.floor(Math.random() * mockTraffic.length)];
        setInterceptedData(prev => [...prev.slice(-4), randomTraffic]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isCapturing, connectionType]);

  const startCapture = () => {
    setIsCapturing(true);
    setInterceptedData([]);
  };

  const stopCapture = () => {
    setIsCapturing(false);
  };

  return (
    <div className="space-y-6">
      {/* Network Diagram */}
      <div className="bg-gray-700 rounded-lg p-6">
        <h4 className="font-semibold mb-4 flex items-center">
          <Router className="w-4 h-4 text-purple-400 mr-2" />
          Network Topology
        </h4>
        
        <div className="flex items-center justify-center space-x-8">
          {/* User Device */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <div className="text-sm text-blue-400">Your Device</div>
          </div>

          {/* Connection Line */}
          <div className="flex-1 relative">
            <div className={`h-0.5 ${connectionType === 'secure' ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {connectionType === 'secure' ? (
                <Shield className="w-6 h-6 text-green-400 bg-gray-700 p-1 rounded" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-red-400 bg-gray-700 p-1 rounded" />
              )}
            </div>
            
            {/* Attacker (only shown in insecure mode) */}
            {connectionType === 'insecure' && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-1">
                    <WifiOff className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs text-red-400">Attacker</div>
                </div>
              </div>
            )}
          </div>

          {/* Server */}
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
              <Monitor className="w-8 h-8 text-white" />
            </div>
            <div className="text-sm text-purple-400">Web Server</div>
          </div>
        </div>

        {/* Connection Controls */}
        <div className="mt-6 flex items-center justify-center space-x-4">
          <button
            onClick={() => setConnectionType('insecure')}
            className={`px-4 py-2 rounded-md transition-colors ${
              connectionType === 'insecure'
                ? 'bg-red-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            <Wifi className="w-4 h-4 inline mr-2" />
            Insecure Network
          </button>
          <button
            onClick={() => setConnectionType('secure')}
            className={`px-4 py-2 rounded-md transition-colors ${
              connectionType === 'secure'
                ? 'bg-green-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            <Shield className="w-4 h-4 inline mr-2" />
            Secure Network (HTTPS/VPN)
          </button>
        </div>
      </div>

      {/* Traffic Capture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Traffic Monitoring</h4>
          
          <div className="space-y-3">
            <div className="flex space-x-2">
              <button
                onClick={startCapture}
                disabled={isCapturing}
                className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Start Capture
              </button>
              <button
                onClick={stopCapture}
                disabled={!isCapturing}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Stop Capture
              </button>
            </div>

            {isCapturing && (
              <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span>Capturing network traffic...</span>
              </div>
            )}
          </div>
        </div>

        {/* Intercepted Data */}
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Intercepted Traffic</h4>
          
          <div className="bg-gray-800 rounded-lg p-3 h-64 overflow-auto">
            {connectionType === 'secure' ? (
              <div className="text-green-400 text-sm text-center py-8">
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <div>Traffic is encrypted</div>
                <div className="text-xs text-green-300 mt-1">HTTPS/TLS protection active</div>
              </div>
            ) : interceptedData.length === 0 ? (
              <div className="text-gray-400 text-sm text-center py-8">
                No traffic captured yet. Start capture to see intercepted data.
              </div>
            ) : (
              <div className="space-y-3">
                {interceptedData.map((data, index) => (
                  <div key={index} className="bg-red-900/30 border border-red-700/50 rounded p-2">
                    <div className="text-xs text-red-400 mb-1">Packet #{index + 1}:</div>
                    <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap">
                      {data}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-400 mb-3">Man-in-the-Middle Attack Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Attack Vectors:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• Rogue Wi-Fi hotspots</li>
              <li>• ARP spoofing</li>
              <li>• DNS hijacking</li>
              <li>• BGP hijacking</li>
              <li>• SSL stripping</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Data at Risk:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• Login credentials</li>
              <li>• Personal messages</li>
              <li>• Financial transactions</li>
              <li>• Session tokens</li>
              <li>• API keys</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Protection Methods:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• Always use HTTPS</li>
              <li>• Verify SSL certificates</li>
              <li>• Use VPNs on public Wi-Fi</li>
              <li>• Certificate pinning</li>
              <li>• End-to-end encryption</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MITMDemo;