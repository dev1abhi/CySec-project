import React, { useState } from 'react';
import { Search, AlertTriangle, Shield, Play, Users } from 'lucide-react';

const LDAPInjectionDemo: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [isVulnerable, setIsVulnerable] = useState(true);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [ldapQuery, setLdapQuery] = useState('');

  const injectionExamples = [
    {
      name: 'Authentication Bypass',
      payload: 'admin)(&(objectClass=*',
      description: 'Bypasses authentication by injecting always-true condition'
    },
    {
      name: 'Information Disclosure',
      payload: '*)(&(password=*',
      description: 'Reveals users with any password'
    },
    {
      name: 'Enumerate All Users',
      payload: '*)|(objectClass=*',
      description: 'Returns all directory entries'
    },
    {
      name: 'Admin Search',
      payload: '*)(&(role=admin',
      description: 'Finds all administrative accounts'
    }
  ];

  const mockLdapDirectory = [
    { cn: 'john.doe', mail: 'john@company.com', role: 'user', department: 'IT', password: 'hashed123' },
    { cn: 'jane.smith', mail: 'jane@company.com', role: 'admin', department: 'HR', password: 'hashedabc' },
    { cn: 'admin', mail: 'admin@company.com', role: 'admin', department: 'IT', password: 'hashedadmin' },
    { cn: 'guest', mail: 'guest@company.com', role: 'guest', department: 'Public', password: 'hashedguest' },
    { cn: 'service.account', mail: 'service@company.com', role: 'service', department: 'System', password: 'hashedservice' },
    { cn: 'manager', mail: 'manager@company.com', role: 'manager', department: 'Sales', password: 'hashedmgr' }
  ];

  const sanitizeInput = (input: string) => {
    return input.replace(/[()&|*\\]/g, '\\$&');
  };

  const buildLdapQuery = (searchTerm: string) => {
    if (isVulnerable) {
      return `(&(objectClass=person)(cn=${searchTerm}))`;
    } else {
      const sanitized = sanitizeInput(searchTerm);
      return `(&(objectClass=person)(cn=${sanitized}))`;
    }
  };

  const executeLdapSearch = (query: string) => {
    // Simulate LDAP search execution
    console.log('LDAP Query:', query);
    
    if (query.includes('*)|(objectClass=*')) {
      // Return all entries for enumeration attack
      return mockLdapDirectory;
    } else if (query.includes('*)(&(password=*')) {
      // Return users with passwords
      return mockLdapDirectory.filter(user => user.password);
    } else if (query.includes('admin)(&(objectClass=*')) {
      // Authentication bypass - return admin user
      return mockLdapDirectory.filter(user => user.role === 'admin');
    } else if (query.includes('*)(&(role=admin')) {
      // Find admin users
      return mockLdapDirectory.filter(user => user.role === 'admin');
    } else if (query.includes(searchInput.toLowerCase()) && !query.includes('\\')) {
      // Normal search (vulnerable)
      return mockLdapDirectory.filter(user => 
        user.cn.toLowerCase().includes(searchInput.toLowerCase()) ||
        user.mail.toLowerCase().includes(searchInput.toLowerCase())
      );
    } else {
      // Sanitized search
      const cleanTerm = searchInput.replace(/[()&|*\\]/g, '');
      return mockLdapDirectory.filter(user => 
        user.cn.toLowerCase().includes(cleanTerm.toLowerCase()) ||
        user.mail.toLowerCase().includes(cleanTerm.toLowerCase())
      );
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const query = buildLdapQuery(searchInput);
    setLdapQuery(query);
    
    const results = executeLdapSearch(query);
    setSearchResults(results);
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
              Vulnerable LDAP Query
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
              LDAP Directory Search
            </h4>
            
            <form onSubmit={handleSearch} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Search for User:
                </label>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter username..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Search Directory</span>
              </button>
            </form>

            {ldapQuery && (
              <div className="mt-4 bg-gray-800 p-3 rounded border">
                <div className="text-sm text-gray-400 mb-1">Generated LDAP Query:</div>
                <code className="text-xs font-mono text-cyan-400 break-all">
                  {ldapQuery}
                </code>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-300 mb-2">LDAP Injection Payloads:</h5>
              <div className="space-y-2">
                {injectionExamples.map((example, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-600 rounded p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-yellow-400">{example.name}</span>
                      <button
                        onClick={() => setSearchInput(example.payload)}
                        className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
                      >
                        Use This
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 mb-1">{example.description}</div>
                    <code className="text-xs text-red-400 font-mono">
                      {example.payload}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Users className="w-4 h-4 text-green-400 mr-2" />
              Search Results ({searchResults.length} entries)
            </h4>
            
            <div className="bg-gray-800 rounded-lg p-4 min-h-48 max-h-64 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((user, index) => (
                    <div key={index} className="bg-gray-900 border border-gray-600 rounded p-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-400">CN:</span>
                          <span className="text-white ml-2">{user.cn}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Role:</span>
                          <span className={`ml-2 ${user.role === 'admin' ? 'text-red-400' : 'text-white'}`}>
                            {user.role}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Email:</span>
                          <span className="text-white ml-2">{user.mail}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Dept:</span>
                          <span className="text-white ml-2">{user.department}</span>
                        </div>
                        {searchResults.length > 3 && (
                          <div className="col-span-2">
                            <span className="text-gray-400">Password Hash:</span>
                            <span className="text-red-300 ml-2 font-mono text-xs">{user.password}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {searchResults.length > 3 && (
                    <div className="mt-3 p-2 bg-red-900/30 border border-red-700/50 rounded text-sm text-red-300">
                      🚨 Warning: Excessive results returned - possible injection attack!
                    </div>
                  )}
                  
                  {searchResults.some(user => user.role === 'admin') && searchInput.includes(')') && (
                    <div className="mt-3 p-2 bg-red-900/30 border border-red-700/50 rounded text-sm text-red-300">
                      🚨 Critical: Administrative accounts exposed via LDAP injection!
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 text-sm italic">
                  No results found. Try searching for a username above.
                </div>
              )}
            </div>
          </div>

          {/* Directory Structure */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-300 mb-2">LDAP Directory Structure:</h5>
            <div className="text-xs font-mono text-gray-400 space-y-1 bg-gray-800 p-3 rounded">
              <div>dc=company,dc=com</div>
              <div>├── ou=People</div>
              <div>│   ├── cn=john.doe</div>
              <div>│   ├── cn=jane.smith (admin)</div>
              <div>│   ├── cn=admin (admin)</div>
              <div>│   ├── cn=guest</div>
              <div>│   ├── cn=service.account</div>
              <div>│   └── cn=manager</div>
              <div>└── ou=Groups</div>
              <div>    ├── cn=admins</div>
              <div>    ├── cn=users</div>
              <div>    └── cn=guests</div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
          <h5 className="text-red-400 font-medium text-sm mb-3">Vulnerable Code:</h5>
          <code className="text-xs font-mono text-red-300 block bg-gray-800 p-3 rounded">
            {`// Dangerous: Direct string concatenation
String searchFilter = "(&(objectClass=person)(cn=" + userInput + "))";

DirContext ctx = new InitialDirContext(env);
NamingEnumeration results = ctx.search("dc=company,dc=com", searchFilter, searchCtls);`}
          </code>
        </div>

        <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4">
          <h5 className="text-green-400 font-medium text-sm mb-3">Secure Code:</h5>
          <code className="text-xs font-mono text-green-300 block bg-gray-800 p-3 rounded">
            {`// Safe: Input validation and escaping
String sanitizedInput = escapeSearchFilter(userInput);
String searchFilter = "(&(objectClass=person)(cn=" + sanitizedInput + "))";

// Or use parameterized queries
String searchFilter = "(&(objectClass=person)(cn={0}))";
Object[] params = {userInput};
ctx.search("dc=company,dc=com", searchFilter, params, searchCtls);`}
          </code>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-6">
        <h4 className="font-semibold text-blue-400 mb-3">Understanding LDAP Injection Attacks</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Attack Types:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• Authentication bypass</li>
              <li>• Information disclosure</li>
              <li>• Directory enumeration</li>
              <li>• Privilege escalation</li>
              <li>• Blind LDAP injection</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Common Targets:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• User credentials</li>
              <li>• Administrative accounts</li>
              <li>• Group memberships</li>
              <li>• Directory structure</li>
              <li>• Service accounts</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-blue-300 mb-2">Prevention:</h5>
            <ul className="text-blue-200 space-y-1">
              <li>• Input validation</li>
              <li>• LDAP filter escaping</li>
              <li>• Parameterized queries</li>
              <li>• Least privilege access</li>
              <li>• Directory hardening</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LDAPInjectionDemo;