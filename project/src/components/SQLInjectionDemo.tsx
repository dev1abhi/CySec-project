import React, { useState } from 'react';
import { Database, Search, AlertTriangle, Shield, Eye } from 'lucide-react';

const SQLInjectionDemo: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isVulnerable, setIsVulnerable] = useState(true);
  const [showQuery, setShowQuery] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const sampleUsers = [
    { id: 1, username: 'alice', email: 'alice@example.com', role: 'user', password_hash: 'hashed_password_1' },
    { id: 2, username: 'bob', email: 'bob@example.com', role: 'user', password_hash: 'hashed_password_2' },
    { id: 3, username: 'admin', email: 'admin@example.com', role: 'admin', password_hash: 'super_secret_hash' },
    { id: 4, username: 'charlie', email: 'charlie@example.com', role: 'user', password_hash: 'hashed_password_4' }
  ];

  const maliciousInputs = [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "' UNION SELECT username, password_hash, email, role FROM users --",
    "admin'--"
  ];

  const generateSQL = (input: string, vulnerable: boolean) => {
    if (vulnerable) {
      return `SELECT * FROM users WHERE username = '${input}';`;
    } else {
      return `SELECT * FROM users WHERE username = $1; -- Parameterized query with input: "${input}"`;
    }
  };

  const executeQuery = () => {
    const query = generateSQL(searchQuery, isVulnerable);
    
    if (isVulnerable) {
      if (searchQuery.includes("' OR '1'='1")) {
        // Return all users (classic SQL injection)
        setResults(sampleUsers);
      } else if (searchQuery.includes('DROP TABLE')) {
        setResults([{ error: 'Table dropped! All user data lost!' }]);
      } else if (searchQuery.includes('UNION SELECT')) {
        // Return sensitive data
        setResults([
          { exposed: 'admin', password: 'super_secret_hash', email: 'admin@example.com', role: 'admin' },
          { exposed: 'alice', password: 'hashed_password_1', email: 'alice@example.com', role: 'user' }
        ]);
      } else {
        // Normal search
        const filtered = sampleUsers.filter(user => 
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setResults(filtered);
      }
    } else {
      // Secure query - only exact matches
      const filtered = sampleUsers.filter(user => 
        user.username.toLowerCase() === searchQuery.toLowerCase()
      );
      setResults(filtered);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeQuery();
    setShowQuery(true);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="vulnerable-sql"
              checked={isVulnerable}
              onChange={(e) => setIsVulnerable(e.target.checked)}
              className="rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500"
            />
            <label htmlFor="vulnerable-sql" className="text-sm font-medium">
              Vulnerable Database
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
              <Search className="w-4 h-4 text-cyan-400 mr-2" />
              User Search Interface
            </h4>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Search for user:
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter username to search..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Search Users</span>
              </button>
            </form>

            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-300 mb-2">Try these SQL injection payloads:</h5>
              <div className="space-y-1">
                {maliciousInputs.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(example)}
                    className="block w-full text-left px-3 py-2 bg-gray-800 border border-gray-600 rounded text-xs font-mono text-yellow-400 hover:bg-gray-700 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SQL Query Display */}
          {showQuery && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Database className="w-4 h-4 text-purple-400 mr-2" />
                Generated SQL Query
              </h4>
              
              <div className="bg-gray-800 p-3 rounded border font-mono text-sm">
                <div className="text-gray-400 mb-1">// Generated query:</div>
                <div className={isVulnerable ? 'text-red-400' : 'text-green-400'}>
                  {generateSQL(searchQuery, isVulnerable)}
                </div>
              </div>

              {isVulnerable && searchQuery.includes("'") && (
                <div className="mt-3 p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                    <div>
                      <div className="text-red-400 font-medium text-sm">SQL Injection Detected!</div>
                      <div className="text-red-300 text-xs mt-1">
                        Malicious SQL code is being executed directly in the database query.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Eye className="w-4 h-4 text-green-400 mr-2" />
              Query Results
            </h4>
            
            <div className="bg-gray-800 rounded-lg p-4 max-h-96 overflow-auto">
              {results.length === 0 ? (
                <div className="text-gray-400 text-sm italic">No results. Try searching for a user.</div>
              ) : (
                <div className="space-y-3">
                  {results.map((result, index) => (
                    <div key={index} className="bg-gray-700 p-3 rounded border">
                      {result.error ? (
                        <div className="text-red-400 font-medium">💥 {result.error}</div>
                      ) : result.exposed ? (
                        <div className="space-y-1">
                          <div className="text-red-400 font-medium">🚨 EXPOSED DATA:</div>
                          <div className="text-xs font-mono text-red-300">
                            <div>Username: {result.exposed}</div>
                            <div>Password Hash: {result.password}</div>
                            <div>Email: {result.email}</div>
                            <div>Role: {result.role}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="font-medium text-white">{result.username}</div>
                          <div className="text-xs text-gray-400">
                            <div>ID: {result.id}</div>
                            <div>Email: {result.email}</div>
                            <div>Role: {result.role}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-400 mb-3">SQL Injection Prevention</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Vulnerable Approach:</h5>
            <div className="bg-gray-800 p-3 rounded font-mono text-xs text-red-400">
              {`// DON'T DO THIS
const query = "SELECT * FROM users WHERE username = '" + userInput + "'";
db.execute(query);`}
            </div>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Secure Approach:</h5>
            <div className="bg-gray-800 p-3 rounded font-mono text-xs text-green-400">
              {`// DO THIS INSTEAD
const query = "SELECT * FROM users WHERE username = $1";
db.execute(query, [userInput]);`}
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm text-blue-200">
          <strong>Key Prevention Methods:</strong> Use parameterized queries, input validation, 
          least privilege database access, and stored procedures where possible.
        </div>
      </div>
    </div>
  );
};

export default SQLInjectionDemo;