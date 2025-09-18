import React, { useState } from 'react';
import { FolderOpen, AlertTriangle, Shield, File, Play } from 'lucide-react';

const DirectoryTraversalDemo: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [isVulnerable, setIsVulnerable] = useState(true);
  const [fileOutput, setFileOutput] = useState('');
  const [currentPath, setCurrentPath] = useState('/var/www/uploads');

  const payloadExamples = [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\system32\\drivers\\etc\\hosts',
    '....//....//....//etc/passwd',
    '../../../home/user/.ssh/id_rsa',
    '..\\..\\..\\boot.ini',
    '/etc/shadow',
    '../../../../../../etc/hosts'
  ];

  const fileSystem = {
    '/var/www/uploads/file1.txt': 'This is a safe uploaded file.',
    '/var/www/uploads/file2.txt': 'Another safe file in uploads directory.',
    '/etc/passwd': `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
admin:x:1000:1000:Admin User:/home/admin:/bin/bash`,
    '/etc/shadow': `root:$6$xyz123$hashedpassword:18000:0:99999:7:::
admin:$6$abc456$anotherhash:18000:0:99999:7:::
www-data:*:18000:0:99999:7:::`,
    '/home/user/.ssh/id_rsa': `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA2K8BX9vYJ8ZQx...
[SENSITIVE SSH PRIVATE KEY CONTENT]
...
-----END RSA PRIVATE KEY-----`,
    '/etc/hosts': `127.0.0.1   localhost
127.0.1.1   server.local
192.168.1.100   admin-panel.internal
10.0.0.5   database.internal`,
    '/boot.ini': `[boot loader]
timeout=30
default=multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS
[operating systems]
multi(0)disk(0)rdisk(0)partition(1)\\WINDOWS="Microsoft Windows XP Professional"`
  };

  const sanitizePath = (path: string) => {
    // Remove directory traversal attempts
    return path.replace(/\.\./g, '').replace(/[/\\]/g, '');
  };

  const resolvePath = (basePath: string, userPath: string) => {
    if (userPath.startsWith('/')) {
      return userPath;
    }
    
    // Simulate path resolution with traversal
    const parts = basePath.split('/').filter(p => p);
    const userParts = userPath.split(/[/\\]/).filter(p => p);
    
    for (const part of userParts) {
      if (part === '..') {
        parts.pop();
      } else if (part === '.' || part === '') {
        continue;
      } else {
        parts.push(part);
      }
    }
    
    return '/' + parts.join('/');
  };

  const handleFileRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    let targetPath;
    if (isVulnerable) {
      targetPath = resolvePath(currentPath, userInput);
    } else {
      const sanitized = sanitizePath(userInput);
      targetPath = `${currentPath}/${sanitized}`;
    }

    if (fileSystem[targetPath as keyof typeof fileSystem]) {
      setFileOutput(fileSystem[targetPath as keyof typeof fileSystem]);
    } else {
      setFileOutput(`Error: File not found at path: ${targetPath}`);
    }
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
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <FolderOpen className="w-4 h-4 text-cyan-400 mr-2" />
              File Download Interface
            </h4>
            
            <div className="bg-gray-800 p-3 rounded border mb-4">
              <div className="text-sm text-gray-400 mb-1">Current Directory:</div>
              <div className="font-mono text-cyan-400">{currentPath}</div>
            </div>

            <form onSubmit={handleFileRequest} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  File Path:
                </label>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter filename or path..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Download File</span>
              </button>
            </form>

            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-300 mb-2">Try these traversal payloads:</h5>
              <div className="space-y-1">
                {payloadExamples.map((example, index) => (
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
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <File className="w-4 h-4 text-green-400 mr-2" />
              File Content
            </h4>
            
            <div className="bg-gray-800 rounded-lg p-4 min-h-48">
              {fileOutput ? (
                <div>
                  <div className="text-sm text-gray-400 mb-2">File Content:</div>
                  <pre className="text-sm text-white whitespace-pre-wrap bg-black p-3 rounded border overflow-auto max-h-64">
                    {fileOutput}
                  </pre>
                  {fileOutput.includes('root:') && (
                    <div className="mt-2 p-2 bg-red-900/30 border border-red-700/50 rounded text-sm text-red-300">
                      🚨 Critical: System password file accessed!
                    </div>
                  )}
                  {fileOutput.includes('PRIVATE KEY') && (
                    <div className="mt-2 p-2 bg-red-900/30 border border-red-700/50 rounded text-sm text-red-300">
                      🚨 Critical: SSH private key exposed!
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 text-sm italic">
                  No file requested yet. Enter a path above and click Download File.
                </div>
              )}
            </div>

            {/* File System Structure */}
            <div className="mt-4 bg-gray-800 p-3 rounded border">
              <h5 className="text-sm font-medium text-gray-300 mb-2">Server File Structure:</h5>
              <div className="text-xs font-mono text-gray-400 space-y-1">
                <div>/</div>
                <div>├── etc/</div>
                <div>│   ├── passwd</div>
                <div>│   ├── shadow</div>
                <div>│   └── hosts</div>
                <div>├── var/www/uploads/ (current directory)</div>
                <div>│   ├── file1.txt</div>
                <div>│   └── file2.txt</div>
                <div>├── home/user/.ssh/</div>
                <div>│   └── id_rsa</div>
                <div>└── boot.ini (Windows)</div>
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
            {`// Dangerous: Direct path concatenation
app.get('/download', (req, res) => {
  const filename = req.query.file;
  const filepath = '/var/www/uploads/' + filename;
  
  // No path validation!
  res.sendFile(filepath);
});`}
          </code>
        </div>

        <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
          <h5 className="text-green-400 font-medium text-sm mb-3">Secure Code:</h5>
          <code className="text-xs font-mono text-green-300 block bg-gray-800 p-3 rounded">
            {`// Safe: Path validation and sanitization
app.get('/download', (req, res) => {
  const filename = req.query.file;
  
  // Sanitize input
  const safeFilename = path.basename(filename);
  const filepath = path.join('/var/www/uploads/', safeFilename);
  
  // Verify path is within allowed directory
  if (!filepath.startsWith('/var/www/uploads/')) {
    return res.status(403).send('Access denied');
  }
  
  res.sendFile(filepath);
});`}
          </code>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-400 mb-3">Understanding Directory Traversal Attacks</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Common Techniques:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• ../ (Unix/Linux)</li>
              <li>• ..\\ (Windows)</li>
              <li>• URL encoding (%2e%2e%2f)</li>
              <li>• Double encoding</li>
              <li>• Null byte injection</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Target Files:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• /etc/passwd (Linux users)</li>
              <li>• /etc/shadow (password hashes)</li>
              <li>• ~/.ssh/id_rsa (SSH keys)</li>
              <li>• web.config (Windows apps)</li>
              <li>• Application config files</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Prevention:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• Input validation</li>
              <li>• Path canonicalization</li>
              <li>• Whitelist allowed files</li>
              <li>• Chroot jails</li>
              <li>• File permissions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryTraversalDemo;