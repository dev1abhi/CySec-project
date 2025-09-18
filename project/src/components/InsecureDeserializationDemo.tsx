import React, { useState } from 'react';
import { Package, AlertTriangle, Shield, Play, Code } from 'lucide-react';

const InsecureDeserializationDemo: React.FC = () => {
  const [serializedInput, setSerializedInput] = useState('');
  const [isVulnerable, setIsVulnerable] = useState(true);
  const [deserializationResult, setDeserializationResult] = useState('');
  const [maliciousPayloadUsed, setMaliciousPayloadUsed] = useState(false);

  const payloadExamples = [
    {
      name: 'Java Gadget Chain',
      payload: `rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAABdAAEY2FsY3QAEGphdmEubGFuZy5TdHJpbmd4`,
      description: 'Executes system command via Java deserialization'
    },
    {
      name: 'Python Pickle RCE',
      payload: `gASVNQAAAAAAAACMCGJ1aWx0aW5zlIwEZXZhbJSTlIwYX19pbXBvcnRfXygnb3MnKS5zeXN0ZW0oJ2lkJymUhZRSlC4=`,
      description: 'Remote code execution via Python pickle'
    },
    {
      name: 'PHP Object Injection',
      payload: `O:8:"stdClass":1:{s:4:"exec";s:6:"whoami";}`,
      description: 'PHP object injection with command execution'
    },
    {
      name: 'Legitimate User Object',
      payload: `{"username": "john.doe", "role": "user", "email": "john@company.com"}`,
      description: 'Normal user object (safe)'
    }
  ];

  const mockDeserialize = (data: string) => {
    setMaliciousPayloadUsed(false);
    
    if (!data.trim()) {
      return '';
    }

    try {
      // Check for different payload types
      if (data.includes('rO0AB') || data.includes('java.lang.String')) {
        setMaliciousPayloadUsed(true);
        if (isVulnerable) {
          return `SYSTEM COMMAND EXECUTED!
Command: calc
Result: Calculator.exe started

🚨 CRITICAL: Java deserialization RCE successful!
Attacker gained system access via gadget chain.

Stack trace:
  at java.lang.ProcessImpl.start(ProcessImpl.java:181)
  at java.lang.ProcessBuilder.start(ProcessBuilder.java:1029)
  at java.lang.Runtime.exec(Runtime.java:620)
  at MaliciousPayload.readObject(MaliciousPayload.java:15)`;
        } else {
          return `Deserialization blocked: Untrusted class detected
Security policy: java.lang.ProcessImpl not allowed
Safe mode: Only whitelisted classes permitted`;
        }
      } else if (data.includes('gASV') || data.includes('pickle')) {
        setMaliciousPayloadUsed(true);
        if (isVulnerable) {
          return `PYTHON CODE EXECUTED!
Command: id
Result: uid=1000(www-data) gid=1000(www-data) groups=1000(www-data)

🚨 CRITICAL: Python pickle RCE successful!
Remote code execution achieved via malicious pickle.

Traceback (most recent call last):
  File "<string>", line 1, in <module>
  File "/usr/lib/python3.8/pickle.py", line 1213, in loads
  ...malicious code executed...`;
        } else {
          return `Pickle deserialization blocked: Custom loader detected
Security: Using safe_load() instead of load()
Only basic types allowed: str, int, float, bool, list, dict`;
        }
      } else if (data.includes('stdClass') || data.includes('exec')) {
        setMaliciousPayloadUsed(true);
        if (isVulnerable) {
          return `PHP OBJECT INJECTION EXECUTED!
Command: whoami
Result: www-data

🚨 CRITICAL: PHP object injection successful!
Magic method __wakeup() triggered malicious code.

PHP Warning: Potential security breach detected
Object: stdClass with exec property
Executed: system('whoami')`;
        } else {
          return `PHP object injection blocked: Dangerous class detected
Whitelist validation: stdClass not in allowed classes
Safe unserialize: Using allowed_classes parameter`;
        }
      } else {
        // Try to parse as JSON (legitimate object)
        try {
          const parsed = JSON.parse(data);
          return `Legitimate object deserialized successfully:

Username: ${parsed.username || 'N/A'}
Role: ${parsed.role || 'N/A'}
Email: ${parsed.email || 'N/A'}

Object type: Safe JSON data
No security concerns detected.`;
        } catch (e) {
          return `Parse error: Invalid serialized data format
Expected: Base64 encoded binary or JSON string
Received: ${data.substring(0, 50)}...`;
        }
      }
    } catch (error) {
      return `Deserialization error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };

  const handleDeserialize = (e: React.FormEvent) => {
    e.preventDefault();
    const result = mockDeserialize(serializedInput);
    setDeserializationResult(result);
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
              Unsafe Deserialization
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
              <Package className="w-4 h-4 text-cyan-400 mr-2" />
              Serialized Data Input
            </h4>
            
            <form onSubmit={handleDeserialize} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Serialized Object:
                </label>
                <textarea
                  value={serializedInput}
                  onChange={(e) => setSerializedInput(e.target.value)}
                  placeholder="Enter serialized data (Base64, JSON, etc.)..."
                  className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-500 rounded-md text-white font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Deserialize Object</span>
              </button>
            </form>

            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-300 mb-2">Serialization Payloads:</h5>
              <div className="space-y-2">
                {payloadExamples.map((example, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-600 rounded p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-medium ${
                        example.name.includes('Legitimate') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {example.name}
                      </span>
                      <button
                        onClick={() => setSerializedInput(example.payload)}
                        className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      >
                        Use This
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 mb-2">{example.description}</div>
                    <code className="text-xs text-gray-300 font-mono block break-all">
                      {example.payload.length > 60 ? example.payload.substring(0, 60) + '...' : example.payload}
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
              <Code className="w-4 h-4 text-green-400 mr-2" />
              Deserialization Result
            </h4>
            
            <div className="bg-gray-800 rounded-lg p-4 min-h-48">
              {deserializationResult ? (
                <div>
                  <pre className="text-sm text-white whitespace-pre-wrap bg-black p-3 rounded border overflow-auto max-h-64">
                    {deserializationResult}
                  </pre>
                  
                  {maliciousPayloadUsed && isVulnerable && (
                    <div className="mt-3 p-3 bg-red-900/30 border border-red-700/50 rounded">
                      <div className="flex items-center mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
                        <span className="text-red-400 font-medium">Critical Security Breach!</span>
                      </div>
                      <ul className="text-sm text-red-300 space-y-1">
                        <li>• Remote code execution achieved</li>
                        <li>• System commands executed with server privileges</li>
                        <li>• Potential for full system compromise</li>
                        <li>• Data exfiltration possible</li>
                      </ul>
                    </div>
                  )}
                  
                  {maliciousPayloadUsed && !isVulnerable && (
                    <div className="mt-3 p-3 bg-green-900/30 border border-green-700/50 rounded">
                      <div className="flex items-center mb-2">
                        <Shield className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-green-400 font-medium">Attack Blocked!</span>
                      </div>
                      <ul className="text-sm text-green-300 space-y-1">
                        <li>• Malicious payload detected and rejected</li>
                        <li>• Security controls prevented code execution</li>
                        <li>• Safe deserialization practices applied</li>
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 text-sm italic">
                  No data deserialized yet. Enter serialized data above and click Deserialize Object.
                </div>
              )}
            </div>
          </div>

          {/* Language-Specific Risks */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-300 mb-2">Platform-Specific Risks:</h5>
            <div className="space-y-2 text-sm">
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-orange-400 font-medium">Java:</span>
                <span className="text-gray-300 ml-2">ObjectInputStream, gadget chains, Apache Commons</span>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-blue-400 font-medium">Python:</span>
                <span className="text-gray-300 ml-2">pickle, cPickle, yaml.load</span>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-purple-400 font-medium">PHP:</span>
                <span className="text-gray-300 ml-2">unserialize(), magic methods, object injection</span>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-green-400 font-medium">.NET:</span>
                <span className="text-gray-300 ml-2">BinaryFormatter, JSON.NET TypeNameHandling</span>
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
            {`// Java - Dangerous deserialization
ObjectInputStream ois = new ObjectInputStream(input);
Object obj = ois.readObject(); // No validation!

// Python - Unsafe pickle
import pickle
obj = pickle.load(file) # Can execute arbitrary code

// PHP - Direct unserialize
$obj = unserialize($_POST['data']); // RCE risk`}
          </code>
        </div>

        <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
          <h5 className="text-green-400 font-medium text-sm mb-3">Secure Code:</h5>
          <code className="text-xs font-mono text-green-300 block bg-gray-800 p-3 rounded">
            {`// Java - Safe deserialization
// Use whitelisting or safe formats like JSON
ObjectMapper mapper = new ObjectMapper();
MyClass obj = mapper.readValue(json, MyClass.class);

// Python - Safe loading
import json
obj = json.loads(data) # Use JSON instead of pickle

// PHP - Restricted unserialize
$obj = unserialize($data, ['allowed_classes' => ['SafeClass']]);`}
          </code>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-400 mb-3">Understanding Insecure Deserialization</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Attack Vectors:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• Remote code execution</li>
              <li>• Denial of service</li>
              <li>• Authentication bypass</li>
              <li>• Privilege escalation</li>
              <li>• Data tampering</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Common Targets:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• Session data</li>
              <li>• Cached objects</li>
              <li>• API parameters</li>
              <li>• Configuration files</li>
              <li>• Message queues</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Prevention:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• Use safe data formats (JSON)</li>
              <li>• Implement integrity checks</li>
              <li>• Whitelist allowed classes</li>
              <li>• Run with restricted permissions</li>
              <li>• Monitor deserialization calls</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsecureDeserializationDemo;