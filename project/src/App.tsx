import { useState } from 'react';
import { Shield, Terminal, AlertTriangle, Lock, Database, Globe, UserX, Wifi, MousePointer, FolderOpen, FileCode, Search, Package } from 'lucide-react';
import PhishingDemo from './components/PhishingDemo';
import XSSDemo from './components/XSSDemo';
import SQLInjectionDemo from './components/SQLInjectionDemo';
import CSRFDemo from './components/CSRFDemo';
import MITMDemo from './components/MITMDemo';
import SessionHijackingDemo from './components/SessionHijackingDemo';
import ClickjackingDemo from './components/ClickjackingDemo';
import DirectoryTraversalDemo from './components/DirectoryTraversalDemo';
import XXEDemo from './components/XXEDemo';
import LDAPInjectionDemo from './components/LDAPInjectionDemo';
import InsecureDeserializationDemo from './components/InsecureDeserializationDemo';

export type AttackType = 'phishing' | 'xss' | 'sql-injection' | 'csrf' | 'mitm' | 'session-hijacking' | 'clickjacking' | 'directory-traversal' | 'xxe' | 'ldap-injection' | 'insecure-deserialization';

const attacks = [
  {
    id: 'phishing' as AttackType,
    name: 'Phishing',
    icon: UserX,
    riskLevel: 'high',
    description: 'Social engineering attacks that trick users into revealing sensitive information'
  },
  {
    id: 'xss' as AttackType,
    name: 'Cross-Site Scripting',
    icon: Globe,
    riskLevel: 'high',
    description: 'Code injection attacks where malicious scripts are injected into trusted websites'
  },
  {
    id: 'sql-injection' as AttackType,
    name: 'SQL Injection',
    icon: Database,
    riskLevel: 'high',
    description: 'Code injection technique used to attack data-driven applications'
  },
  {
    id: 'csrf' as AttackType,
    name: 'CSRF',
    icon: Lock,
    riskLevel: 'medium',
    description: 'Cross-Site Request Forgery attacks that trick users into performing unwanted actions'
  },
  {
    id: 'mitm' as AttackType,
    name: 'Man-in-the-Middle',
    icon: Wifi,
    riskLevel: 'high',
    description: 'Attacks where communication between two parties is secretly intercepted'
  },
  {
    id: 'session-hijacking' as AttackType,
    name: 'Session Hijacking',
    icon: Terminal,
    riskLevel: 'medium',
    description: 'Attacks that exploit valid computer sessions to gain unauthorized access'
  },
  {
    id: 'clickjacking' as AttackType,
    name: 'Clickjacking',
    icon: MousePointer,
    riskLevel: 'medium',
    description: 'UI redress attacks that trick users into clicking on hidden malicious elements'
  },
  {
    id: 'directory-traversal' as AttackType,
    name: 'Directory Traversal',
    icon: FolderOpen,
    riskLevel: 'high',
    description: 'Path manipulation attacks to access files outside intended directories'
  },
  {
    id: 'xxe' as AttackType,
    name: 'XXE Injection',
    icon: FileCode,
    riskLevel: 'high',
    description: 'XML External Entity attacks that exploit XML parsers to access internal files'
  },
  {
    id: 'ldap-injection' as AttackType,
    name: 'LDAP Injection',
    icon: Search,
    riskLevel: 'medium',
    description: 'Code injection attacks targeting LDAP directory services'
  },
  {
    id: 'insecure-deserialization' as AttackType,
    name: 'Insecure Deserialization',
    icon: Package,
    riskLevel: 'high',
    description: 'Attacks exploiting unsafe deserialization of untrusted data'
  }
];

function App() {
  const [activeAttack, setActiveAttack] = useState<AttackType>('phishing');

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'low': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const renderDemo = () => {
    switch (activeAttack) {
      case 'phishing': return <PhishingDemo />;
      case 'xss': return <XSSDemo />;
      case 'sql-injection': return <SQLInjectionDemo />;
      case 'csrf': return <CSRFDemo />;
      case 'mitm': return <MITMDemo />;
      case 'session-hijacking': return <SessionHijackingDemo />;
      case 'clickjacking': return <ClickjackingDemo />;
      case 'directory-traversal': return <DirectoryTraversalDemo />;
      case 'xxe': return <XXEDemo />;
      case 'ldap-injection': return <LDAPInjectionDemo />;
      case 'insecure-deserialization': return <InsecureDeserializationDemo />;
      default: return <PhishingDemo />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">VulnLabs</h1>
              <p className="text-gray-400 text-sm">Interactive Cybersecurity Attack Demonstrations</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                Attack Vectors
              </h2>
              <div className="space-y-2">
                {attacks.map((attack) => {
                  const Icon = attack.icon;
                  const isActive = activeAttack === attack.id;
                  return (
                    <button
                      key={attack.id}
                      onClick={() => setActiveAttack(attack.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        isActive
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                          : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <div className="flex-1">
                          <div className="font-medium">{attack.name}</div>
                          <div className={`text-xs px-2 py-1 rounded-full border inline-block mt-1 ${getRiskColor(attack.riskLevel)}`}>
                            {attack.riskLevel.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Educational Notice */}
            <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 mt-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-400">Educational Purpose</h3>
                  <p className="text-sm text-blue-300 mt-1">
                    These demonstrations are for learning cybersecurity concepts. Use this knowledge responsibly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg border border-gray-700">
              {/* Demo Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {attacks.find(a => a.id === activeAttack)?.name} Demonstration
                    </h2>
                    <p className="text-gray-400 mt-1">
                      {attacks.find(a => a.id === activeAttack)?.description}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-sm font-medium ${
                    getRiskColor(attacks.find(a => a.id === activeAttack)?.riskLevel || 'medium')
                  }`}>
                    {attacks.find(a => a.id === activeAttack)?.riskLevel.toUpperCase()} RISK
                  </div>
                </div>
              </div>

              {/* Demo Content */}
              <div className="p-6">
                {renderDemo()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;